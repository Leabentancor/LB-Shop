

const icono = document.querySelector(".icono");
const bolsaProductos = document.querySelector(".bolsa-productos");
const contenedorProductos = document.querySelector(".productos");
const agregarAlCarrito = document.querySelector("agregar-al-carrito");
const cerrar = document.querySelector("#iconoCerrar");
const carritoLogo = document.querySelector(".img-carrito");
const contador = document.querySelector("#contador");
const main = document.querySelector(".main");
const carritoVacio = document.querySelector("carritoVacio");
const pestaneaCarrito = document.querySelector("#pestaneaCarrito");
const finalizarCompra = document.querySelector(".botonPagar");
const productosCarrito = document.querySelector(".carritoProductos");
let totalAPagarTexto = document.querySelector(".total");
let totalAPagar = document.querySelector('#totalAPagar');
let totalPrecio = document.querySelector(".totalPrecio");

let carrito = [];
let productos = [];

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        recargarCarrito();
    }
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

cargarCarritoDesdeLocalStorage();


fetch("/data/data.json")
    .then((res) => res.json())
    .then((data) => {
        productos = [...data];
        mostrarProductos(productos);
    });

function mostrarProductos(productos) {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <figure>
                <img class="img-producto" src="${producto.img}">
            </figure>
            <div class="info">
                <h2>${producto.titulo}</h2>
                <p>$${producto.precio}</p>
            </div>
        `;

        let button = document.createElement("button");
        button.classList.add("agregar-al-carrito");
        button.innerText = "Agregar al carrito";
        button.addEventListener("click", () => {
            cargarCarrito(producto);

            Toastify({
                text: "Agregado al carrito",
                className: "toastify",
                duration: 1500,
                gravity: "bottom",
                onClick: function(){bolsaProductos.classList.toggle("abierto");} 
            }).showToast();
        });

        div.append(button);
        contenedorProductos.append(div);
    });
}

carritoLogo.addEventListener("click", () => {
    bolsaProductos.classList.toggle("abierto");
    actualizarContador();
});

contador.addEventListener("click", () => {
    bolsaProductos.classList.toggle("abierto");
    actualizarContador();
});

const cargarCarrito = (producto) => {
    const productoAgregado = carrito.find(item => item.id === producto.id);
    if (productoAgregado) {
        productoAgregado.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    recargarCarrito();
    actualizarContador();
    guardarCarritoEnLocalStorage();
    calcularTotalCarrito();
}

function recargarCarrito() {
    const pestaneaCarrito = document.querySelector(".carritoProductos");
    if (carrito.length === 0) {
        pestaneaCarrito.innerHTML = `<p class="mensajeCarritoVacio">El carrito está vacío.</p>`;
    } else {
        pestaneaCarrito.innerHTML = "";

        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("productoEnCarrito");
            div.innerHTML = `
                <figure>
                    <img class="img-producto" src="${producto.img}">
                </figure>
                <div class="info">
                    <h2>${producto.titulo}</h2>
                    <p>Cant: ${producto.cantidad}</p>
                </div>
                <p class="info">$${producto.precio * producto.cantidad}</p>
            `; 

            let button = document.createElement("button");
            button.classList.add("botonEnCarrito");
            button.innerText = "🗑️";
            button.addEventListener("click", () => {
                quitarProducto(producto);
            });
            div.append(button);
            pestaneaCarrito.appendChild(div);
        });

        
        let botonFinalizarCompra = document.createElement("button");
        botonFinalizarCompra.innerText = "Finalizar compra";
        botonFinalizarCompra.classList.add("botonPagar");
        
        botonFinalizarCompra.addEventListener("click", () => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Desea finalizar la compra?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Si, quiero pagar!",
                cancelButtonText: "No, seguir comprando",
                reverseButtons: false
            }).then((result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire({
                        title: "Gracias por tu compra",
                        text: "Vuelve pronto 😊",
                        icon: "success"
                    });carrito = []; 
                    recargarCarrito(); 
                    actualizarContador();
                    guardarCarritoEnLocalStorage();
                    calcularTotalCarrito();
                } else if (
                  /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
                ) {
                swalWithBootstrapButtons.fire({
                    title: "Muy bien",
                    text: "Sigue agregando productos al carrito",
                    });
                    }
                });
        });

        
        pestaneaCarrito.appendChild(botonFinalizarCompra);
        pestaneaCarrito.appendChild(totalAPagarTexto);
        pestaneaCarrito.appendChild(totalAPagar);
    }
}

const quitarProducto = (producto) => {
    const posicionIndex = carrito.findIndex(item => item.id === producto.id);
    if (posicionIndex >= 0) {
        carrito.splice(posicionIndex, 1);
        recargarCarrito();
        actualizarContador();
        guardarCarritoEnLocalStorage();
        calcularTotalCarrito();
    }

}

const actualizarContador = () => {
    contador.innerText = carrito.reduce((total, producto) => total + producto.cantidad, 0);
}; actualizarContador();

const calcularTotalCarrito = () => {
    const total = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);

        document.querySelector(".totalPrecio").innerText = `Total a pagar: $${total}`;
        
    };
;calcularTotalCarrito();