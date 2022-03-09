function limpiarFuentes(selectorBase ){
  //Campos
  document.querySelector(selectorBase + ' #_tipoFuente').value = "";
  document.querySelector(selectorBase + ' #_nombreFuente').value = "";
  document.querySelector(selectorBase + ' #_nombrePeriodico').value = "";
  document.querySelector(selectorBase + ' #_fechaPublicacion').value = "";
  //Tabla
  document.querySelector(selectorBase + ' ' + '#tablaFuentes_edit').innerHTML = "";
  //console.log('tabla ',document.querySelector(selectorBase + ' ' + '#tablaFuentes_edit'));
}
function limpiarDatosVictima(selectorBase){
  //RadioButtons de control de áreas
  document.querySelector(selectorBase + ' #_paso2_contenido1_si').checked = false;
  document.querySelector(selectorBase + ' #_paso2_contenido1_no').checked = false;

  document.querySelector(selectorBase + ' #_paso2_contenido1_1_si').checked = false;
  document.querySelector(selectorBase + ' #_paso2_contenido1_1_no').checked = false;

  document.querySelector(selectorBase + ' #_paso2_contenido2_si').checked = false;
  document.querySelector(selectorBase + ' #_paso2_contenido2_no').checked = false;

  document.querySelector(selectorBase + ' #_paso2_contenido3_si').checked = false;
  document.querySelector(selectorBase + ' #_paso2_contenido3_no').checked = false;
  //Campos datos generales
  document.querySelector(selectorBase + ' #_nombre_victima').value = "";
  document.querySelector(selectorBase + ' #_apellido1_victima').value = "";
  document.querySelector(selectorBase + ' #_apellido2_victima').value = "";
  //document.querySelector(selectorBase + ' #_edad_victima').value = "";
  document.querySelector(selectorBase + ' #_edad_victima_min').value = "";
  document.querySelector(selectorBase + ' #_edad_victima_max').value = "";
  //Campos ocupacion laboral
  document.querySelector(selectorBase + ' #_ocupacion_victima').value = "";
  document.querySelector(selectorBase + ' #_lugar_trabajo_victima').value = "";
  //Campos datos de origen
  document.querySelector(selectorBase + ' #_select_municipios_victima').value = "";
  //document.querySelector(selectorBase + ' #_select_localidades_victima').value = "";
  document.querySelector(selectorBase + ' #lblMunicipio').innerHTML = "";
}
function limpiarDatosAgresor(selectorBase, selectorBase2){
  //RadioButtons de control de áreas
  document.querySelector(selectorBase + ' #_paso3_contenido1_si').checked = false;
  document.querySelector(selectorBase + ' #_paso3_contenido1_no').checked = false;
  limpiarConsultaAgresor(selectorBase2);

}
function limpiarLugarHallazgo(selectorBase){
  //Campos
  document.querySelector(selectorBase + ' ' + '#_fecha_hallazgo').value = "";
  document.querySelector(selectorBase + ' ' + '#_select_municipio_hallazgo').value = "";
 // document.querySelector(selectorBase + ' ' + '#_select_localidades_hallazgos').value = "";
  document.querySelector(selectorBase + ' ' + '#_lugar_encuentro_hallazgo').value = "";
  document.querySelector(selectorBase + ' ' + '#_referencias_lugar_hallazgo').value = "";
  document.querySelector(selectorBase + ' #lblMunicipio_2').innerHTML = "";

}
function limpiarCausasMuerte(selectorBase){
  //Campos
  let checksCausas = document.querySelectorAll(selectorBase + ` input[name="_causas_check"]`);

  checksCausas.forEach(el => {
    el.checked = false;
  });
  document.querySelector(selectorBase + ' #_detalles_causa_muerte').value = "";
  document.querySelector(selectorBase + ' #_instrumento_empleado').value = "";
  document.querySelector(selectorBase + ' #_nombreInstrumento').value = "";
}
function limpiarCaracteristicasViolencia(selectorBase){
  //Campos
  let checksCaracteristicasViolencia = document.querySelectorAll(selectorBase + ` input[name="_caracteristicas_violencia_check"]`);
  let checksAmbito = document.querySelectorAll(selectorBase + ` input[name="_ambito_check"]`);

  checksCaracteristicasViolencia.forEach(el => {
    el.checked = false;
  });
  
  checksAmbito.forEach(el => {
    el.checked = false;
  });

  document.querySelector(selectorBase + ' ' + '#_diligencias_practicadas').value = "";
  document.querySelector(selectorBase + ' ' + '#_observaciones_caracteristicas_violencia').value = "";
}
function limpiarConsultaAgresor(selectorBase){
  //Campos
  document.querySelector(selectorBase + ' ' + '#nombreABuscar').value = "";
  //Tablas
  document.querySelector(selectorBase + ' ' + '#tablaAgresores').innerHTML = "";
}
export function limpiarCampos(selectorBase, selectorBase2){
  limpiarFuentes(selectorBase);
  limpiarDatosVictima(selectorBase);
  limpiarDatosAgresor(selectorBase, selectorBase2);
  limpiarLugarHallazgo(selectorBase);
  limpiarCausasMuerte(selectorBase);
  limpiarCaracteristicasViolencia(selectorBase);
}