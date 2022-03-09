import { obtenerDatos } from "../conexion_bd.js";

function obtenerDatosVictima(selector){
  let victima;
  let radioInfoPersonalSi = document.querySelector(selector + ' #_paso2_contenido1_si')?.checked;
  let radioInfoPersonalNo = document.querySelector(selector + ' #_paso2_contenido1_no')?.checked;
  console.log('radio1 '+radioInfoPersonalSi);

  let radioEdadSi = document.querySelector(selector + ' #_paso2_contenido1_1_si')?.checked;
  let radioEdadNo = document.querySelector(selector + ' #_paso2_contenido1_1_no')?.checked;

  let radioInfoLaboralSi = document.querySelector(selector + ' #_paso2_contenido2_si')?.checked;
  let radioInfoLaboralNo = document.querySelector(selector + ' #_paso2_contenido2_no')?.checked;

  let radioInfoOrigenSi = document.querySelector(selector + ' #_paso2_contenido3_si')?.checked;
  let radioInfoOrigenNo = document.querySelector(selector + ' #_paso2_contenido3_no')?.checked;
  let nombre = "", apellido1 = "", apellido2 = "", edad1 = "", edad2 = "", ocupacion = "", lugarTrabajo = "", municipio = "", localidad = "", otroEstadoOrigen = "";
  if(radioInfoPersonalSi){
    nombre = document.querySelector(selector + ' #_nombre_victima').value;
    apellido1 = document.querySelector(selector + ' #_apellido1_victima').value;
    apellido2 = document.querySelector(selector + ' #_apellido2_victima').value;
  }
  if(radioEdadSi){
    edad1 = document.querySelector(selector + ' #_edad_victima_min').value;
    edad2 = document.querySelector(selector + ' #_edad_victima_max').value;
  }
  if(radioInfoLaboralSi){
    let selectOcupacion = document.querySelector(selector + ' #_ocupacion_victima');
    ocupacion = selectOcupacion.options[selectOcupacion.selectedIndex].value
    lugarTrabajo =  document.querySelector(selector + ' #_lugar_trabajo_victima').value;
  }
  if(radioInfoOrigenSi){
    let selectMunicipio = document.querySelector(selector + ' #_select_municipios_victima');
    let selectLocalidad = document.querySelector(selector + ' #_select_localidades_victima');
    municipio = selectMunicipio.options[selectMunicipio.selectedIndex].value;
    localidad = selectLocalidad.options[selectLocalidad.selectedIndex].value;
    otroEstadoOrigen = document.querySelector(selector + ' #otroEstadoOrigen').value;
  }
 
  victima = {
    'identificada': radioInfoPersonalSi ? "si": "no",
    'nombre': nombre,
    'apellidoPaterno': apellido1,
    'apellidoMaterno': apellido2,
    'edad': radioEdadSi ? "si": "no",
    'edadMinima': edad1,
    'edadMaxima': edad2,
    'infoLaboral': radioInfoLaboralSi ? "si": "no",
    'ocupacion': ocupacion,
    'lugarTrabajo': lugarTrabajo,
    'infoOrigen': radioInfoOrigenSi ? "si": "no",
    'municipio': municipio,
    'localidad': localidad,
    'otroEstadoOrigen': otroEstadoOrigen
  }
  return victima;
}

function obtenerAgresores(selector, lista){
  //RadioButtons de control de áreas
  let agresor_si = document.querySelector(selector + ' #_paso3_contenido1_si').checked;
  let agresor_no = document.querySelector(selector + ' #_paso3_contenido1_no').checked;  
  let agresores, listaIds;

  if(agresor_si){
    listaIds = lista.map(i => {
      return {"id": i.id};
    })
  }
  agresores = {
    'identificado': agresor_si  ? "si" : "no",
    'agresores':  listaIds
  }
  return agresores;
}

function obtenerLugarHallazgo(selector){
   //Campos
   let fecha = document.querySelector(selector + ' #_fecha_hallazgo').value;
   let selectMunicipio = document.querySelector(selector + ' #_select_municipio_hallazgo');
   let selectLocalidad = document.querySelector(selector + ' #_select_localidades_hallazgos');
   let selectLugarEncuentro = document.querySelector(selector + ' #_lugar_encuentro_hallazgo');
   let municipio = selectMunicipio.options[selectMunicipio.selectedIndex].value;
   let localidad = selectLocalidad.options[selectLocalidad.selectedIndex].value;
   let lugarEncuentro = selectLugarEncuentro.options[selectLugarEncuentro.selectedIndex].value;
   let referencias = document.querySelector(selector + ' #_referencias_lugar_hallazgo').value;

  const lugarHallazgo = {
    'fecha': fecha, 
    'municipio': municipio, 
    'localidad': localidad, 
    'lugarEncuentro': lugarEncuentro, 
    'referencias': referencias, 
  }
  return lugarHallazgo;
}

function obtnerCausas(selector){
  let checksCausas = document.querySelectorAll(selector + ` input[name="_causas_check"]:checked`),
  selectTipoInstrumento = document.querySelector(selector + ' #_instrumento_empleado'),
  tipoInstrumento = selectTipoInstrumento.options[selectTipoInstrumento.selectedIndex].value,
  detalles = document.querySelector(selector + ' ' + '#_detalles_causa_muerte').value,
  instrumento = document.querySelector(selector + ' #_nombreInstrumento').value;
  let causas =  new Array(); 

  checksCausas.forEach(item => {
    causas.push({'valor': item.value});
  });
  let objCausas = {
    'causas': causas,
    'especificaciones': detalles,
    'tipoIntrumento': tipoInstrumento,
    'instrumento': instrumento
  }  
  return objCausas;
}

function obtenerCaracteristicas(selector){
  let checksCaracteristicas = document.querySelectorAll(selector + ` input[name="_caracteristicas_violencia_check"]:checked`),
  checksAmbito = document.querySelectorAll(selector + ` input[name="_ambito_check"]:checked`),  
  diligencias = document.querySelector(selector + ' ' + '#_diligencias_practicadas').value,
  observaciones = document.querySelector(selector + ' ' + '#_observaciones_caracteristicas_violencia').value;
  let caracteristicas =  new Array(), ambito = []; 
  checksCaracteristicas.forEach(item => {
    caracteristicas.push({'valor': item.value});
  });    
  checksAmbito.forEach(item => {
    ambito.push({'valor': item.value});
  });   

  let objCaracteristicas = {
    'caracteristicas': caracteristicas,
    'ambito': ambito,
    'diligencias':diligencias,
    'observaciones': observaciones,
  }
  return objCaracteristicas;
}

export function obtenerDatosCaso(selector, listaF, listaA){
  let caso = {
    'fuenteInformacion': listaF,
    'victima': obtenerDatosVictima(selector),
    'agresores': obtenerAgresores(selector, listaA),
    'lugarHallazgo': obtenerLugarHallazgo(selector),
    'causaMuerte': obtnerCausas(selector),
    'caracteristicasViolencia': obtenerCaracteristicas(selector)
  }
  return caso;
}