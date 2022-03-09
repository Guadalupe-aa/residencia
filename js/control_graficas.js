import * as bd from "../js/conexion_bd.js";
import { getListaMunicipios, llenarAnnios } from "./funcionalidades/cargar_datos_json_locales.js";
import { generarPDF, generarCSV } from '../js/funcionalidades/helpers.js';

let annios, listaHallazgosPorAnnio, listaHallazgosPorMunicipio, listaMun;
let listaMunicipios = getListaMunicipios();
let selectAnnios  = document.getElementById("slct_annios");
let selectExportar = document.getElementById("slct_exportar");
//Obtención de datos de la BD
const listarDatos = (res) => {
  let data = new Array();
   Object.keys(res.data).forEach(k => { 
     data.push(res.data[k]); 
   });
  return data;
};
bd.obtenerDatos("hallazgos").then((resp) => {
  if (resp.status == 200) {
    let listaDatos = listarDatos(resp);
    annios = recuperarAnnios(listaDatos);
    listaHallazgosPorAnnio = recuperarHallazgosPorAnnio(listaDatos, annios);
    llenarAnnios(annios, "slct_annios");
    //console.log(listaDatos, ' ', annios, ' ', listaHallazgosPorAnnio);
  }else if (resp.status == 204) {
    alertify.alert("No hay datos para mostrar.", function(){
      alertify.message('Aceptar');
    });
  }else if (resp.status >= 500) {
    alertify.alert("Error del servidor", function(){
      alertify.message('Aceptar');
    });
  }
});
// Obtención de datos para la generación de la gráfica
function recuperarAnnios(listaD) {
  let data = new Array(), fecha, annio;

  listaD.forEach((elemento) => {
    fecha = new Date(elemento.fecha);
    annio = fecha.getUTCFullYear();
    console.log(fecha);
    console.log('annio ', annio);
    if (!data.includes(annio)) { data.push(annio); }
  });
  data.sort(function (a, b) { return b - a; });
  return data;
}
function realizarConteo(listaD) {
   listaMun = recuperarMunicipios(listaD);
   listaHallazgosPorMunicipio =  recuperarHallazgosPorMunicipio(listaMun, listaD);
}
function recuperarHallazgosPorAnnio(listaD, listaA) {
  let data = new Array();
  listaA.forEach(el => { 
    data.push(
      listaD.filter(function (caso) {
        let year = new Date(caso.fecha);
        return year.getUTCFullYear() == el;
      })
    );
  }); 
  return data;
}
function recuperarMunicipios(data) {
  let  listaM = new Array();
  data.sort((a, b) => a.municipio.localeCompare(b.municipio));
  data.forEach(el => {
    if (!listaM.includes(el.municipio)) { 
       listaM.push(el.municipio);
     }
  });
  return listaM;
}
function recuperarHallazgosPorMunicipio(listaM, listaD) {
  let data = new Array();
  listaM.forEach(el => {
    data.push(
      listaD.filter(caso => { return el == caso.municipio; })
    );
  });
  return data;
}
function recuperarNombreMpio(lista) {
  let listaNombres = new Array();
  for (let i = 0; i < lista.length; i++) {
    for (let j = 0; j < listaMunicipios.length; j++) {
      if (lista[i] == listaMunicipios[j].valor) {
        listaNombres.push(listaMunicipios[j].nombre);
        break;
      }
    }
  }
  return listaNombres;
}
const crearGrafica = (municipios, annio, datos, total) => {
  let ctx = document.getElementById("grafica").getContext("2d");
  // Store the current transformation matrix
ctx.save();
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.clearRect(0, 0, document.getElementById("grafica").width, document.getElementById("grafica").height);

 let speedData = {
    labels: municipios,
    datasets: [
      {
        label:  "Año " + annio +  " - Total: " + total,
        data: datos,
        backgroundColor: "#CE93D8",
      },
    ],
  };
  let chartOptions = {
    title: {
      display: true,
      text: "Muertes Dolosas con Presuncion de Feminicidios",
    },
    legend: {
      display: true,
      position: "top",
      labels: {
        boxWidth: 40,
        fontColor: "black",
        fontSize: 18,
      },
    },
    scales: {
      yAxes: [
          {
            min: 0,
              ticks: {                                    
                  stepSize: 1, 
                  beginAtZero: true  
              }
          }
      ]
  }
  };
  let chart = new Chart(ctx, {
    type: "bar",
    data: speedData,
    options: chartOptions,
  });
};

//Manejador de evento
selectAnnios.addEventListener("change", (e) => {
  let i, valor = e.target.value;
  i = annios.indexOf(parseInt(valor));
  let data = listaHallazgosPorAnnio[i];
  realizarConteo(data);
  let etiquetasM = recuperarNombreMpio(listaMun);

  let d = listaHallazgosPorMunicipio.map(function(x) {
    return x.length;
 });
  crearGrafica(etiquetasM, valor, d, data.length);
});

selectExportar.addEventListener("change", (e) => {
  let valor = e.target.value;
  generarPDF('seccion_grafica');
 // alertify.success('Documento PDF generado');
});