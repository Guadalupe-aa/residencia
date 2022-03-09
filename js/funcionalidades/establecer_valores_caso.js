import { llenarTablaFuentes, llenarTablaAgresoresSeleccionados } from "./control _tablas.js";
import * as bd from '../conexion_bd.js';
import * as area from '../funcionalidades/control_areas.js';
import * as cdj from '../funcionalidades/cargar_datos_json_locales.js';

let listaAgresores;

export function establecerValores(objCaso, selectorBase){
  //console.log('caso ', objCaso);
  establecerFuentes(objCaso.fuenteInformacion, selectorBase);
  establecerDatosVictima(objCaso.victima, selectorBase);
  establecerAgresores(objCaso.agresores, selectorBase);
  establecerLugarHallazgo(objCaso.lugarHallazgo, selectorBase);
  establecerCausas(objCaso.causaMuerte, selectorBase);
  establecerCaracteristicas(objCaso.caracteristicasViolencia, selectorBase);
}
function establecerFuentes(objFuente){
  //console.log('fuente ', objFuente);
  llenarTablaFuentes(objFuente, 'tablaFuentes_edit');
}
function establecerDatosVictima(objVictima, selectorBase){
 //console.log('victima ', objVictima);

  //RadioButtons de control de áreas
  document.querySelector(selectorBase + ' #_paso2_contenido1_si').checked = objVictima.identificada == "si" ? true: false;
  document.querySelector(selectorBase + ' #_paso2_contenido1_no').checked = objVictima.identificada == "no" ? true: false;

  document.querySelector(selectorBase + ' #_paso2_contenido1_1_si').checked = objVictima.edad == "si" ? true: false;
  document.querySelector(selectorBase + ' #_paso2_contenido1_1_no').checked = objVictima.edad == "no" ? true: false;

  document.querySelector(selectorBase + ' #_paso2_contenido2_si').checked = objVictima.infoLaboral == "si" ? true: false;
  document.querySelector(selectorBase + ' #_paso2_contenido2_no').checked = objVictima.infoLaboral == "no" ? true: false;

  document.querySelector(selectorBase + ' #_paso2_contenido3_si').checked = objVictima.infoOrigen == "si" ? true: false;
  document.querySelector(selectorBase + ' #_paso2_contenido3_no').checked = objVictima.infoOrigen == "no" ? true: false;

  //Control de áreas
  if(objVictima.identificada == "si"){
    area.eliminarClase('v_si');
  }else{
    area.anadirClase('v_si');
  }

  if(objVictima.edad == "si"){
    area.eliminarClase('v_edad');
  }else{
    area.anadirClase('v_edad');
  }

  if(objVictima.infoLaboral == "si"){
    area.eliminarClase('info_laboral');
  }else{
    area.anadirClase('info_laboral');
  }

  if(objVictima.infoOrigen == "si" ){
    if(objVictima.municipio !== "")
      cdj.llenarLocalidadesSep(objVictima.municipio, '_select_localidades_victima', selectorBase);
    area.eliminarClase('info_origen');
  }else{
    area.anadirClase('info_origen');
  }

  //Campos datos generales
  document.querySelector(selectorBase + ' #_nombre_victima').value = objVictima.nombre = objVictima.nombre;
  document.querySelector(selectorBase + ' #_apellido1_victima').value = objVictima.apellidoPaterno;
  document.querySelector(selectorBase + ' #_apellido2_victima').value = objVictima.apellidoMaterno;


  document.querySelector(selectorBase + ' #_edad_victima_min').value = objVictima.edadMinima;
  document.querySelector(selectorBase + ' #_edad_victima_max').value = objVictima.edadMaxima;

  //Campos ocupacion laboral
  document.querySelector(selectorBase + ' #_ocupacion_victima').value = objVictima.ocupacion;
  document.querySelector(selectorBase + ' #_lugar_trabajo_victima').value = objVictima.lugarTrabajo;
  //Campos datos de origen
  document.querySelector(selectorBase + ' #_select_municipios_victima').value = objVictima.municipio;
  document.querySelector(selectorBase + ' #_select_localidades_victima').value = objVictima.localidad;
  document.querySelector(selectorBase + ' #lblMunicipio').innerHTML = objVictima.localidad;
  document.querySelector(selectorBase + ' #otroEstadoOrigen').value = objVictima.otroEstadoOrigen;
}

function establecerAgresores(objAgresores, selectorBase){
  //RadioButtons de control de áreas
  document.querySelector(selectorBase + ' #_paso3_contenido1_si').checked = objAgresores.identificado == "si" ? true : false;
  document.querySelector(selectorBase + ' #_paso3_contenido1_no').checked = objAgresores.identificado == "no" ? true : false;
  if(objAgresores.identificado == "si"){
    let list = obtenerListaAgresores(objAgresores.agresores);
    llenarTablaAgresoresSeleccionados(list, selectorBase);
    area.eliminarClase('info_agresor');
  }else{
    area.anadirClase('info_agresor');
  }

}
function establecerLugarHallazgo(objLugarHallazgo, selectorBase){
  //console.log('lugar hallazgo ',objLugarHallazgo);  
  //Campos

  document.querySelector(selectorBase + ' #_fecha_hallazgo').value = objLugarHallazgo.fecha ;
  document.querySelector(selectorBase + ' #_select_municipio_hallazgo').value = objLugarHallazgo.municipio;
  if(objLugarHallazgo.municipio !== "")
     cdj.llenarLocalidadesSep(objLugarHallazgo.municipio, '_select_localidades_hallazgos', selectorBase);
  document.querySelector(selectorBase + ' #_select_localidades_hallazgos').value = objLugarHallazgo.localidad;
  document.querySelector(selectorBase + ' #lblMunicipio_2').innerHTML = objLugarHallazgo.localidad;

  console.log("lugar ", objLugarHallazgo.localidad);
  //console.log( document.querySelector(selectorBase + ' ' + '#_select_localidades_hallazgos'));
  document.querySelector(selectorBase + ' #_lugar_encuentro_hallazgo').value = objLugarHallazgo.lugarEncuentro;
  document.querySelector(selectorBase + ' #_referencias_lugar_hallazgo').value = objLugarHallazgo.referencias;
}
function establecerCausas(objCausas, selectorBase){
  let causas = objCausas.causas;
  //Obtener referencias de selects
  let checksCausas = document.querySelectorAll(selectorBase + ` input[name="_causas_check"]`);
  //Campos
  causas.forEach(causa => {
    checksCausas.forEach(el => {
      if(causa.valor === el.value)
        el.checked = true;
    });
  });

  document.querySelector(selectorBase + ' ' + '#_detalles_causa_muerte').value = objCausas.especificaciones;
  document.querySelector(selectorBase + ' ' + '#_instrumento_empleado').value = objCausas.tipoIntrumento;
  document.querySelector(selectorBase + ' ' + '#_nombreInstrumento').value = objCausas.instrumento;
}
function establecerCaracteristicas(objCaracteristicas, selectorBase){
  let caracteristicas = objCaracteristicas.caracteristicas;
  let ambitos = objCaracteristicas.ambito;
  //Referencias de selects
  let checksCaracteristicasViolencia = document.querySelectorAll(selectorBase + ` input[name="_caracteristicas_violencia_check"]`);
  let checksAmbito = document.querySelectorAll(selectorBase + ` input[name="_ambito_check"]`);

  //Campos
  caracteristicas.forEach(c => {
    checksCaracteristicasViolencia.forEach(el => {
      if(c.valor === el.value)
        el.checked = true;
    });
  })
 
  ambitos.forEach(a => {
    checksAmbito.forEach(el => {
      if(a.valor === el.value)
        el.checked = true;
    });
  }); 

  document.querySelector(selectorBase + ' ' + '#_diligencias_practicadas').value = objCaracteristicas.diligencias;
  document.querySelector(selectorBase + ' ' + '#_observaciones_caracteristicas_violencia').value = objCaracteristicas.observaciones;
}

function listarDatos(res){
  listaAgresores = new Array();
  let data;
  if (res.status == 200) {
    data = res.data;
    Object.keys(data).forEach(k => {
      listaAgresores.push(data[k]);
    });
  }
}
function obtenerListaAgresores(listaA){
  let l =  new Array();
  listaA.forEach(a => {
    listaAgresores.forEach(ag => {
      if(a.id === ag.id){
        l.push(ag);
      }
    });
  });
  //console.log(l);
  return l;
}
bd.obtenerDatos('agresores').then(resp => {
  listarDatos(resp);
}).catch(error => {
  console.log(error);
});