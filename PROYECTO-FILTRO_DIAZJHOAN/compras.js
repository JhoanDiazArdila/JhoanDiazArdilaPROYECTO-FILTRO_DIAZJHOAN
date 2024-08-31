const btnCart = document.querySelector(".btnCar");
const contProducts = document.querySelector(".container-cart-products");

const cartEmpty = document.querySelector(".cart-empty");
const cartTotal = document.querySelector(".cart-total");

btnCart.addEventListener("click", () => {
    contProducts.classList.toggle("hidden-cart");
});

// ###

const cartInfo = document.querySelector(".cart-product");
const rowProduct = document.querySelector(".row-product");
const productsList = document.querySelector(".contenedor-sect-compras");

let allProducts = [];
const valorTotal = document.querySelector(".total-pagar");
const countProducts = document.querySelector("#contador-productos");




// ---------------------------Cargar  Guardar Local Store----------------

document.addEventListener("DOMContentLoaded", () => {
    const storedProducts = JSON.parse(localStorage.getItem("cartProducts"));
    if (storedProducts) {
        allProducts = storedProducts;
        showHTML();
    }
});

// ------------------------------------------------------


productsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-item")) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector(".title-item").textContent,
            price: product.querySelector(".price-item").textContent,
        };

        const exist = allProducts.some(
            (product) => product.title === infoProduct.title
        );

        if (exist) {
            const products = allProducts.map((product) => {
                if (product.title === infoProduct.title) {
                product.quantity++;
                return product;
                } else {
                return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }
    }
    showHTML();
});

rowProduct.addEventListener("click", (e) => {
    if (e.target.classList.contains("icon-close")) {
        const product = e.target.parentElement;
        const title = product.querySelector("p").textContent;

        allProducts = allProducts.filter((product) => product.title !== title);

        showHTML();
    }
});



// Mostrar en html

const showHTML = () => {
    if (!allProducts.length) {
        // console.log(!allProducts.length);
        cartEmpty.classList.remove("hidden-cart");
        rowProduct.classList.add("hidden-cart");
        cartTotal.classList.add("hidden-cart");
    } else {
        // console.log(!allProducts.length);
        cartEmpty.classList.add("hidden-cart");
        rowProduct.classList.remove("hidden-cart");
        cartTotal.classList.remove("hidden-cart");
    }
    // Limpiar primero

    rowProduct.innerHTML = "";

  //   Aumentar

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach((product) => {
        const containerProduct = document.createElement("div");
        containerProduct.classList.add("cart-product");

        containerProduct.innerHTML = `
        <div class="info-cart-product">
            <span class="cantidad-producto-carrito">${product.quantity}</span>
            <p class="titulo-producto-carrito">${product.title}</p>
            <span class="precio--producto-carrito">${product.price}</span>
        </div>
        <i class="bx bx-x-circle icon-close"></i>
        `;
        rowProduct.append(containerProduct);
        total = total + parseInt(product.price.slice(1)) * product.quantity;
        totalOfProducts = totalOfProducts + product.quantity;
    });
    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;

    // -------------------------------------------------

    localStorage.setItem("cartProducts", JSON.stringify(allProducts));

    // ----------------------------------------------------
};


// ----------------------Cargar productos Json

const URL= "./json/catalogo.json";

async function obtenerCatalogo(url){
    try{
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data
    } catch(error){
        console.log("Error al obtener catalogo: ",error);
    }
}

async function mostrarCatalogo(event){
    let productos = await obtenerCatalogo(URL)
    const contenedorPadre= document.querySelector(".grid");
    contenedorPadre.innerHTML = "";
    if (event==2){
        productos=productos.sort((a,b)=> b.precio - a.precio)
    } else if(event==1){
        productos=productos.sort((a,b)=> a.precio - b.precio)
    }

    productos.forEach((element)=>{
        const div= document.createElement("div");
        div.classList.add("tarjeta");
        div.innerHTML=`
            <div class="imagen-tarjeta">
                <img src="${element.imagen}" alt="imagen1">
            </div>
            <div class="info-mercancia">
                <p class="nombre-mercancia title-item">${element.nombre}
                </p>
                <p class="nombre-mercancia price-item">$ ${element.precio}</p>
                <button id="btnAdd" class="btn-item">
                    Añadir al carrito
                </button>
                <p class="descripcion-mercancia">
                    ${element.descripcion}
                </p>
            </div>
        `
        contenedorPadre.append(div);
    })
}


mostrarCatalogo();




const mayor = document.querySelector("#mayor");
mayor.addEventListener("click",(event)=>  mostrarCatalogo(2));
const menor = document.querySelector("#menor");
menor.addEventListener("click",(event)=>  mostrarCatalogo(1));
const normal = document.querySelector("#titulocat");
normal.addEventListener("click",(event)=>  mostrarCatalogo(0));



const btnPagar= document.querySelector("#btn-pagar");

btnPagar.addEventListener("click",()=> {
    localStorage.removeItem("cartProducts");
    allProducts=[];
    showHTML();
    alert("Productos pagados")
})






