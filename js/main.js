let servicios = [];
let carritoServicios = [];

fetch('./json/servicios.json')
  .then(res => res.json())
  .then(data => {
    servicios = data;
    mostrarServicios(servicios); 
  })
  .catch(error => {
    console.error('Error al cargar servicios:', error);
  });

  
document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    try {
        mostrarServicios();
        cargarCarritoDesdeStorage();
        actualizarVistaCarrito();


     
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

        listaServicios.innerHTML = servicios.map(servicio => `
            <div class="servicio-item">
                <img src="${servicio.imagen}" alt="${servicio.nombre}"; Toastify({ text: 'No se pudo cargar la imagen de ${servicio.nombre}', backgroundColor: '#ff6b6b' }).showToast();">
                <div class="servicio-content">
                    <h3>${servicio.nombre}</h3>
                    <p>${servicio.descripcion}</p>                            
                </div>
                <p class="precio">${servicio.precio.toFixed(2)} €</p>
                <button class="btn-agregar" data-id="${servicio.id}">Añadir al carrito</button>
            </div>
        `).join('');

        agregarEventosAgregar();

    } catch (error) {
        mostrarToast(`Error al mostrar servicios: ${error.message}`, 'error');
        console.error('Error al mostrar servicios:', error);
    }
}

function agregarEventosAgregar() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
  
    botonesAgregar.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const servicio = servicios.find(s => s.id === id);
        agregarAlCarrito(servicio);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const toggleCarritoBtn = document.getElementById('toggle-carrito');
    const carritoContainer = document.getElementById('carrito-container');
    const botonCerrarCarrito = document.getElementById('cerrar-carrito');
    document.getElementById('finalizar').addEventListener('click', mostrarResumen);

    toggleCarritoBtn.addEventListener('click', function() {
        if (carritoContainer.classList.contains('visible')) {
            carritoContainer.classList.remove('visible');
            toggleCarritoBtn.textContent = '🛒 Ver carrito'; 
        } else {
            carritoContainer.classList.add('visible');
            toggleCarritoBtn.textContent = '🛒 Ocultar carrito'; 
        }
    });
    botonCerrarCarrito.addEventListener('click', function() {
        carritoContainer.classList.remove('visible');
        toggleCarritoBtn.textContent = '🛒 Ver carrito'; 
    });
});

  
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
        if(document.getElementById('resumen').style.display == "block"){
            document.getElementById('finalizar').click();
        }
        
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
        const finalizarBtn = document.getElementById('finalizar');

        if (!carritoDiv) throw new Error('No se pudo obtener o crear el elemento del carrito');

        if (carritoServicios.length === 0) {
            carritoDiv.innerHTML = `<h2>Tu Carrito</h2><p>No hay servicios en el carrito</p>`;
            if (finalizarBtn) finalizarBtn.style.display = 'none';
            return;
        }

        let totalPrecio = 0;

        const itemsHTML = carritoServicios.map(item => {
            const subtotal = item.precio * item.cantidad;
            totalPrecio += subtotal;

            return `
                <li class="item-carrito">
                    <span>${item.nombre}</span>
                    <div class="control-cantidad">
                        <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                    <span>${subtotal.toFixed(2)} €</span>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
                </li>
            `;
        }).join('');

        let descuento = carritoServicios.length >= 3 ? totalPrecio * 0.10 : 0;
        let totalConDescuento = totalPrecio - descuento;

        carritoDiv.innerHTML = `
            <h2>Tu Carrito</h2>
            <ul class="lista-carrito">${itemsHTML}</ul>
            <div class="total-carrito">
                <p><strong>Subtotal:</strong> ${totalPrecio.toFixed(2)} €</p>
                ${descuento > 0 ? `<p><strong>Descuento (10%):</strong> ${descuento.toFixed(2)} €</p>` : ''}
                <p class="precio-total"><strong>Total:</strong> ${totalConDescuento.toFixed(2)} €</p>
            </div>
        `;

        if (finalizarBtn) finalizarBtn.style.display = 'block';
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

function mostrarResumen() {
    try {
        const resumenDiv = document.getElementById('resumen');
        if (!resumenDiv) {
            throw new Error('No se encontró el contenedor de resumen');
        }
         document.getElementById('cerrar-carrito').click();
        resumenDiv.style.display = 'block';
        
        resumenDiv.innerHTML = '';

        const encabezado = document.createElement('h2');
        encabezado.textContent = 'Resumen de su compra';
        resumenDiv.appendChild(encabezado);

        const listaItems = document.createElement('div');
        listaItems.classList.add('resumen-items');
        carritoServicios.forEach(item => {
            const itemResumen = document.createElement('div');
            itemResumen.innerHTML = `
                
                <strong>${item.cantidad} x ${item.nombre}</strong> - ${item.precio.toFixed(2)}€ c/u.
                <br>
                Total: ${(item.cantidad * item.precio).toFixed(2)}€
            `; 
            listaItems.appendChild(itemResumen);
        });
        
        resumenDiv.appendChild(listaItems);

        const totalCompra = carritoServicios.reduce((total, item) => total + item.cantidad * item.precio, 0);
        const totalFinal = document.createElement('h3');
        totalFinal.textContent = `Total a pagar: ${totalCompra.toFixed(2)}€`;
        resumenDiv.appendChild(totalFinal);
        const botonEnviar = document.createElement('button');
        botonEnviar.type = 'submit';
        botonEnviar.id = 'nextContacto';
        botonEnviar.className = 'btn-comprar';
        botonEnviar.textContent = 'Continuar con la compra';

        resumenDiv.appendChild(botonEnviar);

        botonEnviar.addEventListener('click', mostrarFormularioContacto);

    } catch (error) {
        mostrarToast(`Error al mostrar resumen: ${error.message}`, 'error');
        console.error('Error al mostrar resumen:', error);
    }

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
                <input type="text" id="nombre" name="nombre" value="Juan Ramon" required>

                <label for="apellido">Apellido:</label>
                <input type="text" id="apellido" name="apellido" value="Perez Dominguez" required>

                <label for="telefono">Teléfono:</label>
                <input type="tel" id="telefono"  name="telefono" Value="653 331 521"  required>

                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" Value="juanrperez@gmail.com" required>

            </form>
        `;
        
        resumenDiv.appendChild(formulario);
        const botonEnviar = document.createElement('button');
        botonEnviar.type = 'submit';
        botonEnviar.id = 'nextPago';
        botonEnviar.className = 'btn-comprar';
        botonEnviar.textContent = 'Continuar con el pago';

        resumenDiv.appendChild(botonEnviar);

        botonEnviar.addEventListener('click', metodoDePago);

    } catch (error) {
        mostrarToast(`Error al mostrar formulario: ${error.message}`, 'error');
        console.error('Error al mostrar formulario:', error);
    }

}


function metodoDePago() {
    try {
        const resumenDiv = document.getElementById('resumen');
        if (!resumenDiv) {
            throw new Error('No se encontró el contenedor de resumen');
        }

        resumenDiv.style.display = 'block';
        
        resumenDiv.innerHTML = '';

        const encabezado = document.createElement('h2');
        encabezado.textContent = 'Metodo de pago';
        resumenDiv.appendChild(encabezado);

        const formulario = document.createElement('div');

        formulario.innerHTML = `
           
                <div class="servicios-grid-pago" >
           <div class="servicio-item-pago" >
            <div>
                <img src="./imagenes/visa.jpg" >  
                </div>              
                <input class="radioPago" type="radio" name="metodoPago" value="visa">
            </div>
            <div class="servicio-item-pago" >
            <div>
                <img src="./imagenes/mastercard.jpg" >
                </div>                
                <input class="radioPago" type="radio" name="metodoPago" value="mastercard">
            </div>
            <div class="servicio-item-pago" >
            <div>
                <img src="./imagenes/paypal.jpg" >
                </div>                
                <input class="radioPago" type="radio" name="metodoPago" value="paypal">
            </div>
            <div class="servicio-item-pago" >
            <div>
                <img src="./imagenes/efectivo.jpg" >  
                </div>              
                <input class="radioPago" type="radio" name="metodoPago" value="efectivo">
            
            </div>
            </div>
            
        `;
        const botonEnviar = document.createElement('button');
        botonEnviar.type = 'submit';
        botonEnviar.id = 'nextFinalizar';
        botonEnviar.className = 'btn-comprar';
        botonEnviar.textContent = 'Finalizar solicitud';

      

        botonEnviar.addEventListener('click', finalizarCompra);
        
        resumenDiv.appendChild(formulario);
        resumenDiv.appendChild(botonEnviar);
  

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