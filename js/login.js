import { obtenerDatos } from '../js/conexion_bd.js';

let listaUsuarios;
let elem_email = document.getElementById('inicio_email');
let elem_pass = document.getElementById('inicio_password');

let btnIngresar = document.getElementById('_btn-iniciar-sesion');
//let btnEnviarPass = document.getElementById('_btn-enviar');

//Recuperación de datos
const listarDatos = (res) => {
  listaUsuarios = new Array();
  let data;
  if (res.status == 200) {
    data = res.data;
    Object.keys(data).forEach(k => {
      listaUsuarios.push(data[k]);
    });    
  }
}
obtenerDatos('usuarios').then(resp => {
  listarDatos(resp);
  console.log(listaUsuarios);
}).then(() => {
  btnIngresar.disabled = false;
});;
//Manejador de eventos
btnIngresar.addEventListener('click',  (e) => {
  e.preventDefault();
  validarCampos();
});

//Métodos adicionales
function limpiarCampos(){
  elem_email.value = "";
  elem_pass.value = ""; 
}

function validarCampos(){
  if(elem_email.value == "" || elem_pass.value == ""){
    alertify.alert("¡Campos vacíos! Ingrese datos", function(){
      alertify.error('¡Error!');
    });
  }else{
    if(validateEmail(elem_email)){
      validarCredenciales();

    }else{      
      alertify.alert("Formato de correo electrónico inválido", function(){
        alertify.error('¡Error!');
      });
    }
  }

}

const buscarUsuario = (email, pass) => {
  //console.log("email value ", typeof(elem_email.value) )
  //console.log("pass value ", typeof(elem_pass.value))
  let resp = ""
  if (listaUsuarios.length > 0) {
    listaUsuarios.forEach(u => {
      console.log(u);
      if (email === u.email && pass === u.contrasennia) {
        resp =  u;
      }
    });
  }
  return resp;
}

function validarCredenciales(){
  let user = buscarUsuario(elem_email.value, elem_pass.value);
  //console.log('user: ', user.rol);

  if(user === ""){
    alertify.alert("¡Usuario y/o contraseña incorrectos!", function(){
      alertify.error('¡Error!');
    });
  }else{
    limpiarCampos();
    //console.log(user.rol == 'supervisor');
    //location.href = "inicio.html";
    if(user.rol == "supervisor"){
      location.href = "views/inicio.html";
    }else{
      location.href = "views/inicio_dos.html";
    }
  }
}
function validateEmail(inputText){
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(inputText.value.match(mailformat)){
        return true;
    }else{
        return false;
    }
}

//'-----------------------------------------------------------------------------------------
/*console.log("contraseña ", generateRandomString());

function buscarCorreo(){
  let correoRecup = document.getElementById('_correo_registrado').value;
  listaUsuarios.forEach(u => {
    if (correoRecup === u.email) {
      return true;
    }
  });
  return false;
}
//Generar contraseña
function  generateRandomString(){
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result1= ' ';
  const charactersLength = characters.length;
  for ( let i = 0; i < 10; i++ ) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result1;
}

function enviasr(){
  if (buscarCorreo) {
    let nuevo = generateRandomString();
  }else{
    alert('Correo no registrado');
  }
}*/