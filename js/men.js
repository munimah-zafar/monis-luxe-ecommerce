async function loadMenProducts(){

    const response = await fetch(
        "http://127.0.0.1:8000/products/Men"
    );

    const products = await response.json();

    const container = document.getElementById("productContainer");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
        
        <div class="product-card">

            <img src="${product.image}">

            <h3>${product.name}</h3>

            <p>${product.category}</p>

            <p>Rs ${product.price}</p>

            <p>⭐ ${product.rating}</p>

        </div>

        `;

    });

}

loadMenProducts();