import * as area from './funcionalidades/control_areas.js';
import * as bd from './conexion_bd.js';
import * as clean from './funcionalidades/limpiar_campos.js'
import { on } from './funcionalidades/helpers.js'
import { establecerValores } from './funcionalidades/establecer_valores_caso.js';
import * as cdj from './funcionalidades/cargar_datos_json_locales.js';
import { llenarTablaCasos, llenarTablaFuentes, llenarTablaAgresores, llenarTablaAgresoresSeleccionados } from './funcionalidades/control _tablas.js';
import { obtenerDatosCaso } from './funcionalidades/obtener_datos_caso.js';
import * as validacion from './funcionalidades/validar_campos.js';

// Elementos
let checks = document.querySelectorAll(`.buscar_casos input[type="checkbox"]`);
let btnNuevoCaso = document.getElementById('btn_nuevo_caso');
let btnBuscarCaso = document.getElementById('btn_buscar_caso');
let _fechaInicial = document.getElementById('_fechaH_1');
let _fechaFinal = document.getElementById('_fechaH_2');
let mdlEditarCaso  = new bootstrap.Modal(document.getElementById('mdlEditarCaso'));
//MAYUS
let inputsRegistro = document.querySelectorAll(`input[type="text"]`);
let txtAreaRegistro = document.querySelectorAll(`textarea`);
// Variables generales
let listaCasos, listaF, listaAgresoresSeleccionados, ID = "";
let listaAgresores, SELECTOR = "#mdlEditarCaso";

// funciones en general (interactividad)
const habilitarCampos = (id) => {
  if (id == '_fecha_v') {
    area.eliminarClase('campo_1');
    area.eliminarClase('campo_2');
  } else if (id == '_municipio_v') {
    area.eliminarClase('campo_3');
    cdj.llenarMunicipios('buscar_casos', '_select_municipios');
  } else {
    area.eliminarClase('campo_4');
  }
}
const inhabilitarCampos = (id) => {
  if (id == '_fecha_v') {
    area.anadirClase('campo_1');
    area.anadirClase('campo_2');
  } else if (id == '_municipio_v') {
    area.anadirClase('campo_3');
  } else {
    area.anadirClase('campo_4');
  }
}
//funciones en general (datos)
const listarDatos = (res) => {
  listaCasos = new Array();
  let data;
  if (res.status == 200) {
    data = res.data;
    Object.keys(data).forEach(k => {
      listaCasos.push(data[k]);
    });
    listaCasos.sort((a, b) => b.lugarHallazgo.fecha.localeCompare(a.lugarHallazgo.fecha));
    //listaCasos.sort((a, b) => b.lugarHallazgo.fecha > a.lugarHallazgo.fecha);
  }
} 

bd.obtenerDatos('casos').then(resp => {
  listarDatos(resp);
  console.log('lista casos',listaCasos);
  llenarTablaCasos(listaCasos, 'tabla_casos');
}).then(() => {
  btnBuscarCaso.disabled = false;
}).catch(error => {
  console.log(error);
});
function buscarCasosPorFecha(listaC, fi, ff){
  let date,  nuevaLista = new Array();
  listaC.forEach(el => {
    date = new Date(el.lugarHallazgo.fecha);
    if(date >= fi && date <= ff){
    //  console.log(el.lugarHallazgo.fecha);
      nuevaLista.push(el);
    }
  });
 // console.log(nuevaLista);
  return nuevaLista;
}

function buscarCasosPorMunicipioYNombre(listaC, munic, nombre, fi, ff){
  let date, nuevaLista = new Array();
  listaC.forEach(el => {
    if(el.lugarHallazgo.municipio == munic){
      date = new Date(el.lugarHallazgo.fecha);
      if(date >= fi && date <= ff){
        let c1 = el.victima.nombre.toUpperCase();
        if(c1.includes(nombre.toUpperCase())){
          nuevaLista.push(el);
        }
      }
    }
  });
 // console.log(nuevaLista);
  return nuevaLista;
}
function buscarCasosPorMunicipio(listaC, munic, fi, ff){
  let date, nuevaLista = new Array();
  listaC.forEach(el => {
    if(el.lugarHallazgo.municipio == munic){
      date = new Date(el.lugarHallazgo.fecha);
      if(date >= fi && date <= ff){
        nuevaLista.push(el);
      }
    }
  });
  return nuevaLista;
}
function buscarCasosPorNombre(listaC, nombre, fi, ff){
  let date, nuevaLista = new Array();
  listaC.forEach(el => {    
    let c1 = el.victima.nombre.toUpperCase();
    if(c1.includes(nombre.toUpperCase())){
      date = new Date(el.lugarHallazgo.fecha);
      if(date >= fi && date <= ff){
        nuevaLista.push(el);
      }
    }
  });
  return nuevaLista;
}
// manejadores de eventos
checks.forEach(item => { // check de búsqueda
  item.addEventListener('change', (e) => {
    if (e.target.checked)
      habilitarCampos(e.target.id);
    else
      inhabilitarCampos(e.target.id);
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

btnNuevoCaso.addEventListener('click', (e) => {
  location.href = 'casos_registrar.html';
});
btnBuscarCaso.addEventListener('click', (e) => { 
  let fechaI, fechaF, munic, nombre, result = "";
  let slctMunicipio = document.getElementById('_select_municipios');
  
  document.getElementById('tabla_casos').innerHTML = "";
  if(listarDatos.length <= 0){
    alertify.error('¡Error, no hay datos!');
  }else{
    if(_fechaInicial.value !== "" &&_fechaInicial.value !== ""){
      fechaI =  new Date(_fechaInicial.value);
      fechaF =  new Date(_fechaFinal.value);
      
      if(checks[0].checked  && checks[1].checked){
        munic = slctMunicipio.options[slctMunicipio.selectedIndex].value
        nombre = document.getElementById('_nombre').value;
        if(nombre !== "" && munic !== ""){
          result = buscarCasosPorMunicipioYNombre(listaCasos ,nombre, munic, fechaI, fechaF);
        }else{
          if(munic === ""){
            alertify.error('!Error, seleccione un municipio!');
          }
          if(nombre == ""){
            alertify.error('!Error, campo vacío, ingrese un nombre!');
          }
        }
      }else{
        if(checks[0].checked){
          munic = slctMunicipio.options[slctMunicipio.selectedIndex].value
          if(munic !== ""){
            result = buscarCasosPorMunicipio(listaCasos, munic, fechaI, fechaF);
          }else{
            alertify.error('!Error, seleccione un municipio!');
          }
        }else if(checks[1].checked){
          nombre = document.getElementById('_nombre').value;
          if(nombre != ""){
            result = buscarCasosPorNombre(listaCasos ,nombre, fechaI, fechaF);
          }else{
            alertify.error('!Error, campo vacío, ingrese un nombre!');
          }
        }else {
          result = buscarCasosPorFecha(listaCasos, fechaI, fechaF);
        }
      } 
      if(result !== ""){
        if(result.length <= 0){
          alertify
          .alert("¡No hay coincidencias con la búsqueda!");
        }else{
          llenarTablaCasos(result, 'tabla_casos');
        }
      }
    }else{
      alertify.error('Error, debe ingresar las fechas, son requeridas');
    }
  }  
});

const recuperarCaso = (id) => {
  let c = "";
  listaCasos.forEach(a => {
    if(id == a.id) {
      c = a;
      return;
    }
  });
  return c;
}

on(document, 'click', '.btnEliminarC', e => {    
  const id = e.target.id;
 // console.log('id ', id);
  alertify.confirm("¿Está seguro de eliminar este caso?",
      function(){
        bd.eliminarDato('casos', id).then(res => {  
          if(res.status == 200){
              alertify.success('caso eliminado!');
              bd.obtenerDatos('casos').then(resp => {
                listarDatos(resp);
              });
              setTimeout(() => {
                location.reload();
              }, 800);
            }else {
              alertify.error('Error al eliminar registro');
          }
          }).catch(error => console.log(error));
      },
      function(){
          alertify.error('Operación cancelada');
  });
});//metodo
on(document, 'click', '.btnEditarC', e => {
  clean.limpiarCampos(SELECTOR, "#mdl_consultar_agresor_edit");
  const id = e.target.id;
  let caso = recuperarCaso(id);
  ID = id;
 // console.log('id ', id);

  if(caso.fuenteInformacion === ""){
    listaF = new Array();
  }else{
    listaF = caso.fuenteInformacion;
  }
  if(caso.agresores.identificado === "si"){
    listaAgresoresSeleccionados = caso.agresores.agresores.map(i => recuperarAgresor(i.id));;
  }else{
    listaAgresoresSeleccionados = new Array();
  }
//  console.log("lista ",listaAgresoresSeleccionados);

  establecerValores(caso, SELECTOR);
  mdlEditarCaso.show();
});//metodo
// EDITAR-------------------------------------------------------------------------------------------------------
//ELEMENTOS
let selectFuente = document.querySelector('#mdlEditarCaso #_tipoFuente');
let caso_buttons = document.querySelectorAll('#mdlEditarCaso button');
let btn_buscar_agresor = document.querySelector('#mdl_consultar_agresor_edit #btn_buscar_agresor');
let caso_radioButtons = document.querySelectorAll('#mdlEditarCaso input[type="radio"]');
let selectsMunicipios = document.querySelectorAll(`#mdlEditarCaso select[name="_select_municipios"]`);


obtenerAgresores();
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
const buscarAgresor = (nombre) => {
  let listaCoincidencias = new Array();
  let sel = "#mdl_consultar_agresor_edit";
  if (listaAgresores.length > 0) {
    listaAgresores.forEach(u => {
      if (nombre.toUpperCase() === u.nombre.toUpperCase()) {
        listaCoincidencias.push(u);
      }
    });

    if (listaCoincidencias.length > 0) {
      document.getElementById('alertA_si').innerHTML = `¡Se encontraron ${listaCoincidencias.length} coincidencias con su búsqueda!`;
      area.ocultar('alertA_no', 'alertA_si');
      document.querySelector(sel  + ' #tablaAgresores').innerHTML = '';
      llenarTablaAgresores(listaCoincidencias, sel);
      setTimeout(() => {
        area.anadirClase('alertA_si');
      }, 3000);

    } else {
      area.ocultar('alertA_si', 'alertA_no');
      document.querySelector(sel  + ' #tablaAgresores').innerHTML = '';
      setTimeout(() => {
        area.anadirClase('alertA_no');
      }, 3000);
    }

  } else {
    if (nombre === '') {
      listaCoincidencias = listaAgresores;
      document.querySelector(sel  + ' #tablaAgresores').innerHTML = '';
      llenarTablaAgresores(listaCoincidencias, sel);
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
//Control de areas
let paso2_contenido1 = 'no', paso2_contenido2 = 'no', paso2_contenido3 = 'no', paso3_contenido1 = 'no';

const mostrarCampo = () => {
  let tipoF = selectFuente.options[selectFuente.selectedIndex].value;
  if (tipoF == "periodico") {
    area.ocultar('divfuente', 'divperiodico');
  } else {
    area.ocultar('divperiodico', 'divfuente');
  }
}
selectsMunicipios.forEach(elemento => {
  elemento.addEventListener('change', e => {
    cdj.llenarLocalidadesEditar(e.target.value);
  });
});
//Registro de manejador de eventos
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

btn_buscar_agresor.addEventListener('click', e => {
  e.preventDefault();
  realizarAccion(e.target.name);
});
// CONTROL REGISTRAR PASO_1
//selectMunicipio.addEventListener('change', mostrarCampo);
cdj.llenarPeriodicos('modulo_casos_editar', '_nombrePeriodico');
cdj.llenarMunicipios('modulo_casos_editar','_select_municipios');

const agregarFuente = () => {
  let tipoF = selectFuente.options[selectFuente.selectedIndex].value;
  let nombreFuente, fecha;
    let selectorBase = "#mdlEditarCaso";
  //Campos  
  if (tipoF == "periodico") {
    let selectNombreFuente = document.querySelector(selectorBase + ' ' + '#_nombrePeriodico');
    nombreFuente = selectNombreFuente.options[selectNombreFuente.selectedIndex].value;
  } else {
    nombreFuente = document.querySelector(selectorBase + ' ' + '#_nombreFuente').value;
  }
  fecha = document.querySelector(selectorBase + ' ' + '#_fechaPublicacion').value ;
  if(tipoF !== "" && nombreFuente !== "" && fecha !== ""){
    let fuente = {
      tipoFuente: tipoF,
      nombre: nombreFuente,
      fecha: fecha
    };
    listaF.push(fuente);
   // console.log('fuente ', listaF);
    llenarTablaFuentes(listaF, 'tablaFuentes_edit');
  }else {
    alertify.alert("No se permiten campos vacíos.", function(){
     alertify.error('Error');
    });
  }
};

on(document, 'click', '.btn_eliminar_fuente', e => {
  const id = e.target.id;
  listaF.splice(id, 1);
  //console.log(id);
  
  llenarTablaFuentes(listaF, 'tablaFuentes_edit');
});//metodo

on(document, 'click', '.btn_seleccionar_agresor', e => {
  const id = e.target.id;
  listaAgresoresSeleccionados.push(recuperarAgresor(id));
 // console.log("lista ",listaAgresoresSeleccionados);
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
     // obtenerAgresores();
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
    case 'btn_nueva_fuente':
      agregarFuente();
      break;
    case 'btn_buscar_agresor':
      let nombreBuscar = document.querySelector('#mdl_consultar_agresor_edit #nombreABuscar').value;
      buscarAgresor(nombreBuscar);
      //console.log("aqui en en btn buscar");
      //nombreBuscar.value = '';
      break;
    case 'btnGuardarModificaciones':
      guardarCambios();
      break;
  }
}

function guardarCambios(){
  if(validacion.validarFuentes(listaF) && validacion.validarDatosVictima(SELECTOR) 
  && validacion.validarAgresores(SELECTOR) && validacion.validarLugarHallazgo(SELECTOR) 
  && validacion.validarCausas(SELECTOR) && validacion.validarCaracteristicas(SELECTOR)){
    let objCaso = obtenerDatosCaso(SELECTOR, listaF, listaAgresoresSeleccionados);
    objCaso["id"] = ID;
    //console.log('obj ', objCaso);
    alertify.confirm("¿Desea guardar los cambios?",
    function(){
      bd.editarDato('casos', objCaso).then((res) => {
        if(res.status >= 200 && res.status < 300){
            alertify.success('Actualización exitosa');
        }    
      }).then(() => {   
        mdlEditarCaso.hide(); 
        setTimeout(() => {
          location.href = 'casos.html';
        }, 700);
      }).catch(error => {
          console.log(error)
      });       
    },
    function(){
      alertify.error('¡Operación cancelada!');
    });   
  }
}

function mayusculas(e){
  e.target.value = e.target.value.toUpperCase();
}