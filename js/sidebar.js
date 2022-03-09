let sidebar = document.querySelectorAll('.sidebar a');

const manejador  = (op) => {
    switch(op){
        case '_inicio':
            location.href = '././inicio.html';
            break;
        case '_usuarios':
            location.href = 'usuarios.html';
        break;
        case '_casos':
            location.href = 'casos.html';
            break;
        case '_reportes':
            break;
        case '_salir':
            location.href = '../index.html';
            break;
    }
}
sidebar.forEach(opcion => {
    opcion.addEventListener('click', (e) => {
        manejador(e.target.name);
        console.log(e.target.name);
    });
});

