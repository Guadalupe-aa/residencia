export function validarFuente(selector){
  let selectFuente = document.querySelector(selector +' #_tipoFuente');
  let tipoF = selectFuente.options[selectFuente.selectedIndex].value;
  let RESP = false, nombreFuente, fecha, MSJ = "";
  
  if (tipoF == "periodico") {
    let selectNombreFuente = document.querySelector(selector + ' #_nombrePeriodico');
    nombreFuente = selectNombreFuente.options[selectNombreFuente.selectedIndex].value;
  } else {
    nombreFuente = document.querySelector(selector + ' #_nombreFuente').value;
  }
  fecha = document.querySelector(selector +' #_fechaPublicacion').value;

  if(tipoF !== "" && nombreFuente !== "" && fecha !== ""){
    RESP= true;
  }else{
    RESP = false;
    if(tipoF == ""){
      RESP= false;
      MSJ = "¡Error! Seleccione un tipo de fuente";
      alertify.error(MSJ);
    }
    if(nombreFuente == ""){
      RESP= false;
      MSJ = "¡Error! Seleccione/ingrese un nombre de fuente";
      alertify.error(MSJ);
    }
    if(fecha == ""){
      RESP= false;
      MSJ = "¡Error! Seleccione una fecha";
      alertify.error(MSJ);
    }
  }
  return RESP;
}

export function validarFuentes(listaFuentes){
  let listaF = listaFuentes,RESP = false, MSJ = "Seleccione al menos una fuente de información";
  if(listaF == ""){
    RESP = false;
    alertify.alert(MSJ);
  }else{
    if(listaF.length > 0){
      RESP = true;
    }else{
      alertify.alert(MSJ);
    }
  }
  return RESP;
}

function validarNombre(selector){  
  let RESP = false;
  let nombre = document.querySelector(selector + ' #_nombre_victima').value;
  let apellido1 = document.querySelector(selector + ' #_apellido1_victima').value;
  let apellido2 = document.querySelector(selector + ' #_apellido2_victima').value;
  if(nombre !== "" || apellido1 !== "" || apellido2 !== ""){
    RESP = true;
  }else{
    RESP = false;
    alertify.error("Para el nombre debe ingresar al menos un dato");
  }
  return RESP;
}

function validarEdad(selector){  
  let RESP = false;
  let edad1 = document.querySelector(selector + ' #_edad_victima_min').value;
  let edad2 = document.querySelector(selector + ' #_edad_victima_max').value;

  if(edad1 !== "" && edad2 !== ""){
    if(edad1 > edad2){
      RESP = false;
      alertify.error("La edad mínima no debe ser mayor a la máxima");
    }else {
      RESP = true;
    }
  }else{
    RESP = false;
    alertify.error("Debe llenar los campos de edad");
  }

  return RESP;
}

function validarInfoLaboral(selector){
  let RESP = false;
  let selectOcupacion = document.querySelector(selector + ' #_ocupacion_victima');
  let ocupacion = selectOcupacion.options[selectOcupacion.selectedIndex].value
  let lugarTrabajo =  document.querySelector(selector + ' #_lugar_trabajo_victima').value;

  if(ocupacion !== ""){
    RESP = true;
  }else{
    RESP = false;
    alertify.error("Debe seleccionar la ocupación");
  }
  return RESP;
}

function validarInfoOrigen(selector){
  let RESP = false;
  let selectMunicipio = document.querySelector(selector + ' #_select_municipios_victima');
  let selectLocalidad = document.querySelector(selector + ' #_select_localidades_victima');
  let otroEstadoOrigen = document.querySelector(selector + ' #otroEstadoOrigen').value;

  let municipio = selectMunicipio.options[selectMunicipio.selectedIndex].value;
  let localidad = selectLocalidad.options[selectLocalidad.selectedIndex].value;

  if(municipio !== "" || otroEstadoOrigen !== ""){
    RESP = true;
  }else{
    RESP = false;
    alertify.error("Debe seleccionar al menos el municipio o llenar el campo de otro estado");
  }
  return RESP;
}

export function validarDatosVictima(selector){
  let RESP = false, MSJ = "";
  //RadioButtons de control de áreas
  let radioInfoPersonalSi = document.querySelector(selector + ' #_paso2_contenido1_si')?.checked;
  let radioInfoPersonalNo = document.querySelector(selector + ' #_paso2_contenido1_no')?.checked;
  console.log('radio1 '+radioInfoPersonalSi);

  let radioEdadSi = document.querySelector(selector + ' #_paso2_contenido1_1_si')?.checked;
  let radioEdadNo = document.querySelector(selector + ' #_paso2_contenido1_1_no')?.checked;

  let radioInfoLaboralSi = document.querySelector(selector + ' #_paso2_contenido2_si')?.checked;
  let radioInfoLaboralNo = document.querySelector(selector + ' #_paso2_contenido2_no')?.checked;

  let radioInfoOrigenSi = document.querySelector(selector + ' #_paso2_contenido3_si')?.checked;
  let radioInfoOrigenNo = document.querySelector(selector + ' #_paso2_contenido3_no')?.checked;

  RESP = (radioInfoPersonalSi || radioInfoPersonalNo) ? true: false;
  RESP = (radioEdadSi || radioEdadNo) ? true: false;
  RESP = (radioInfoLaboralSi || radioInfoLaboralNo) ? true: false;
  RESP = (radioInfoOrigenSi || radioInfoOrigenNo) ? true: false;
  if(!RESP){
    alertify.alert('Debe elegir una opción para cada pregunta');
  }
  
  //Campos datos generales

  if(radioInfoPersonalSi){
    RESP = validarNombre(selector);
  }
  if(radioEdadSi){
    RESP = validarEdad(selector);
  }

  if(radioInfoLaboralSi){
    RESP = validarInfoLaboral(selector);
  }
  if(radioInfoOrigenSi){
    RESP = validarInfoOrigen(selector);
  }
  return RESP;
}

function validarAgresor(){}

export function validarAgresores(selector){
  let RESP = false;
  //RadioButtons de control de áreas
  let agresor_si = document.querySelector(selector + ' #_paso3_contenido1_si').checked;
  let agresor_no = document.querySelector(selector + ' #_paso3_contenido1_no').checked;
  
  RESP = (agresor_si || agresor_no) ? true : false;
  if(!RESP){
    alertify.alert('Debe elegir una respuesta');
  }
  if(agresor_si){
    let num = document.querySelector(selector + " #tablaAgresoresSeleccionados").getElementsByTagName('tr').length;
    console.log("El tamaño es ", num);
    RESP = num > 0 ? true: false;
    if(!RESP){
      alertify.error('Debe alejir al menos un agresor');
    }
  }
 
  return RESP;
}

export function validarLugarHallazgo(selector){
  let RESP =- false;
   //Campos
   let fecha = document.querySelector(selector + ' #_fecha_hallazgo').value;
   let selectMunicipio = document.querySelector(selector + ' #_select_municipio_hallazgo');
  // let selectLocalidad = document.querySelector(selector + ' #_select_localidades_hallazgos');
   let selectLugarEncuentro = document.querySelector(selector + ' #_lugar_encuentro_hallazgo');

   let municipio = selectMunicipio.options[selectMunicipio.selectedIndex].value;
   //let localidad = selectLocalidad.options[selectLocalidad.selectedIndex].value;
   let lugarEncuentro = selectLugarEncuentro.options[selectLugarEncuentro.selectedIndex].value;
 
 
   if(fecha !== "" && municipio !== "" && lugarEncuentro !== ""){
     RESP = true;
   }else{
     RESP = false;
     alertify.alert("Los campos de fecha, municipio y lugar de encuentro son obligatorios");
   }
   //document.querySelector(selector + ' #_lugar_encuentro_hallazgo').value = objLugarHallazgo.lugarEncuentro;
   //document.querySelector(selector + ' #_referencias_lugar_hallazgo').value = objLugarHallazgo.referencias;
   return RESP;
}

export function validarCausas(selector){
  
  let RESP = false,
  checksCausas = document.querySelectorAll(selector + ` input[name="_causas_check"]:checked`),
  selectTipoInstrumento = document.querySelector(selector + ' #_instrumento_empleado'),
  instrumento = selectTipoInstrumento.options[selectTipoInstrumento.selectedIndex].value;

  if(checksCausas.length > 0 && instrumento !== ""){
    RESP = true;
  }else{
    if(checksCausas.length <= 0){
      alertify.error('¡Error! Debe elegir al menos una causa de muerte');
    }
    if(instrumento == ""){
      alertify.error('¡Error! Debe elegir un tipo de instrumento');
    }
  }
  //document.querySelector(selector + ' ' + '#_detalles_causa_muerte').value = objCausas.especificaciones;
  //document.querySelector(selector + ' ' + '#_nombreInstrumento').value = objCausas.instrumento;
  return RESP;
}

export function validarCaracteristicas(selector){
  let RESP = false,
  checksCaracteristicas = document.querySelectorAll(selector + ` input[name="_caracteristicas_violencia_check"]:checked`),
  checksAmbito = document.querySelectorAll(selector + ` input[name="_ambito_check"]:checked`);

  if(checksCaracteristicas.length > 0 && checksAmbito.length > 0){
    RESP = true;
  }else{
    if(checksCaracteristicas.length <= 0){
      alertify.error('¡Error! Debe elegir al menos una características');
    }
    if(checksAmbito.length <= 0){
      alertify.error('¡Error! Debe elegir al menos un tipo de ámbito');
    }
  }
  return RESP;
}