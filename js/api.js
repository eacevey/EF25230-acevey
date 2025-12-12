let carrito = [];

const URL_API_PRODUCTOS = "https://fakestoreapi.com/products?limit=12";
const productosContenedor = document.getElementById('productos-contenedor');


document.addEventListener('DOMContentLoaded', () => {
    const carritoGuardado = localStorage.getItem('carritoData');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    if (productosContenedor) {
        cargarProductos(); 
    }
    
    actualizarContador();
    
});


async function cargarProductos() {
    productosContenedor.innerHTML = '<p>Cargando productos...</p>';

    try {
        const respuesta = await fetch(URL_API_PRODUCTOS);
        
        if (!respuesta.ok) {
            throw new Error(`Error al obtener datos: ${respuesta.statusText}`);
        }
        
        const productos = await respuesta.json();
        
        productosContenedor.innerHTML = '';

        productos.forEach(producto => {
            renderizarProducto(producto);
        });

        asignarListenersAgregarAlCarrito();

    } catch (error) {
        console.error("Error al obtener productos de la API:", error);
        productosContenedor.innerHTML = '<p class="error-msg">Error al cargar productos. Por favor, inténtelo más tarde.</p>';
    }
}

function renderizarProducto(data) {
    const precioBaseUSD = data.price;
    const tipoDeCambio = 800;
    const precioARS = (precioBaseUSD * tipoDeCambio).toFixed(2); 

    const cardHTML = `
        <div class="card">
            <a href="./pages/descripcion.html?id=${data.id}">
                <img src="${data.image}" alt="${data.title}">
                <h4>${data.title}</h4>
            </a>
            
            <p class="precio">Precio: <span>${formatoPrecio(precioARS)}</span></p>
            
            <button class="agregar-carrito-btn"
                    data-id="${data.id}"
                    data-name="${data.title}"
                    data-price="${precioARS}"
                    data-image="${data.image}">
                AGREGAR AL CARRITO
            </button>
        </div>
    `;
    productosContenedor.innerHTML += cardHTML;
}


function asignarListenersAgregarAlCarrito() {
    const botonesAgregar = document.querySelectorAll('.agregar-carrito-btn');
    botonesAgregar.forEach(button => {
        button.removeEventListener('click', agregarAlCarrito);
        button.addEventListener('click', agregarAlCarrito);
    });
}


function agregarAlCarrito(evento) {
    const boton = evento.target;
    
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-name');
    const precio = parseFloat(boton.getAttribute('data-price'));
    const imagenSrc = boton.getAttribute('data-image'); 
    
    if (!id || !nombre || isNaN(precio) || precio <= 0) {
         console.error("Error: Datos del producto incompletos o inválidos:", nombre, precio);
         return;
    }

    const nuevoProducto = {
        id: id,
        nombre: nombre,
        precio: precio,
        cantidad: 1,
        imagen: imagenSrc
    };

    const productoExistente = carrito.find(item => item.id === nuevoProducto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(nuevoProducto);
    }

    actualizarContador(); 
    localStorage.setItem('carritoData', JSON.stringify(carrito));
    
    console.log(`"${nombre}" agregado al carrito.`);
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

function formatoPrecio(precio) {
    const numPrecio = parseFloat(precio); 
    
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(numPrecio);
}