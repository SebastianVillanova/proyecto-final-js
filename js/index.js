const card = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito");
const carritoContainer = document.getElementById("carrito-container");
const cantCarrito = document.getElementById("cantCarrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const getProductos = async()=>{
    const respuesta = await fetch('https://fakestoreapi.com/products?limit=5');
    const data = await respuesta.json();
    
    // cada card
    data.forEach((product)=>{
        let content = document.createElement("div");
        content.setAttribute("class", "card");
        content.innerHTML =`
            <img src="${product.image}" alt="">
            <h2>${product.title}</h2>
            <h3>Precio: ${product.price} $</h3>
            <p id="description">Descripción: ${product.description}</p>
            <p id="category">Categoria: ${product.category}</p>
        `; 
        card.append(content);

        // boton de comprar 
        let btnComprar = document.createElement("button");
        btnComprar.textContent = "Comprar";
        btnComprar.className = "comprar";
        content.append(btnComprar);
        btnComprar.addEventListener("click", ()=>{
            carrito.push({
                id: product.id,
                title: product.title,
                image: product.image,
                price: product.price,
            });
            pintarCarrito();
            carritoContainer.style.display = "none";
            saveLocal();
        });
    });

    const saveLocal = () =>{
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    // icono carrito 
    const pintarCarrito = () =>{
        carritoContainer.innerHTML = "";

        const carritoHeader = document.createElement("div");
        carritoHeader.className="carrito-header";
        carritoHeader.innerHTML=`
            <h1 class="carrito-titulo">Carrito</h1>
        `;
        carritoContainer.append(carritoHeader);
    
        const carritoButton = document.createElement("h1");
        carritoButton.innerText="X";
        carritoButton.className = "carrito-header-button";
        carritoHeader.append(carritoButton);
        carritoButton.addEventListener("click", ()=>{
            carritoContainer.style.display= "none";
        });
    
        let contenidoCarrito = document.createElement("div");
        contenidoCarrito.className="contenido-carrito";
        carritoContainer.append(contenidoCarrito);

        carrito.forEach((product) => {
            let carritoContent = document.createElement("div");
            carritoContent.className = "carrito-content";
            carritoContent.innerHTML = `
            <img src="${product.image}" alt="">
            <h3>${product.title}</h3>
            <p>$ ${product.price}</p>
            `;
            contenidoCarrito.append(carritoContent);

            // borrar item del carrito
            const btnBorrar = document.createElement("button");
            btnBorrar.textContent = "X";
            btnBorrar.className = "btn-borrar-de-carrito";
            carritoContent.append(btnBorrar);

            btnBorrar.addEventListener("click", ()=>{
                btnBorrar.parentElement.remove();
                let indice = carrito.indexOf(product.id);
                carrito.splice(indice, 1);
                pintarCarrito();
                saveLocal();
            });
        }); 
        const total = carrito.reduce((acc, el) => acc + el.price, 0);
        const totalComprando = document.createElement("div");
        totalComprando.className = "total-content";
        totalComprando.innerHTML = `total a pagar: $ ${total}`;
        carritoContainer.append(totalComprando);

        const vaciarCarrito = document.createElement("button");
        vaciarCarrito.innerText= "Vaciar carrito";
        carritoContainer.append(vaciarCarrito);
        vaciarCarrito.addEventListener("click", ()=>{
            do{
                carrito.pop();
            }while(carrito != 0);
            contenidoCarrito.remove();
            pintarCarrito();
            saveLocal();
            vaciarCarrito.remove();
            Swal.fire("Carrito vacio");
        })
    };

    verCarrito.addEventListener("click", ()=>{
        pintarCarrito();
        carritoContainer.style.display = "flex";
    });
}

getProductos();