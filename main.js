

    let peluqueria = {
        nombre: "Peluquería canina completa",
        descripcion: " baño, corte personalizado y limpieza de oídos",
        precio: 45.00
    };
    let paseo = {
        nombre: "Paseos caninos",
        descripcion: "paseos de 45 minutos con recogida a domicilio", 
        precio: 20.00
    }; 
    let casa = {
        nombre: "Cuidado en casa",
        descripcion: "atención y cuidado de tu mascota en tu hogar mientras estás fuera",
        precio: 35.00  
    };
     let finca = {
        nombre: "Cuidado en finca",
        descripcion: "alojamiento de tu mascota en nuestra finca con amplios espacios verdes",
        precio: 50.00
    };

    const servicios = [peluqueria, paseo, casa, finca];
 
    function mostrarServicios() {
        let mensaje = "Bienvenido a nuestra Peluquería y Cuidados Caninos 🐾\n\n";
        mensaje += "Por favor, seleccione el número del servicio que desea:\n\n";
    
        for(let i = 0; i < servicios.length; i++) {
            mensaje += `${i+1}. ${servicios[i].nombre} \n\n`;
        }

        mensaje += "Ingrese el número del servicio (1-4): ";
        return mensaje;
    } 

    function preguntarNuevaSeleccion() {
        let nuevaSeleccion = confirm("¿Desea seleccionar otro servicio?");
        if (nuevaSeleccion) {
            seleccionarServicio();
        } else {
            alert("¡Gracias por su visita! Esperamos verle pronto.");
        }
    }

    function seleccionarServicio() {
        let seleccion = prompt(mostrarServicios());
         
        switch(seleccion) {
            case "1":
                alert(`Has seleccionado ${peluqueria.nombre} que consiste en ${peluqueria.descripcion} por ${peluqueria.precio}€`);
                preguntarNuevaSeleccion();
                break;
            case "2":
                alert(`Has seleccionado ${paseo.nombre} que consiste en ${paseo.descripcion} por ${paseo.precio}€`);
                preguntarNuevaSeleccion();
                break;
            case "3":
                alert(`Has seleccionado ${casa.nombre} que consiste en ${casa.descripcion} por ${casa.precio}€`);
                preguntarNuevaSeleccion();
                break;
            case "4":
                alert(`Has seleccionado ${finca.nombre} que consiste en ${finca.descripcion} por ${finca.precio}€`);
                preguntarNuevaSeleccion();
                break;
            default:
                alert("Selección no válida. Por favor, elija un número del 1 al 4.");
                seleccionarServicio();  
        }
     }
     
     
       seleccionarServicio();

    