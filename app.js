let listaAmigos = JSON.parse(localStorage.getItem('listaAmigos')) || [];
let asignaciones = {};

// Función para limpiar nombres y evitar duplicados invisibles
function limpiarNombre(nombre){
    return nombre.trim().toLowerCase().replace(/[^a-záéíóúñ\s]/gi, '');
}

// Mostrar la lista en pantalla
function mostrarAmigos() {
    let listaHTML = document.querySelector('#listaAmigos');
    listaHTML.innerHTML = "";
    listaAmigos.forEach(amigo => {
        let item = document.createElement('li');
        item.textContent = amigo;
        listaHTML.appendChild(item);
    });
}

// Agregar un amigo a la lista
function adicionarAmigo(){
    let input = document.querySelector('#amigo');
    let amigo = limpiarNombre(input.value);

    if(!amigo){
        Swal.fire({
            title: "Error al ingresar el nombre!",
            text: "Por favor ingrese un nombre válido.",
            icon: "error",
            confirmButtonText: "OK",
            timer: 3000
        });
        return;
    }

    if(listaAmigos.includes(amigo)){
        Swal.fire({
            title: "Nombre ya ingresado!",
            text: "Si es otra persona, por favor agrega apellido",
            icon: "error",
            confirmButtonText: "OK",
            timer: 3200
        });
        return;
    }

    listaAmigos.push(amigo);
    localStorage.setItem('listaAmigos', JSON.stringify(listaAmigos));
    mostrarAmigos();

    if(listaAmigos.length > 1){
        document.getElementById('sortearAmigo').disabled = false;
    }

    input.value = '';
}

// Generar asignaciones únicas de amigos secretos
function generarAmigosSecretos() {
    let disponibles = [...listaAmigos];
    asignaciones = {};

    listaAmigos.forEach(amigo => {
        let opciones = disponibles.filter(a => a !== amigo);
        let elegido = opciones[Math.floor(Math.random() * opciones.length)];
        asignaciones[amigo] = elegido;
        disponibles = disponibles.filter(a => a !== elegido);
    });
}

// Sorteo individual
function sortearAmigo() {
    if(listaAmigos.length < 2){
        Swal.fire('Se necesitan al menos 2 amigos para el sorteo');
        return;
    }

    generarAmigosSecretos();
    
    listaAmigos.forEach(amigo => {
        mostrarAmigoSecreto(amigo, asignaciones);
    });

    document.getElementById('sortearAmigo').disabled = true;
    document.getElementById('nuevoSorteo').disabled = false;
    document.getElementById('button-add').disabled = true;
    document.getElementById('amigo').disabled = true;
}

// Mostrar amigo secreto individual
function mostrarAmigoSecreto(amigo, asignaciones){
    Swal.fire({
        title: `Hola ${amigo}!`,
        text: `Tu amigo secreto es: ${asignaciones[amigo]}`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

// Nuevo sorteo: limpiar todo
function nuevoSorteo(){
    listaAmigos = [];
    asignaciones = {};
    localStorage.removeItem('listaAmigos');

    document.querySelector('#listaAmigos').innerHTML = '';
    document.querySelector('#resultado').innerHTML = '';

    document.getElementById('button-add').disabled = false;
    document.getElementById('amigo').disabled = false;
    document.getElementById('nuevoSorteo').disabled = true;
    document.getElementById('sortearAmigo').disabled = true;
}
