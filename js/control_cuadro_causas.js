import * as bd from "../js/conexion_bd.js";
import { llenarAnnios } from "./funcionalidades/cargar_datos_json_locales.js";
import { llenarCuadroCausas } from '../js/funcionalidades/control _tablas.js';
import { generarPDF, generarCSV } from '../js/funcionalidades/helpers.js';

let annios, listaHallazgosPorAnnio, listaHallazgosPorMunicipio, listaMun, listaHMesMunicipio, listaTotalMes;

let selectAnnio = document.getElementById("slct_annios");
let selectExportar = document.getElementById("slct_exportar");

//Obtención de datos de la BD
const listarDatos = (res) => {
  let data = new Array();
   Object.keys(res.data).forEach(k => { 
     data.push(res.data[k]); 
   });
   console.log(data);
  return data;
};
bd.obtenerDatos("causas").then((resp) => {
  if (resp.status == 200) {
    let listaDatos = listarDatos(resp);
    annios = recuperarAnnios(listaDatos);
    listaHallazgosPorAnnio = recuperarHallazgosPorAnnio(listaDatos, annios);
    llenarAnnios(annios, "slct_annios");
    //console.log(listaDatos, ' ', annios, ' ', listaHallazgosPorAnnio);
  }else {
    alertify.alert("No hay datos para mostrar.", function(){
      alertify.message('Aceptar');
    });
  }
});
// Obtención de datos para la generación de la gráfica
function recuperarAnnios(listaD) {
  let data = new Array(), fecha, annio;
  listaD.forEach((elemento) => {
    fecha = new Date(elemento[0]);
    annio = fecha.getUTCFullYear();
    if (!data.includes(annio)) { data.push(annio); }
  });
  data.sort(function (a, b) { return b - a; });
  return data;
}
function realizarConteo(listaD) {
   listaMun = recuperarMunicipios(listaD);
   listaHallazgosPorMunicipio =  recuperarHallazgosPorMunicipio(listaMun, listaD);
   console.log(listaMun);
   //listaHMesMunicipio = contarCasosPorMunicipioporMes(listaHallazgosPorMunicipio);
   //listaTotalMes = obtenerTotalPorMes(listaHMesMunicipio);
   //let etiquetasM = recuperarNombreMpio(listaMun);
   //llenarCuadroMunicipios(etiquetasM, listaHMesMunicipio, listaTotalMes, 'cuadro_municipio', 'cuadro_municipio_total');
}
function recuperarHallazgosPorAnnio(listaD, listaA) {
  let data = new Array(), l = new Array();
  listaA.forEach(el => { 
    data.push(
      listaD.filter(function (caso) {
        let year = new Date(caso[0]);
        return year.getUTCFullYear() == el;
      })
    );
  });
  try{
    data.forEach(el => {
      l.push(el.map(x => {
        //console.log(x[1].causas)
        if(x[1].causas == null){
          console.log('aqui truena ', x);
        }
        return x[1].causas
      }));
    }); 
  }catch(e){
    console.log('error' + e);
  }

  return l;
}
function recuperarCausasM(data) {
  let  listaM = new Array();
  let causaString;
  data.forEach(el => {
    causaString = obtenerString(el);
    if (!listaM.includes(causaString)) { 
      listaM.push(causaString);
    }
  });//console.log(listaM);
  listaM.sort((a, b) => a.localeCompare(b));
  console.log(listaM);
  return listaM;
}
function recuperarCausas(data, listaCausas) {
  let  listaM = new Array(), dataResult = new Array();
  let causaString;
  data.forEach(el => {
    causaString = obtenerString(el);  
    listaM.push(causaString);
  });//console.log(listaM);
  listaM.sort((a, b) => a.localeCompare(b));

  listaCausas.forEach(el => { 
    dataResult.push(
      listaM.filter(function (causa) {
        return causa.toUpperCase() == el.toUpperCase();
      })
    );
  });

  console.log(dataResult);
  return dataResult;
}
function obtenerString(listaS){
  let cadena = '';
  for(let i = 0; i < listaS.length; i++){
    cadena += listaS[i].valor;
    if( i < listaS.length - 1)
      cadena += '-';
  }
  return cadena;
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

//Manejador de evento

selectAnnio.addEventListener("change", (e) => {
  let i, valor = e.target.value;
  i = annios.indexOf(parseInt(valor));
  
 document.getElementById('cuadro_annio').innerHTML = `Año ${valor}`;
  console.log(i);
  let data = recuperarCausasM(listaHallazgosPorAnnio[i]);
  let data2 =  recuperarCausas(listaHallazgosPorAnnio[i], data);

  let d = data2.map(function(x) {
    return x.length;
 });
 let total = 0;
  d.forEach(x => total += x);
  console.log('data ', data);
  console.log('d ', d);
  llenarCuadroCausas(data, d, total, 'tb_causas', 'tf_causas');


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
