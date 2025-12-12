let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    const carritoGuardado = localStorage.getItem('carritoData');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    const botonesAgregar = document.querySelectorAll('.card button');
    botonesAgregar.forEach(button => {
        button.addEventListener('click', agregarAlCarrito);
    });

    actualizarContador();
    calcularTotal();
});

function agregarAlCarrito(evento) {
    const card = evento.target.closest('.card');
    
    if (!card) return;

    
    const nombreElement = card.querySelector('h4');
    const nombre = nombreElement ? nombreElement.textContent.replace(' ¡Stock inmediato!', '').trim() : 'Producto Desconocido';
    const precioElement = card.querySelector('.precio span');
    const precioTexto = precioElement ? precioElement.textContent.replace('$', '').replace(/\./g, '').replace(',', '.') : '0';
    const precio = parseFloat(precioTexto); 
    const imagenElement = card.querySelector('img');
    const imagenSrc = imagenElement ? imagenElement.src : '';
    const nuevoProducto = {
        nombre: nombre,
        precio: precio,
        cantidad: 1,
        imagen: imagenSrc
    };

    const productoExistente = carrito.find(item => item.nombre === nuevoProducto.nombre);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(nuevoProducto);
    }

    actualizarContador(); 
    calcularTotal();     
    
    localStorage.setItem('carritoData', JSON.stringify(carrito)); 
}

function actualizarContador() {
    const cantidadTotal = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.cantidad;
    }, 0);

    const countElement = document.querySelector('.count');
    
    if (countElement) {
        countElement.textContent = cantidadTotal.toString();
        
        if (cantidadTotal > 0) {
            countElement.style.display = 'flex';
        } else {
            countElement.style.display = 'none';
        }
    }
}

function calcularTotal() {
    let total = carrito.reduce((acumulador, producto) => {
        return acumulador + (producto.precio * producto.cantidad);
    }, 0);
    
    const formatoMoneda = new Intl.NumberFormat('es-AR', { 
        style: 'currency', 
        currency: 'ARS',
        minimumFractionDigits: 2 
    }).format(total);

    const totalElement = document.querySelector('.total-carrito');
    if (totalElement) {
        totalElement.textContent = formatoMoneda;
    }
}