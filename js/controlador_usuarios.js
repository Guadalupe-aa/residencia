import * as area from '../js/funcionalidades/control_areas.js';
import { obtenerDatos } from '../js/conexion_bd.js';
import { llenarTablaUsuarios } from '../js/funcionalidades/control _tablas.js'
import { on } from '../js/funcionalidades/helpers.js'
import * as bd from "../js/conexion_bd.js";
// variables
let opcion = 'crear';
let idU = '';

// Elementos del DOM
let mdlRegistrarU = new bootstrap.Modal(document.getElementById('mdlRegistrarU'));
let buttons = document.querySelectorAll('.modulo_usuarios button');
let mdlInputs = document.querySelectorAll('#mdlRegistrarU input');
let inputBuscar = document.querySelector('.modulo_usuarios form input');
//name="_nombreUsuario"
let listaUsuarios;

const limpiarCamposModal = () => {
  mdlInputs.forEach(input => {
    input.value = '';
  });
}

const listarDatos = (res) => {
  listaUsuarios = new Array();
  let data;
  if (res.status == 200) {
    data = res.data;
    Object.keys(data).forEach(k => {
      listaUsuarios.push(data[k]);
    });
    llenarTablaUsuarios(listaUsuarios, 'tablaUsuarios');
  }
}
obtenerDatos('usuarios').then(resp => {
  console.log(resp);
  listarDatos(resp);
});

const buscarUsuario = (nombre) => {
  let listaCoincidencias = new Array();
  if (listaUsuarios.length > 0) {
    listaUsuarios.forEach(u => {
      if (nombre.toUpperCase() === u.nombre.toUpperCase()) {
        listaCoincidencias.push(u);
      }
    });

    if (listaCoincidencias.length > 0) {
      document.getElementById('alertU_si').innerHTML = `¡Se encontraron ${listaCoincidencias.length} coincidencias con su búsqueda!`;
      area.ocultar('alertU_no', 'alertU_si');
      document.getElementById('tablaUsuarios').innerHTML = '';
      llenarTablaUsuarios(listaCoincidencias, 'tablaUsuarios');
      setTimeout(() => {
        area.anadirClase('alertU_si');
      }, 3000);

    } else {
      area.ocultar('alertU_si', 'alertU_no');
      document.getElementById('tablaUsuarios').innerHTML = '';
      setTimeout(() => {
        area.anadirClase('alertU_no');
      }, 3000);
    }

  } else {

  }
}

const realizarTarea = (nombre) => {
  switch (nombre) {
    case 'btnBuscarUsuario':
      let nombreBuscar = inputBuscar.value;
      console.log(nombreBuscar === "");
      if (nombreBuscar === '') {
        llenarTablaUsuarios(listaUsuarios, 'tablaUsuarios');
      } else {
        buscarUsuario(nombreBuscar);
      }
      inputBuscar.value = '';
      break;
    case 'btnCrearUsuario':
      limpiarCamposModal();
      opcion = 'crear';
      mdlRegistrarU.show();
      break;
    case 'btnMdlAceptar':
      let select = document.getElementById('rolUmdl');
      if (opcion == 'crear') {
        const usuario = {
          'nombre': mdlInputs[0].value,
          'apellidoPaterno': mdlInputs[1].value,
          'apellidoMaterno': mdlInputs[2].value,
          'email': mdlInputs[3].value,
          'contrasennia': mdlInputs[4].value,
          'rol': select.options[select.selectedIndex].value
        }
        bd.guardarDato('usuarios',usuario).then((res) => {
          if (res.status == 200) {
            alertify.success('Registro exitoso');
          }

        }).then(() => {
          document.getElementById('tablaUsuarios').innerHTML = '';
          obtenerDatos('usuarios').then(resp => {
            console.log(resp);
            listarDatos(resp);
          });

        }).catch(error => {
          console.log(error)
        });

      } else {
        const usuario = {
          'id': idU,
          'nombre': mdlInputs[0].value,
          'apellidoPaterno': mdlInputs[1].value,
          'apellidoMaterno': mdlInputs[2].value,
          'email': mdlInputs[3].value,
          'contrasennia': mdlInputs[4].value,
          'rol': select.options[select.selectedIndex].value
        }
        //const res = await axios.put(url, usuario);
        bd.editarDato('usuarios', usuario).then((res) => {
          if (res.status == 200) {
            alertify.success('Actualización exitosa');
          } else {
            alertify.error('Actualización fallida');
          }
        }).then(() => {
          document.getElementById('tablaUsuarios').innerHTML = '';
          obtenerDatos('usuarios').then(resp => {
            console.log(resp);
            listarDatos(resp);
          });
        }).catch(error => {
          console.log(error)
        });
        console.log('EDITAR');
      }
      mdlRegistrarU.hide();
      break;
    case 'btnMdlCancelar':
      break;

  }
}
buttons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    realizarTarea(e.target.name);
  });
});
on(document, 'click', '.btnEliminarU', e => {
  const idUsuario = e.target.id;
  alertify.confirm("¿Está seguro de eliminar este usuario?",
    function () {
      bd.eliminarDato('usuarios', idUsuario).then((res) => {
        console.log('resp de eliminación', res.status);
        if (res.status == 200) {
          alertify.success('¡Usuario eliminado!');
        } else {
          alertify.error('Error al eliminar el usuario');
        }
      }).then(() => {
        document.getElementById('tablaUsuarios').innerHTML = '';
        obtenerDatos('usuarios').then(resp => {
          listarDatos(resp);
        });
      }).catch(error => console.log(error));
    },
    function () {
      alertify.error('Operación cancelada');
    });
  console.log(idUsuario);
});//metodo

on(document, 'click', '.btnEditarU', e => {
  const fila = e.target.parentNode.parentNode.parentNode;
  const i = fila.firstElementChild.innerHTML;
  opcion = 'editar';
  idU = e.target.id;
  console.log(i);

  mdlInputs[0].value = listaUsuarios[i - 1].nombre;
  mdlInputs[1].value = listaUsuarios[i - 1].apellidoPaterno;
  mdlInputs[2].value = listaUsuarios[i - 1].apellidoMaterno;
  mdlInputs[3].value = listaUsuarios[i - 1].email;
  mdlInputs[4].value = listaUsuarios[i - 1].contrasennia;
  document.getElementById('rolUmdl').value = listaUsuarios[i - 1].rol;
document.querySelector('#mdlRegistrarU h5').innerHTML= "Editar usuario";
  mdlRegistrarU.show();
});//metodo


function validar_campos(){

}