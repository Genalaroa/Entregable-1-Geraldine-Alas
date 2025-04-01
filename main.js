const peluqueria = {
    id: 1,
    nombre: "Peluquería completa",
    imagen: './imagenes/peluqueria.jpg',
    descripcion: "Baño, corte personalizado y limpieza de oídos",
    precio: 45.00
};
const paseo = {
    id: 2,
    nombre: "Paseos caninos",
    imagen: 'imagenes/paseo.jpg',
    descripcion: "Paseos de 45 minutos con recogida a domicilio", 
    precio: 20.00
}; 
const casa = {
    id: 3,
    nombre: "Cuidado en casa",
    imagen: 'imagenes/casa.jpg', 
    descripcion: "Atención y cuidado de tu mascota en tu hogar mientras estás fuera",
    precio: 35.00  
};
const finca = {
    id: 4,
    nombre: "Cuidado en finca",
    imagen: 'imagenes/finca.jpg', 
    descripcion: "Alojamiento de tu mascota en nuestra finca con amplios espacios verdes",
    precio: 50.00
};

const servicios = [peluqueria, paseo, casa, finca];
let carritoServicios = [];

document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    try {
        mostrarServicios();
        cargarCarritoDesdeStorage();
        actualizarVistaCarrito();
        document.getElementById('finalizar').addEventListener('click', confirmarCompra);
    } catch (error) {
        mostrarToast(`Error al inicializar la aplicación: ${error.message}`, 'error');
        console.error('Error en la inicialización:', error);
    }
}

function mostrarToast(mensaje, tipo = 'info') {
    const bgColor = tipo === 'error' ? '#ff6b6b' : 
               tipo === 'success' ? '#51cf66' : 
               tipo === 'warning' ? '#fcc419' : 
               '#339af0';
    
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: bgColor,
        stopOnFocus: true
    }).showToast();
}

function mostrarServicios() {
    try {
        const listaServicios = document.getElementById('listaServicios');
        if (!listaServicios) {
            throw new Error('El elemento listaServicios no existe en el DOM');
        }
        
        listaServicios.innerHTML = '';

        servicios.forEach(servicio => {
            const item = document.createElement('div');
            item.className = 'servicio-item';
            const itemContent = document.createElement('div');
            itemContent.className = 'servicio-content';
            
            const imagen = document.createElement('img');
            imagen.src = servicio.imagen;
            imagen.alt = servicio.nombre;
            imagen.onerror = () => {
                imagen.src = 'imagenes/placeholder.jpg';
                mostrarToast(`No se pudo cargar la imagen de ${servicio.nombre}`, 'error');
            };
            
            const titulo = document.createElement('h3');
            titulo.textContent = servicio.nombre;
            
            const descripcion = document.createElement('p');
            descripcion.textContent = servicio.descripcion;
            
            const precio = document.createElement('p');
            precio.className = 'precio';
            precio.textContent = `${servicio.precio.toFixed(2)} €`;
            
            const botonAgregar = document.createElement('button');
            botonAgregar.textContent = 'Añadir al carrito';
            botonAgregar.className = 'btn-agregar';
            botonAgregar.dataset.id = servicio.id;
            botonAgregar.addEventListener('click', () => agregarAlCarrito(servicio));
            
            item.appendChild(imagen);
            itemContent.appendChild(titulo);
            itemContent.appendChild(descripcion);
            itemContent.appendChild(precio);
            item.appendChild(itemContent);
            item.appendChild(botonAgregar);
            
            listaServicios.appendChild(item);
        });
    } catch (error) {
        mostrarToast(`Error al mostrar servicios: ${error.message}`, 'error');
        console.error('Error al mostrar servicios:', error);
    }
}

function agregarAlCarrito(servicio) {
    try {
        if (!servicio || !servicio.id) {
            throw new Error('Servicio no válido');
        }
        
        const servicioEnCarrito = carritoServicios.find(item => item.id === servicio.id);
        
        if (servicioEnCarrito) {
            servicioEnCarrito.cantidad++;
        } else {
            carritoServicios.push({
                ...servicio,
                cantidad: 1
            });
        }
        
        actualizarVistaCarrito();
        guardarCarritoEnStorage();
        
        mostrarToast(`${servicio.nombre} añadido al carrito`, 'success');
    } catch (error) {
        mostrarToast(`Error al agregar al carrito: ${error.message}`, 'error');
        console.error('Error al agregar al carrito:', error);
    }
}

function crearCarritoDiv() {
    try {
        const carritoDiv = document.createElement('div');
        carritoDiv.id = 'carrito';
        carritoDiv.className = 'carrito-container';
        
        const listaServicios = document.getElementById('listaServicios');
        if (!listaServicios) {
            throw new Error('El elemento listaServicios no existe en el DOM');
        }
        
        listaServicios.parentNode.insertBefore(carritoDiv, listaServicios.nextSibling);
        
        return carritoDiv;
    } catch (error) {
        mostrarToast(`Error al crear el carrito: ${error.message}`, 'error');
        console.error('Error al crear el carrito:', error);
        return document.createElement('div');
    }
}

function actualizarVistaCarrito() {
    try {
        const carritoDiv = document.getElementById('carrito') || crearCarritoDiv();
        const resumenDiv = document.getElementById('resumen');
        
        if (!carritoDiv) {
            throw new Error('No se pudo obtener o crear el elemento del carrito');
        }
        
        carritoDiv.innerHTML = '<h2>Tu Carrito</h2>';
        
        if (carritoServicios.length === 0) {
            carritoDiv.innerHTML += '<p>No hay servicios en el carrito</p>';
            document.getElementById('finalizar').style.display = 'none';
            return;
        }
        
        const listaCarrito = document.createElement('ul');
        listaCarrito.className = 'lista-carrito';
        
        let totalPrecio = 0;
        
        carritoServicios.forEach(item => {
            const itemLi = document.createElement('li');
            itemLi.className = 'item-carrito';
            
            const nombreItem = document.createElement('span');
            nombreItem.textContent = item.nombre;
            
            const precioItem = document.createElement('span');
            precioItem.textContent = `${(item.precio * item.cantidad).toFixed(2)} €`;
            
            const controlCantidad = document.createElement('div');
            controlCantidad.className = 'control-cantidad';
            
            const btnDisminuir = document.createElement('button');
            btnDisminuir.textContent = '-';
            btnDisminuir.addEventListener('click', () => cambiarCantidad(item.id, -1));
            
            const spanCantidad = document.createElement('span');
            spanCantidad.textContent = item.cantidad;
            
            const btnAumentar = document.createElement('button');
            btnAumentar.textContent = '+';
            btnAumentar.addEventListener('click', () => cambiarCantidad(item.id, 1));
            
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '🗑️';
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.addEventListener('click', () => eliminarDelCarrito(item.id));
            
            controlCantidad.appendChild(btnDisminuir);
            controlCantidad.appendChild(spanCantidad);
            controlCantidad.appendChild(btnAumentar);
            
            itemLi.appendChild(nombreItem);
            itemLi.appendChild(controlCantidad);
            itemLi.appendChild(precioItem);
            itemLi.appendChild(btnEliminar);
            
            listaCarrito.appendChild(itemLi);
            
            totalPrecio += item.precio * item.cantidad;
        });
        
        carritoDiv.appendChild(listaCarrito);
        
        let descuento = 0;
        if (carritoServicios.length >= 3) {
            descuento = totalPrecio * 0.10;
        }
        
        const totalDiv = document.createElement('div');
        totalDiv.className = 'total-carrito';
        
        const subtotalP = document.createElement('p');
        subtotalP.innerHTML = `<strong>Subtotal:</strong> ${totalPrecio.toFixed(2)} €`;
        totalDiv.appendChild(subtotalP);
        
        if (descuento > 0) {
            const descuentoP = document.createElement('p');
            descuentoP.innerHTML = `<strong>Descuento (10%):</strong> ${descuento.toFixed(2)} €`;
            totalDiv.appendChild(descuentoP);
            
            const totalP = document.createElement('p');
            totalP.className = 'precio-total';
            totalP.innerHTML = `<strong>Total:</strong> ${(totalPrecio - descuento).toFixed(2)} €`;
            totalDiv.appendChild(totalP);
        } else {
            const totalP = document.createElement('p');
            totalP.className = 'precio-total';
            totalP.innerHTML = `<strong>Total:</strong> ${totalPrecio.toFixed(2)} €`;
            totalDiv.appendChild(totalP);
        }
        
        carritoDiv.appendChild(totalDiv);
        document.getElementById('finalizar').style.display = 'block';
    } catch (error) {
        mostrarToast(`Error al actualizar el carrito: ${error.message}`, 'error');
        console.error('Error al actualizar el carrito:', error);
    }
}

function cambiarCantidad(id, cambio) {
    try {
        if (!id) {
            throw new Error('ID de servicio no válido');
        }
        
        const index = carritoServicios.findIndex(item => item.id === id);
        
        if (index === -1) {
            throw new Error('Servicio no encontrado en el carrito');
        }
        
        if (carritoServicios[index].cantidad + cambio <= 0) {
            eliminarDelCarrito(id);
            return;
        }

        if (cambio>0) {
        if(carritoServicios[index].cantidad<=4){
        carritoServicios[index].cantidad += cambio;
        actualizarVistaCarrito();
        guardarCarritoEnStorage();
        mostrarToast('Cantidad actualizada', 'info');
        }else{
            mostrarToast('Cantidad maxima de 5 unidades alcanzada', 'warning');
        }
    }else{
        carritoServicios[index].cantidad += cambio;
        actualizarVistaCarrito();
        guardarCarritoEnStorage();
        mostrarToast('Cantidad actualizada', 'info');
    }
        
    } catch (error) {
        mostrarToast(`Error al cambiar cantidad: ${error.message}`, 'error');
        console.error('Error al cambiar cantidad:', error);
    }
}

function eliminarDelCarrito(id) {
    try {
        if (!id) {
            throw new Error('ID de servicio no válido');
        }
        
        const servicioEliminado = carritoServicios.find(item => item.id === id);
        carritoServicios = carritoServicios.filter(item => item.id !== id);
        
        actualizarVistaCarrito();
        guardarCarritoEnStorage();
        
        if (servicioEliminado) {
            mostrarToast(`${servicioEliminado.nombre} eliminado del carrito`, 'info');
        }
    } catch (error) {
        mostrarToast(`Error al eliminar del carrito: ${error.message}`, 'error');
        console.error('Error al eliminar del carrito:', error);
    }
}

function guardarCarritoEnStorage() {
    try {
        localStorage.setItem('carritoServicios', JSON.stringify(carritoServicios));
    } catch (error) {
        mostrarToast(`Error al guardar en localStorage: ${error.message}`, 'error');
        console.error('Error al guardar en localStorage:', error);
    }
}

function cargarCarritoDesdeStorage() {
    try {
        const carritoGuardado = localStorage.getItem('carritoServicios');
        if (carritoGuardado) {
            carritoServicios = JSON.parse(carritoGuardado);
        }
    } catch (error) {
        mostrarToast(`Error al cargar desde localStorage: ${error.message}`, 'error');
        console.error('Error al cargar desde localStorage:', error);
        carritoServicios = [];
    }
}

function confirmarCompra() {
    if (carritoServicios.length === 0) {
        mostrarToast('No hay servicios en el carrito', 'error');
        return;
    }

    mostrarFormularioContacto();
}

function mostrarFormularioContacto() {
    try {
        const resumenDiv = document.getElementById('resumen');
        if (!resumenDiv) {
            throw new Error('No se encontró el contenedor de resumen');
        }

        resumenDiv.style.display = 'block';
        
        resumenDiv.innerHTML = '';

        const formulario = document.createElement('div');
        formulario.innerHTML = `
            <h2>Datos de Contacto</h2>
            <form id="formularioContacto">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre"  required>

                <label for="apellido">Apellido:</label>
                <input type="text" id="apellido" name="apellido"  required>

                <label for="telefono">Teléfono:</label>
                <input type="tel" id="telefono" name="telefono"  required>

                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email"  required>

                <button type="submit" class="btn-comprar">Enviar</button>
            </form>
        `;
        
        resumenDiv.appendChild(formulario);

        document.getElementById('formularioContacto').addEventListener('submit', function (event) {
            event.preventDefault();
            finalizarCompra();
        });

    } catch (error) {
        mostrarToast(`Error al mostrar formulario: ${error.message}`, 'error');
        console.error('Error al mostrar formulario:', error);
    }
}

function finalizarCompra() {
    try {
        mostrarToast('Procesando su solicitud...', 'info');

        
        const resumenDiv = document.getElementById('resumen');
        if (!resumenDiv) {
            throw new Error('El elemento de resumen no existe en el DOM');
        }
        
        resumenDiv.innerHTML = '';
        
        const mensajeHTML = `
            <div class="compra-finalizada">
                <h2>¡Gracias por su solicitud!</h2>
                <p>En breve contactaremos con usted para concertar la cita.</p>
                <p>Los detalles de los servicios solicitados han sido registrados.</p>
                <button id="btnNuevaCompra">Volver a la tienda</button>
            </div>
        `;
        
        resumenDiv.innerHTML = mensajeHTML;
   
        resumenDiv.style.display = 'block';
        
        carritoServicios = [];
        localStorage.removeItem('carritoServicios');
        actualizarVistaCarrito();
        
        
        const btnFinalizar = document.getElementById('finalizar');
        if (btnFinalizar) {
            btnFinalizar.style.display = 'none';
        }
        
        
        
        const btnNuevaCompra = document.getElementById('btnNuevaCompra');
        if (btnNuevaCompra) {
            btnNuevaCompra.addEventListener('click', function() {
                resumenDiv.style.display = 'none';
                mostrarToast('¡Listo para una nueva solicitud!', 'info');
            });
        } else {
            console.error('Botón nueva compra no encontrado');
        }
        
        mostrarToast('¡Solicitud enviada con éxito!', 'success');
    } catch (error) {
        mostrarToast(`Error al finalizar solicitud: ${error.message}`, 'error');
        console.error('Error al finalizar solicitud:', error);
    }
};