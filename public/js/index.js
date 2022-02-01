const { send } = require('../../src/utils/nodemailer');
const { sendWsp } = require('../../src/utils/whatsapp');

const productsList = document.querySelector('#productos');
let cartList = document.querySelector('#carritos');

const loadCarts = async () => {
    const data = await fetch('/api/carrito');
    const carts = await data.json();
    let cartsHtml = cartList.innerHTML = '';
    cartsHtml += `<option selected>Elija un carrito</option>`;
    carts.forEach(cart => {
        cartsHtml += `<option value=${cart._id}></option>`;
    });
}

loadCarts();

const loadProducts = async () => {
    const data = await fetch('/api/productos');
    const products = await data.json();
    let productsHtml = productsList.innerHTML = '';
    productsHtml += `<option selected>Elija un producto</option>`;
    products.forEach(product => {
        productsHtml += `<option value=${product.name}></option>`;
    });
}

loadProducts();

const createCart = async () =>{
    const options = {method = "POST"};
    return await fetch('/api/carrito', options)
    .then(response => response.json);
}

document.querySelector('#btnCrearCarrito').addEventListener('click', () => {
    createCart()
    .then(({ id }) => {
        loadCarts().then(() => {
            cartList.value = `${id}`
            cartList.dispatchEvent(new Event('change'));
        });
    })
});

const updateCart = async (cartId) =>{
    const data = await fetch(`/api/carrito/${cartId}/productos`);
    const productsInCart = await data.json();
    productsInCart.then(prods => makeHtmlTable(prods))
        .then(html => {
            document.querySelector('#carrito').innerHTML = html;
        });
}

cartList.addEventListener('change', () => {
    cartList.value;
    updateCart(cartId);
});

const addToCart = async (cartId, prodId) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(prodId)
    }
    return await fetch(`/api/carrito/${cartId}/productos`, options)
        .then(() => {
            updateCart(cartId);
        })
}

document.querySelector('#btnAgregarAlCarrito').addEventListener('click', () => {
    const cartId = cartList.value;
    const prodId = productsList.value;
    if (cartId && prodId) {
        addToCart(cartId, prodId);
    } else {
        alert('Debe seleccionar un carrito y un producto.');
    }
});

document.querySelectorAll('#btnFinalizarCompra').addEventListener('click', () => {
    const cartId = cartList.value;
    alert('Compra realizada');
    send(`Orden de compra exitosa, carrito ${cartId}`);
    sendWsp(`Orden de compra existosa para carrito ${cartId}`);
});


const deleteFromCart = async (prodId) => {
    const cartId = cartList.value;
    const options = {
        method: 'DELETE',
    }
    return await fetch(`/api/carritos/${cartId}/productos/${prodId}`, options)
        .then(() => {
            updateCart(cartId);
    });
}

function makeHtmlTable(products) {
    let html = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>`

    if (products.length > 0) {
        html += `
        <h2>Lista de Productos</h2>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>`
        for (const prod of products) {
            html += `
                    <tr>
                    <td>${prod.name}</td>
                    <td>$${prod.price}</td>
                    <td><img width="50" src=${prod.photo}></td>
                    <td><a type="button" onclick="deleteFromCart('${prod._id}')">Borrar</a></td>
                    </tr>`
        }
        html += `
            </table>
        </div >`
    } else {
        html += `<br><h4>Carrito sin productos.</h2>`
    }
    return Promise.resolve(html);
}


