export function llenarTablaCasos(listaC, idTabla){
  let body = '', i = 0, mpioCad, edad = "-", mpio, nombre = "-";
  let tabla = document.getElementById(idTabla);

  listaC.forEach(caso => {
    edad = "-", nombre = "-", mpioCad = caso.lugarHallazgo.municipio.split('/');
    mpio = mpioCad[2].substring(0, mpioCad[2].length - 5);
    if (caso.victima.edad == 'si') {
      edad = caso.victima.edadMinima + ' - ' + caso.victima.edadMaxima;
    } 
    if (caso.victima.identificada == 'si') {
      nombre = caso.victima.nombre;
    } 

    body += `<tr>
     <td>${++i}</td>
     <td>${caso.lugarHallazgo.fecha}</td>
     <td>${mpio}</td>
     <td>${nombre}</td>
     <td>${edad}</td>
     <td class="d-flex justify-content-center ">
        <img class="icon-editar btnEditarC" id="${caso.id}">
        <img class="icon-eliminar btnEliminarC" id="${caso.id}">
     </td>
   </tr>`;
  });
  tabla.innerHTML = body;
}
export function llenarTablaCasosTemp(listaC, idTabla){
  let body = '', i = 0, mpioCad, edad = "-", mpio, nombre = "-";
  let tabla = document.getElementById(idTabla);

  listaC.forEach(caso => {
    edad = "-", nombre = "-", mpioCad = caso.lugarHallazgo.municipio.split('/');
    mpio = mpioCad[2].substring(0, mpioCad[2].length - 5);
    if (caso.victima.edad == 'si') {
      edad = caso.victima.edadMinima + ' - ' + caso.victima.edadMaxima;
    } 
    if (caso.victima.identificada == 'si') {
      nombre = caso.victima.nombre;
    } 

    body += `<tr>
     <td>${++i}</td>
     <td>${caso.lugarHallazgo.fecha}</td>
     <td>${mpio}</td>
     <td>${nombre}</td>
     <td>${edad}</td>
     <td class="d-flex justify-content-center ">
        <img class="icon-editar btnEditarC" id="${caso.id}">
        <img class="icon-eliminar btnEliminarC" id="${caso.id}">
        <img class="icon-revisado btnRegistrarC" id="${caso.id}">
     </td>
   </tr>`;
  });
  tabla.innerHTML = body;
}
export function llenarTablaUsuarios(data, idTabla){  
  let tabla = document.getElementById(idTabla), body = '';
  for(let i = 0; i < data.length; i ++){
    body += `<tr> 
    <td>${i + 1}</td>
    <td>${data[i].nombre}</td>
    <td>${data[i].apellidoPaterno}</td>
    <td>${data[i].apellidoMaterno}</td>
    <td>${data[i].email}</td>
    <td>${data[i].rol}</td>
    <td class="text-center">
      <div class="btn-group">
        <img class="icon-editar btnEditarU" id="${data[i].id}">
        <img class="icon-eliminar btnEliminarU" id="${data[i].id}">
      </div>
    </td>
    </tr>`;
}    
//  <a  class="btn btn-info btnEditarU" id="${data[i].id}"><i class="bi bi-pencil-square"></i></a>
//        <a class="btn btn-danger btnEliminarU" id="${data[i].id}"><i class="bi bi-trash-fill"></i></a>
  tabla.innerHTML = body;
}
export function llenarTablaFuentes(data, idTBody){
  let tabla = document.getElementById(idTBody);
  tabla.innerHTML = '';
  let body = '';

  for (let i = 0; i < data.length; i++) {
    body += `<tr> 
      <td>${i + 1}</td>
      <td>${data[i].tipoFuente}</td>
      <td>${data[i].nombre}</td>
      <td>${data[i].fecha}</td>
      <td class="text-center">
        <img class="icon-eliminar btn_eliminar_fuente" id="${i}">
      </td>
    </tr>`;
  }//  <button class="btn btn-danger btn_eliminar_fuente" id="${i}"><i class="bi bi-trash-fill"></i></button>
  tabla.innerHTML = body;
}
export function llenarTablaAgresores(data, SELECTOR){
  let tabla = document.querySelector(SELECTOR + ' #tablaAgresores');
  let body = '';

  for (let i = 0; i < data.length; i++) {
    body += `<tr> 
        <td>${i + 1}</td>
        <td>${data[i].nombre}</td>
        <td>${data[i].apellidoPaterno}</td>
        <td>${data[i].apellidoMaterno}</td>
        <td>${data[i].sobrenombre}</td>
        <td class="text-center">
          <img class="icon-anadir btn_seleccionar_agresor" id="${data[i].id}">
        </td>
         </tr>`;
  }
  tabla.innerHTML = body;
}
export function llenarTablaAgresoresSeleccionados(data, SELECTOR){
  let tabla = document.querySelector(SELECTOR + ' #tablaAgresoresSeleccionados');
  let body = '';
  for (let i = 0; i < data.length; i++) {
    body += `<tr> 
        <td>${i + 1}</td>
        <td>${data[i].nombre}</td>
        <td>${data[i].apellidoPaterno}</td>
        <td>${data[i].apellidoMaterno}</td>
        <td>${data[i].sobrenombre}</td>
        <td class="text-center">
          <img class="icon-eliminar btn_eliminar_agresor" id="${i}">
        </td>
         </tr>`;
  }
  tabla.innerHTML = body;
}
export function llenarCuadroMunicipios(municipios, data, totales, idTBody, idTFoot){  
  let body = '', foot = '',
  tabla = document.getElementById(idTBody),
  tfoot = document.getElementById(idTFoot) ;

  for(let i = 0; i < municipios.length; i ++){
    body += `<tr> 
      <td>${i + 1}</td>
      <td>${ municipios[i] }</td>
      <td>${ data[i][0] }</td>
      <td>${ data[i][1] }</td>
      <td>${ data[i][2] }</td>
      <td>${ data[i][3] }</td>
      <td>${ data[i][4] }</td>
      <td>${ data[i][5] }</td>
      <td>${ data[i][6] }</td>
      <td>${ data[i][7] }</td>
      <td>${ data[i][8] }</td>
      <td>${ data[i][9] }</td>
      <td>${ data[i][10] }</td>
      <td>${ data[i][11] }</td>
      <td>${ data[i][12] }</td>
    </tr>`;
  }    
  foot += `<tr> 
    <th colspan="2">Total por mes</th>
    <td>${ totales[0] }</td>
    <td>${ totales[1] }</td>
    <td>${ totales[2] }</td>
    <td>${ totales[3] }</td>
    <td>${ totales[4] }</td>
    <td>${ totales[5] }</td>
    <td>${ totales[6] }</td>
    <td>${ totales[7] }</td>
    <td>${ totales[8] }</td>
    <td>${ totales[9] }</td>
    <td>${ totales[10] }</td>
    <td>${ totales[11] }</td>
    <td><strong>${ totales[12] }</strong></td>
    </tr>`;
    
  tabla.innerHTML = body;
  tfoot.innerHTML = foot;
}
export function llenarCuadroCausas(data, totales ,total, idTBody, idTFoot){  
  let body = '', foot = '',
  tabla = document.getElementById(idTBody),
  tfoot = document.getElementById(idTFoot) ;

  for(let i = 0; i < data.length; i ++){
    body += `<tr> 
      <td>${ data[i] }</td>
      <td>${ totales[i] }</td>
    </tr>`;
  }    
  foot += `<tr> 
    <th>Total por mes</th>
    <td><strong>${ total }</strong></td>
    </tr>`;
    
  tabla.innerHTML = body;
  tfoot.innerHTML = foot;
}

