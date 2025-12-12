let carrito = [];
const tablaBody = document.getElementById('productos-carrito');
const totalElement = document.getElementById('total-final');

document.addEventListener('DOMContentLoaded', () => {
    const carritoGuardado = localStorage.getItem('carritoData');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    renderizarCarrito();
    asignarListenersCarrito(); 
});

function formatoPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(precio);
}

function renderizarCarrito() {
    tablaBody.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const fila = document.createElement('tr');
        fila.dataset.nombre = producto.nombre; 

        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
            <td>${producto.nombre}</td>
            <td>${formatoPrecio(producto.precio)}</td>
            
            <td>
                <div class="cantidad-control">
                    <button class="btn-cantidad" data-accion="restar" data-nombre="${producto.nombre}">-</button>
                    <span class="cantidad-actual">${producto.cantidad}</span>
                    <button class="btn-cantidad" data-accion="sumar" data-nombre="${producto.nombre}">+</button>
                </div>
            </td>
            
            <td>${formatoPrecio(subtotal)}</td>

            <td>
                <button class="btn-eliminar" data-nombre="${producto.nombre}">🗑️</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    totalElement.textContent = formatoPrecio(total);

    const btnComprar = document.querySelector('.btn-comprar');
    if (btnComprar) {
        btnComprar.style.display = carrito.length > 0 ? 'inline-block' : 'none';
    }

    if (carrito.length === 0) {
        const filaVacia = document.createElement('tr');
        filaVacia.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 20px;">
                Tu carrito está vacío. ¡Te invitamos a ver nuestros productos!
            </td>
        `;
        tablaBody.appendChild(filaVacia);
        
        const tfoot = document.querySelector('.tabla-carrito tfoot');
        if (tfoot) tfoot.style.display = 'none';
        
    } else {
        const tfoot = document.querySelector('.tabla-carrito tfoot');
        if (tfoot) tfoot.style.display = 'table-footer-group'; 
    }
}

function asignarListenersCarrito() {
    tablaBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-cantidad')) {
            const nombre = e.target.dataset.nombre;
            const accion = e.target.dataset.accion;
            modificarCantidad(nombre, accion);
        }

        if (e.target.classList.contains('btn-eliminar')) {
            const nombre = e.target.dataset.nombre;
            eliminarProducto(nombre);
        }
    });
}

function modificarCantidad(nombreProducto, accion) {
    const productoIndex = carrito.findIndex(item => item.nombre === nombreProducto);

    if (productoIndex !== -1) {
        if (accion === 'sumar') {
            carrito[productoIndex].cantidad += 1;
        } else if (accion === 'restar') {
            carrito[productoIndex].cantidad -= 1;

            if (carrito[productoIndex].cantidad < 1) {
                eliminarProducto(nombreProducto);
                return;
            }
        }
    }

    localStorage.setItem('carritoData', JSON.stringify(carrito));
    renderizarCarrito();
}

function eliminarProducto(nombreProducto) {
    carrito = carrito.filter(item => item.nombre !== nombreProducto);
    
    localStorage.setItem('carritoData', JSON.stringify(carrito));
    renderizarCarrito();
}