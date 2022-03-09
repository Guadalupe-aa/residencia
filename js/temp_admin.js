import * as area from './funcionalidades/control_areas.js';
import * as bd from './conexion_bd.js';
import * as clean from './funcionalidades/limpiar_campos.js'
import { on } from './funcionalidades/helpers.js'
import { establecerValores } from './funcionalidades/establecer_valores_caso.js';
import * as cdj from './funcionalidades/cargar_datos_json_locales.js';
import { llenarTablaCasosTemp, llenarTablaFuentes, llenarTablaAgresores, llenarTablaAgresoresSeleccionados } from './funcionalidades/control _tablas.js';
import { obtenerDatosCaso } from './funcionalidades/obtener_datos_caso.js';
import * as validacion from './funcionalidades/validar_campos.js';

// Elementos
let mdlEditarCaso  = new bootstrap.Modal(document.getElementById('mdlEditarCasoTemp'));
//MAYUS
let inputsRegistro = document.querySelectorAll(`input[type="text"]`);
let txtAreaRegistro = document.querySelectorAll(`textarea`);
let listaAgresores, SELECTOR = "#mdlEditarCasoTemp";
let SELECTOR_CONSULTA = "#mdl_consultar_agresor_edit_temp";
// Variables generales
let listaCasos, listaF, listaAgresoresSeleccionados, ID = "";

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
bd.obtenerDatos('temp').then(resp => {
  listarDatos(resp);
  //console.log('lista casos',listaCasos);
  llenarTablaCasosTemp(listaCasos, 'tabla_casos');
}).then(() => {
  if(listaCasos.length <= 0)
     alertify.alert("No hay datos para mostrar");

}).catch(error => {
  console.log(error);
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
  //console.log('id ', id);
  alertify.confirm("¿Está seguro de eliminar este caso?",
    function(){
      bd.eliminarDato('temp', id).then(res => {  
        if(res.status == 200){
            alertify.success('caso eliminado!');
            bd.obtenerDatos('temp').then(resp => {
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
  clean.limpiarCampos(SELECTOR, SELECTOR_CONSULTA);
  const id = e.target.id;
  let caso = recuperarCaso(id);
  ID = id;
  console.log('id ', id);

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

on(document, 'click', '.btnRegistrarC', e => {
  clean.limpiarCampos(SELECTOR, SELECTOR_CONSULTA);
  const id = e.target.id;
  let caso = recuperarCaso(id);
  ID = id;
  console.log('id ', id);
  registrar(caso, id);

});//metodo
// EDITAR-------------------------------------------------------------------------------------------------------
//ELEMENTOS
let selectFuente = document.querySelector(SELECTOR + ' #_tipoFuente');
let caso_buttons = document.querySelectorAll(SELECTOR + ' button');
let btn_buscar_agresor = document.querySelector(SELECTOR_CONSULTA + ' #btn_buscar_agresor');
let caso_radioButtons = document.querySelectorAll(SELECTOR + ' input[type="radio"]');
let selectsMunicipios = document.querySelectorAll(`${SELECTOR} select[name="_select_municipios"]`);

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
  let sel = "#_temp";
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
cdj.llenarPeriodicos('modulo_casos_editar_temp', '_nombrePeriodico');
cdj.llenarMunicipios('modulo_casos_editar_temp','_select_municipios');

const agregarFuente = () => {
  let tipoF = selectFuente.options[selectFuente.selectedIndex].value;
  let nombreFuente, fecha;
    let selectorBase = SELECTOR;
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
  //console.log("lista ",listaAgresoresSeleccionados);
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
      let nombreBuscar = document.querySelector('#mdl_consultar_agresor_edit_temp #nombreABuscar').value;
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
      bd.editarDato('temp', objCaso).then((res) => {
        if(res.status >= 200 && res.status < 300){
            alertify.success('Actualización exitosa');
        }    
      }).then(() => {   
        mdlEditarCaso.hide(); 
        setTimeout(() => {
          location.href = 'casos_temp_admin.html';
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

function registrar(obj, id){
  
  alertify.confirm("¿Desea registrar el caso en la BD de casos revisados?",
    function(){
      let caso = {
        'fuenteInformacion': obj.fuenteInformacion,
        'victima': obj.victima,
        'agresores': obj.agresores,
        'lugarHallazgo': obj.lugarHallazgo,
        'causaMuerte': obj.causaMuerte,
        'caracteristicasViolencia':  obj.caracteristicasViolencia
      }
      bd.guardarDato('casos', caso).then((res) => {
        if(res.status >= 200 && res.status < 300){
            alertify.success('Registro exitoso');
        }    
      }).then(() => {   
       bd.eliminarDato('temp', id).then(res => {  
          if(res.status == 200){
              alertify.success('caso eliminado!');
              bd.obtenerDatos('temp').then(resp => {
                listarDatos(resp);
              });
              setTimeout(() => {
                location.reload();
              }, 800);
            }else {
              alertify.error('Error al eliminar registro');
          }
          }).catch(error => console.log(error));
      })
   },
    function(){
      alertify.error('¡Operación cancelada!');
    });   
}

function mayusculas(e){
  e.target.value = e.target.value.toUpperCase();
}