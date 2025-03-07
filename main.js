const peluqueria = {
    nombre: "Peluquería canina completa",
    imagen: './imagenes/peluqueria.jpg' ,
    descripcion: "baño, corte personalizado y limpieza de oídos",
    precio: 45.00
};
const paseo = {
    nombre: "Paseos caninos",
    imagen: 'imagenes/paseo.jpg',
    descripcion: "paseos de 45 minutos con recogida a domicilio", 
    precio: 20.00
}; 
const casa = {
    nombre: "Cuidado en casa",
    imagen: 'imagenes/casa.jpg', 
    descripcion: "atención y cuidado de tu mascota en tu hogar mientras estás fuera",
    precio: 35.00  
};
const finca = {
    nombre: "Cuidado en finca",
    imagen: 'imagenes/finca.jpg', 
    descripcion: "alojamiento de tu mascota en nuestra finca con amplios espacios verdes",
    precio: 50.00
};

const servicios = [peluqueria, paseo, casa, finca];
const serviciosElegidos = [];

document.addEventListener('DOMContentLoaded', function() {
    mostrarServicios();
    document.getElementById('seleccionarServicio').addEventListener('click', seleccionarServicio);
    document.getElementById('finalizar').addEventListener('click', mostrarResumen);
});

function mostrarServicios() {
    const listaServicios = document.getElementById('listaServicios');
    listaServicios.innerHTML = '';

    servicios.forEach((servicio) => {
        const item = document.createElement('li');
        const imagen = document.createElement('img');
        const titulo = document.createElement('p');
        const contexto = document.createElement('p');

        titulo.innerText = servicio.nombre;
        imagen.src = servicio.imagen;
        contexto.innerText = servicio.descripcion+" "+servicio.precio;
       
        item.appendChild(titulo);
        item.appendChild(imagen);
        item.appendChild(contexto);
        listaServicios.appendChild(item);
    });
}

function seleccionarServicio() {
    const seleccion = prompt("Ingrese el número del servicio que desea (1-4):");
    
    switch(seleccion) {
        case "1":
            alert(`Has seleccionado ${peluqueria.nombre} que consiste en ${peluqueria.descripcion} por ${peluqueria.precio}€`);
            serviciosElegidos.push(peluqueria);
            break;
        case "2":
            alert(`Has seleccionado ${paseo.nombre} que consiste en ${paseo.descripcion} por ${paseo.precio}€`);
            serviciosElegidos.push(paseo);
            break;
        case "3":
            alert(`Has seleccionado ${casa.nombre} que consiste en ${casa.descripcion} por ${casa.precio}€`);
            serviciosElegidos.push(casa);
            break;
        case "4":
            alert(`Has seleccionado ${finca.nombre} que consiste en ${finca.descripcion} por ${finca.precio}€`);
            serviciosElegidos.push(finca);
            break;
        default:
            alert("Selección no válida. Por favor, elija un número del 1 al 4.");
    }

    document.getElementById('finalizar').style.display = 'block';
}

function mostrarResumen() {
    const resumenDiv = document.getElementById('resumen');
    resumenDiv.style.display = 'block';
    resumenDiv.innerHTML = '';

    let resumen = "Resumen de servicios elegidos:\n\n";
    let totalPrecio = 0;

    serviciosElegidos.forEach((servicio, index) => {
        resumen += `${index + 1}. ${servicio.nombre} - ${servicio.precio}€\n`;
        totalPrecio += servicio.precio;
    });

    resumen += `\nTotal a pagar: ${totalPrecio.toFixed(2)}€`;
    resumenDiv.innerText = resumen;

    alert("¡Gracias por su visita! Esperamos verle pronto.");  
}

