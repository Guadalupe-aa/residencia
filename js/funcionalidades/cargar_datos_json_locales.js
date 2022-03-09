export function llenarPeriodicos(nombreModulo, nombreSelect) {
 let cadena =  `<option selected disabled value="">Seleccione el periódico</option>`;

 const xhttp = new XMLHttpRequest();
 xhttp.open('GET', `../assets/data/lista_periodicos.json`, true);
 xhttp.send();

 xhttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200) {
     let datosJSON = JSON.parse(this.responseText);
     let res = document.querySelectorAll(`.${nombreModulo} select[name='${nombreSelect}']`);
     datosJSON.forEach(datosJSON => {
         cadena += '<option value="' + datosJSON.value + '">' + datosJSON.name + '</option>';
     });
     res.forEach(el => { el.innerHTML = cadena; });
   }
 }
}

export function llenarMunicipios(nombreModulo, nombreSelect) {
 let cadena = `<option selected disabled value="">Municipio</option>`;
 
 const xhttp = new XMLHttpRequest();
 xhttp.open('GET', `../assets/data/lista_municipios.json`, true);
 xhttp.send();
 
 xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
   let datosJSON = JSON.parse(this.responseText);
   let res = document.querySelectorAll(`.${nombreModulo} select[name='${nombreSelect}']`);
   
   datosJSON.forEach(datosJSON => {
    cadena += '<option value="' + datosJSON.children + '">' + datosJSON.name + '</option>';
   });
   res.forEach(el => { el.innerHTML = cadena; });
  }
 }
}

export function llenarLocalidades(nombreArchivoJSON) {
 let cadena = `<option selected disabled value="">Localidad</option>`;
 
 const xhttp = new XMLHttpRequest();
 xhttp.open('GET', `../assets/data/${nombreArchivoJSON}`, true);
 xhttp.send();
 
 xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
   let datosJSON = JSON.parse(this.responseText);
     let res = document.querySelectorAll(`.modulo_casos select[name='_select_localidades']`);
     
     let arreglo = new Array();
     for (let item of datosJSON) {
      arreglo.push({ value: item.label });
     }
     arreglo.orderByString("value");     
     arreglo.forEach(el => {
      cadena += '<option value="' + el.value + '">' + el.value + '</option>';
     });

     res.forEach(el => { el.innerHTML = cadena; });
    }
   }
}
export function llenarLocalidadesEditar(nombreArchivoJSON) {
  let cadena = `<option selected disabled value="">Localidad</option>`;
  
  const xhttp = new XMLHttpRequest();
  xhttp.open('GET', `../assets/data/${nombreArchivoJSON}`, true);
  xhttp.send();
  
  xhttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200) {
    let datosJSON = JSON.parse(this.responseText);
      let res = document.querySelectorAll(`#mdlEditarCaso select[name='_select_localidades']`);
      
      let arreglo = new Array();
      for (let item of datosJSON) {
       arreglo.push({ value: item.label });
      }
      arreglo.orderByString("value");     
      arreglo.forEach(el => {
       cadena += '<option value="' + el.value + '">' + el.value + '</option>';
      });
 
      res.forEach(el => { el.innerHTML = cadena; });
     }
    }
 }
 export function llenarLocalidadesSep(nombreArchivoJSON, elemento, selector) {
  let cadena = `<option selected disabled value="">Localidad</option>`;
  
  const xhttp = new XMLHttpRequest();
  xhttp.open('GET', `../assets/data/${nombreArchivoJSON}`, true);
  xhttp.send();
  
  xhttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200) {
    let datosJSON = JSON.parse(this.responseText);
      let res = document.querySelector(`${selector} #${elemento}`);
      let arreglo = new Array();
      for (let item of datosJSON) {
       arreglo.push({ value: item.label });
      }
      arreglo.orderByString("value");     
      arreglo.forEach(el => {
       cadena += '<option value="' + el.value + '">' + el.value + '</option>';
      });
 
      res.innerHTML = cadena;
     }
    }
 }
export function getListaMunicipios() {
 let lista = new Array();
  
  const xhttp = new XMLHttpRequest();
  xhttp.open('GET', `../assets/data/lista_municipios.json`, true);
  xhttp.send();
  
  xhttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200) {
    let datosJSON = JSON.parse(this.responseText);
    
    datosJSON.forEach(datosJSON => {
      lista.push({'valor': datosJSON.children, 'nombre': datosJSON.name});
    });
   }
  }
  return lista;
 }

 export function llenarAnnios(listaAnnios, idElemento){
   let elemento = document.getElementById(idElemento);
  let cadena = `<option value="" selected>Seleccione el año</option>`;
  listaAnnios.forEach(el => {
    cadena += `<option value="${el}">${el}</option>`;
   });
   elemento.innerHTML = cadena;
 }

Array.prototype.orderByString = function (property, sortOrder, ignoreCase) {
 if (sortOrder != -1 && sortOrder != 1) {
   sortOrder = 1
 };
 this.sort(function (a, b) {
   let stringA = a[property], stringB = b[property];

   if (stringA == null) {
     stringA = '';
   }
   if (stringB == null) {
     stringB = '';
   }
   if (ignoreCase == true) {
     stringA = stringA.toLowerCase();
     stringB = stringB.toLowerCase()
   }
   let result = 0;
   if (stringA < stringB) {
     result = -1;
   } else if (stringA > stringB) {
     result = 1;
   }
   return result * sortOrder;
 })
}