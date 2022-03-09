import * as bd from "../js/conexion_bd.js";
import { getListaMunicipios, llenarAnnios } from "./funcionalidades/cargar_datos_json_locales.js";
import { llenarCuadroMunicipios } from '../js/funcionalidades/control _tablas.js';
import { generarPDF, generarCSV } from '../js/funcionalidades/helpers.js';

let annios, listaHallazgosPorAnnio, listaHallazgosPorMunicipio, listaMun, listaHMesMunicipio, listaTotalMes;
let listaMunicipios = getListaMunicipios();
let selectAnnio = document.getElementById("annios_grafica");
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
    llenarAnnios(annios, "annios_grafica");
    console.log(listaDatos, ' ', annios, ' ', listaHallazgosPorAnnio);
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
    console.log('FECHA ', fecha);
    annio = fecha.getUTCFullYear();
    console.log('ANNIO ',annio);
    if (!data.includes(annio)) { data.push(annio); }
    //if(annio == 2020)
    //  console.log('uhmm ',elemento);
  });
  data.sort(function (a, b) { return b - a; });
  return data;
}
function realizarConteo(listaD) {
   listaMun = recuperarMunicipios(listaD);
   listaHallazgosPorMunicipio =  recuperarHallazgosPorMunicipio(listaMun, listaD);
   console.log(listaMun);
   listaHMesMunicipio = contarCasosPorMunicipioporMes(listaHallazgosPorMunicipio);
   listaTotalMes = obtenerTotalPorMes(listaHMesMunicipio);
   let etiquetasM = recuperarNombreMpio(listaMun);
   llenarCuadroMunicipios(etiquetasM, listaHMesMunicipio, listaTotalMes, 'cuadro_municipio', 'cuadro_municipio_total');
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
    if (!listaM.includes(el.municipio)) { listaM.push(el.municipio); }
  });
  return listaM;
}
function recuperarHallazgosPorMunicipio(listaM, listaD) {
  let data = new Array();
  listaM.forEach(el => {
    data.push(
      listaD.filter(caso => { return el == caso.municipio; })
    );
  });// contarPorMpio();
  console.log(data)
  return data;
}
function contarCasosPorMunicipioporMes(listaD){
  let data = new Array();
  listaD.forEach(el => {
    data.push(obtenerCasosPorMes(el));
  });
  return data;
}
function obtenerCasosPorMes(listaHallazgos) {
  let casosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fecha, mes;
  listaHallazgos.forEach(elemento => {
    fecha = new Date(elemento.fecha);
    mes = fecha.getUTCMonth();
    casosPorMes[mes] += 1;
    casosPorMes[12] += 1;
  });
  return casosPorMes;
}
function obtenerTotalPorMes(listaD){
  let casosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  listaD.forEach(el => {
    for(let i = 0; i < el.length; i ++){
       casosPorMes[i] += el[i];
    }
  });
  return casosPorMes;
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


//Manejador de evento
selectAnnio.addEventListener("change", (e) => {
  let i, valor = e.target.value;
  i = annios.indexOf(parseInt(valor));
  
 document.getElementById('cuadro_annio').innerHTML = `Año ${valor}`;
  console.log(i);
  realizarConteo(listaHallazgosPorAnnio[i]);
});

selectExportar.addEventListener("change", (e) => {
  let valor = e.target.value;
  if(valor == 'pdf'){
    generarPDF('cuadro_municipios');
    alertify.success('Documento PDF generado');
  }else {
    generarCSV('tc');
    alertify.success('Documento CSV generado');
  }
});
