import * as cdj from '../js/funcionalidades/cargar_datos_json_locales.js';
import * as bd from '../js/conexion_bd.js';
import * as validacion from '../js/funcionalidades/validar_campos.js';
import * as area from '../js/funcionalidades/control_areas.js';
import { on } from '../js/funcionalidades/helpers.js'
import { llenarTablaFuentes, llenarTablaAgresores, llenarTablaAgresoresSeleccionados } from './funcionalidades/control _tablas.js';
import { obtenerDatosCaso } from '../js/funcionalidades/obtener_datos_caso.js';
//ELEMENTOS
let selectFuente = document.getElementById('_tipoFuente');
let caso_radioButtons = document.querySelectorAll('.caso_registro input[type="radio"]');
let caso_buttons = document.querySelectorAll('.caso_registro button');
let mdlRegistrarAgresor = new bootstrap.Modal(document.getElementById('mdl_registrar_agresor'));
let mdlConsultarAgresor = new bootstrap.Modal(document.getElementById('mdl_consultar_agresor'));
let listaF = new Array(), listaAgresores, listaAgresoresSeleccionados = new Array(), SELECTOR = ".modulo_casos";
let paso2_contenido1 = 'no', paso2_contenido2 = 'no', paso2_contenido3 = 'no', paso3_contenido1 = 'no';
let inputsRegistro = document.querySelectorAll(`input[type="text"]`);
let txtAreaRegistro = document.querySelectorAll(`textarea`);

const mostrarCampo = () => {
  let tipoF = selectFuente.options[selectFuente.selectedIndex].value;
  if (tipoF == "periodico") {
    area.ocultar('divfuente', 'divperiodico');
  } else {
    area.ocultar('divperiodico', 'divfuente');
  }
}

let selectsMunicipios = document.querySelectorAll(`.caso_registro select[name="_select_municipios"]`);
selectsMunicipios.forEach(elemento => {
  elemento.addEventListener('change', e => {
    cdj.llenarLocalidades(e.target.value);
  });
});

selectFuente.addEventListener('change', mostrarCampo);
caso_radioButtons.forEach(elemento => {
  elemento.addEventListener('click', e => {
    desplegarComponentes(e.target.name, e.target.value);
  });
});
caso_buttons.forEach(elemento => {
  elemento.addEventListener('click', e => {
    e.preventDefault();
    realizarAccion(e.target.name);
  });
});
inputsRegistro.forEach(i => {
  i.addEventListener('keyup', (e) => {
    mayusculas(e);
  });
});

txtAreaRegistro.forEach(i => {
  i.addEventListener('keyup', (e) => {
    mayusculas(e);
  });
});
// CONTROL REGISTRAR PASO_1
cdj.llenarPeriodicos('modulo_casos', '_nombrePeriodico');
cdj.llenarMunicipios('modulo_casos','_select_municipios');

function agregarFuente(){
  if(validacion.validarFuente(SELECTOR)){
    let tipoF = selectFuente.options[selectFuente.selectedIndex].value;
    let nombreFuente, fecha;
  
    if (tipoF == "periodico") {
      let selectNombreFuente = document.getElementById('_nombrePeriodico');
      nombreFuente = selectNombreFuente.options[selectNombreFuente.selectedIndex].value;
    } else {
      nombreFuente = document.getElementById('_nombreFuente').value;
    }
    fecha = document.getElementById('_fechaPublicacion').value;
  
    let fuente = {
      tipoFuente: tipoF,
      nombre: nombreFuente,
      fecha: fecha
    };
  
    listaF.push(fuente);
    llenarTablaFuentes(listaF, 'tablaFuentes');
  }
}

function continuarUno(){
  if(validacion.validarFuentes(listaF)){
    area.ocultar('caso_paso_1', 'caso_paso_2');
  }
}

function continuarDos(){
  if(validacion.validarDatosVictima(SELECTOR)){
    area.ocultar('caso_paso_2', 'caso_paso_3');
  }
}

function continuarTres(){
  if(validacion.validarAgresores(SELECTOR)){
    //let agresor_si = document.querySelector(selector + ' #_paso3_contenido1_si').checked;
    area.ocultar('caso_paso_3', 'caso_paso_4');
  }
}

function continuarCuatro(){
  if(validacion.validarLugarHallazgo(SELECTOR)){
    area.ocultar('caso_paso_4', 'caso_paso_5');
  }
}

function continuarCinco(){
  if(validacion.validarCausas(SELECTOR)){
    area.ocultar('caso_paso_5', 'caso_paso_6');
  }  
}

function continuarSeis(){
  if(validacion.validarCaracteristicas(SELECTOR)){
    let objCaso = obtenerDatosCaso(SELECTOR, listaF, listaAgresoresSeleccionados);
    //console.log('obj ', objCaso);
    alertify.confirm("¿Desea registrar el caso?.",
    function(){
      bd.guardarDato('casos', objCaso).then((res) => {
        if(res.status >= 200 && res.status < 300){
            alertify.success('Registro exitoso');
        }    
      }).then(() => {    
        setTimeout(() => {
          location.href = 'casos.html';
        }, 800);
      }).catch(error => {
          console.log(error)
      });       
    },
    function(){
      alertify.error('¡Operación cancelada!');
    });   
  }
}

function obtenerAgresores(){
  try{
    listaAgresores = new Array();
    bd.obtenerDatos('agresores').then(res => {
      if (res.status == 200) {
        let data = res.data;
        Object.keys(data).forEach(k => {
          // console.log('key is', k);
         //  console.log('value is ',data[k]);
          listaAgresores.push(data[k]);
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }catch(error){
    alertify.alert("Error - Base de datos " + error);
    //console.log('Error ',error)
  }
  
}

//REGISTRAR AGRESOR
let campos_registrar_agresor = document.querySelectorAll('#mdl_registrar_agresor .campo');

const obtenerDatosAgresor = () => {
  let agresor;
  agresor = {
    'nombre': campos_registrar_agresor[0].value,
    'apellidoPaterno': campos_registrar_agresor[1].value,
    'apellidoMaterno': campos_registrar_agresor[2].value,
    'sobrenombre': campos_registrar_agresor[3].value,
    'municipio': campos_registrar_agresor[4].value,
    'localidad': campos_registrar_agresor[5].value,
    'domicilio': campos_registrar_agresor[6].value
  }
  return agresor;
}

const buscarAgresor = (nombre) => {
  let listaCoincidencias = new Array();
  if (listaAgresores.length > 0) {
    listaAgresores.forEach(u => {
      if (nombre.toUpperCase() === u.nombre.toUpperCase()) {
        listaCoincidencias.push(u);
      }
    });

    if (listaCoincidencias.length > 0) {
      document.getElementById('alertA_si').innerHTML = `¡Se encontraron ${listaCoincidencias.length} coincidencias con su búsqueda!`;
      area.ocultar('alertA_no', 'alertA_si');
      document.getElementById('tablaAgresores').innerHTML = '';
      llenarTablaAgresores(listaCoincidencias, SELECTOR);
      setTimeout(() => {
        area.anadirClase('alertA_si');
      }, 3000);

    } else {
      area.ocultar('alertA_si', 'alertA_no');
      document.getElementById('tablaAgresores').innerHTML = '';
      setTimeout(() => {
        area.anadirClase('alertA_no');
      }, 3000);
    }

  } else {
    if (nombre === '') {
      listaCoincidencias = listaAgresores
      document.getElementById('tablaAgresores').innerHTML = '';
      llenarTablaAgresores(listaCoincidencias, SELECTOR);
    }
  }
}
const recuperarAgresor = (id) => {
  let ag = "";
  listaAgresores.forEach(a => {
    if(id == a.id) {
      ag = a;
      return;
    }
  });
  return ag;
}

on(document, 'click', '.btn_eliminar_fuente', e => {
  const id = e.target.id;
  listaF.splice(id, 1);

  llenarTablaFuentes(listaF, 'tablaFuentes');
});//metodo

on(document, 'click', '.btn_seleccionar_agresor', e => {
  const id = e.target.id;
  listaAgresoresSeleccionados.push(recuperarAgresor(id));
  alertify.success('Agresor añadido');
  llenarTablaAgresoresSeleccionados(listaAgresoresSeleccionados, SELECTOR);
});//metodo

on(document, 'click', '.btn_eliminar_agresor', e => {
  const id = e.target.id;
  //lista.splice(id, 1);
  listaAgresoresSeleccionados.splice(id, 1);
  llenarTablaAgresoresSeleccionados(listaAgresoresSeleccionados, SELECTOR);
});//metodo

const desplegarComponentes = (nombre, valor) => {
  switch (nombre + '_' + valor) {
    case 'paso2_contenido1_si':
      paso2_contenido1 = 'si';
      area.eliminarClase('v_si');
      break;
    case 'paso2_contenido1_no':
      paso2_contenido1 = 'no';
      area.anadirClase('v_si');
      break;
    case 'paso2_contenido1_1_si':
      paso2_contenido1 = 'si';
      area.eliminarClase('v_edad');
      break;
    case 'paso2_contenido1_1_no':
      paso2_contenido1 = 'no';
      area.anadirClase('v_edad');
      break;
    case 'paso2_contenido2_si':
      paso2_contenido2 = 'si';
      area.eliminarClase('info_laboral');
      break;
    case 'paso2_contenido2_no':
      paso2_contenido2 = 'no';
      area.anadirClase('info_laboral');
      break;
    case 'paso2_contenido3_si':
      paso2_contenido3 = 'si';
      area.eliminarClase('info_origen');
      break;
    case 'paso2_contenido3_no':
      paso2_contenido3 = 'no';
      area.anadirClase('info_origen');
      break;
    case 'paso3_contenido1_si':
      paso3_contenido1 = 'si';
      obtenerAgresores();
      area.eliminarClase('info_agresor');
      break;
    case 'paso3_contenido1_no':
      paso3_contenido1 = 'no';
      area.anadirClase('info_agresor');
      break;
    default:
      break;
      
  }
}
//MANEJADOR DE EVENTOS DE BOTONES
const realizarAccion = (nombre) => {
  switch (nombre) {
    case 'btn_regresar1':
      area.ocultar('caso_paso_1', 'caso_paso_2');
      break;
    case 'btn_regresar2':
      area.ocultar('caso_paso_2', 'caso_paso_1');
      break;
    case 'btn_regresar3':
      area.ocultar('caso_paso_3', 'caso_paso_2');
      break;
    case 'btn_regresar4':
      area.ocultar('caso_paso_4', 'caso_paso_3');
      break;
    case 'btn_regresar5':
      area.ocultar('caso_paso_5', 'caso_paso_4');
      break;
    case 'btn_regresar6':
      area.ocultar('caso_paso_6', 'caso_paso_5');
      break;
    case 'btn_continuar1':
      continuarUno();
      break;
    case 'btn_continuar2':
      continuarDos();
      break;
    case 'btn_continuar3':
        continuarTres();
      break;                                                                                      
    case 'btn_continuar4':
      continuarCuatro();
      break;
    case 'btn_continuar5':
      continuarCinco();      
      break;
    case 'btn_continuar6':
      continuarSeis();     
      // area.ocultar('v_si', 'v_no'); 
      break;
    case 'btn_nueva_fuente':
      agregarFuente();
      // area.ocultar('v_si', 'v_no'); 
      break;
    case 'btn_nuevo_agresor':
      mdlRegistrarAgresor.show();
      // area.ocultar('v_si', 'v_no'); 
      break;
    case 'btn_buscar_agresor':
      let nombreBuscar = document.getElementById('nombreABuscar').value;
      buscarAgresor(nombreBuscar);
     // nombreBuscar.value = '';
      // area.ocultar('v_si', 'v_no'); 
      break;
    case 'btn_registrar_agresor':
      let a = obtenerDatosAgresor();

      bd.guardarDato('agresores', a).then((res) => {
        if (res.status == 200) {
          alertify.success('Registro exitoso');
        }
      }).then(() => {
        document.getElementById('tablaAgresores').innerHTML = '';
        obtenerAgresores();
        console.log("aca ando")

      }).catch(error => {
        console.log(error)
      });
      mdlRegistrarAgresor.hide();
      // area.ocultar('v_si', 'v_no'); 
      break;
    case 'btn_consultar_agresor':
      obtenerAgresores();
      mdlConsultarAgresor.show();
      // area.ocultar('v_si', 'v_no'); 
      break
  }
}
function mayusculas(e){
  e.target.value = e.target.value.toUpperCase();
}