const ocultar = (elemento_1, elemento_2) => {
 document.getElementById(elemento_1).classList.add('no-activo');
 document.getElementById(elemento_2).classList.remove('no-activo');
}

const anadirClase = (elemento) => {
 document.getElementById(elemento).classList.add('no-activo');
}

const eliminarClase = (elemento) => {
 document.getElementById(elemento).classList.remove('no-activo');
}

export { ocultar, anadirClase, eliminarClase }