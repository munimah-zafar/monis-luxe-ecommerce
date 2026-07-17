// ===============================
// CART
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();

function updateCartCount() {
    const count = document.getElementById("cartCount");

    if (count) {
        count.innerText = cart.length;
    }
}

// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(products) {

    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = "";

    // No Products Found
    if (products.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                <h2>🔍 No Products Found</h2>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }

    products.forEach(function(product){

        const card = document.createElement("div");

        card.className = "product-card";

        card.style.cursor = "pointer";

        card.addEventListener("click", function(){

            localStorage.setItem("selectedProduct", JSON.stringify(product));

            window.location.href = "product-details.html";

        });

        card.innerHTML = `

            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <p>${product.category}</p>

            <h3 class="price">
                Rs. ${product.price.toLocaleString()}
            </h3>

            <p class="rating">
                ⭐ ${product.rating} / 5
            </p>

            <button>Add To Cart</button>

        `;

        const button = card.querySelector("button");

        button.addEventListener("click", function(event){

            event.stopPropagation();

            cart.push(product);

            localStorage.setItem("cart", JSON.stringify(cart));

            updateCartCount();

            alert(product.name + " Added To Cart");

        });

        container.appendChild(card);

    });

}
// ===============================
// MEN PAGE
// ===============================

if(typeof menProducts !== "undefined"){

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortProducts = document.getElementById("sortProducts");

    function applyFilters(){

        let filteredProducts = menProducts;

        // Search Filter
        if(searchInput){

            const keyword = searchInput.value.toLowerCase();

            filteredProducts = filteredProducts.filter(function(product){

                return (
                    product.name.toLowerCase().includes(keyword) ||
                    product.category.toLowerCase().includes(keyword)
                );

            });

        }

        // Category Filter
        if(categoryFilter){

            const selectedCategory = categoryFilter.value;

            if(selectedCategory !== "All"){

                filteredProducts = filteredProducts.filter(function(product){

                    return product.category === selectedCategory;

                });

            }

        }
      // Sorting

if(sortProducts){

    const sortValue = sortProducts.value;


    if(sortValue === "low-high"){

        filteredProducts.sort(function(a,b){

            return a.price - b.price;

        });

    }


    else if(sortValue === "high-low"){

        filteredProducts.sort(function(a,b){

            return b.price - a.price;

        });

    }


    else if(sortValue === "rating"){

        filteredProducts.sort(function(a,b){

            return b.rating - a.rating;

        });

    }


    else if(sortValue === "name"){

        filteredProducts.sort(function(a,b){

            return a.name.localeCompare(b.name);

        });

    }

}
        displayProducts(filteredProducts);

    }

    // Initial Load
    applyFilters();

    // Search Event
    if(searchInput){

        searchInput.addEventListener("keyup", applyFilters);

    }

    // Category Event
    if(categoryFilter){

        categoryFilter.addEventListener("change", applyFilters);

    }
    if(sortProducts){

    sortProducts.addEventListener("change", applyFilters);

}

}

// ===============================
// LOAD CART
// ===============================

function loadCart(){

    const cartContainer = document.getElementById("cartItems");

    if(!cartContainer) return;

    cartContainer.innerHTML = "";

    if(cart.length === 0){

        cartContainer.innerHTML = `
            <h2 style="text-align:center;">
                Your Cart is Empty
            </h2>
        `;

        const totalPrice = document.getElementById("totalPrice");

        if(totalPrice){

            totalPrice.innerHTML = "";

        }

        return;

    }

    let total = 0;

    cart.forEach(function(product,index){

        total += product.price;

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <p>${product.category}</p>

            <h3 class="price">
                Rs. ${product.price.toLocaleString()}
            </h3>

            <button class="removeBtn">
                Remove
            </button>
        `;

        const removeBtn = card.querySelector(".removeBtn");

        removeBtn.addEventListener("click", function(){

            removeFromCart(index);

        });

        cartContainer.appendChild(card);

    });

    const totalPrice = document.getElementById("totalPrice");

    if(totalPrice){

        totalPrice.innerHTML = `
            <h2>Total : Rs. ${total.toLocaleString()}</h2>
        `;

    }

}

// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(index){

    cart.splice(index,1);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    loadCart();

}

// ===============================
// START CART
// ===============================

loadCart();
// ===============================
// PRODUCT DETAILS PAGE
// ===============================

function loadProductDetails(){

    const container = document.getElementById("productDetails");

    if(!container){
        return;
    }

    const product = JSON.parse(localStorage.getItem("selectedProduct"));

    if(!product){

        container.innerHTML = "<h2>Product Not Found</h2>";

        return;

    }

    container.innerHTML = `

        <div class="details-card">

            <img src="${product.image}" alt="${product.name}">

            <div class="details-info">

                <h2>${product.name}</h2>

                <p><strong>Category:</strong> ${product.category}</p>

                <h3 class="price">
                    Rs. ${product.price.toLocaleString()}
                </h3>

                <p class="rating">
                    ⭐ ${product.rating} / 5
                </p>

                <p class="description">

                    Premium quality product from Moni's Luxe.
                    Comfortable fabric with elegant design.

                </p>

               <div class="details-buttons">

    <button id="detailsCartBtn">
        Add To Cart
    </button>

    <button id="buyNowBtn">
        Buy Now
    </button>

</div>

            </div>

        </div>

    `;

    const button = document.getElementById("detailsCartBtn");

    button.addEventListener("click",function(){

        cart.push(product);

        localStorage.setItem("cart",JSON.stringify(cart));

        updateCartCount();

        alert(product.name + " Added To Cart");

    });
    const buyNowBtn = document.getElementById("buyNowBtn");

buyNowBtn.addEventListener("click", function(){

    localStorage.setItem("checkoutProduct", JSON.stringify(product));

    window.location.href = "checkout.html";

});

}

loadProductDetails();

// ===============================
// CHECKOUT PAGE
// ===============================

function loadCheckout(){

    const container = document.getElementById("checkoutContainer");

    if(!container){
        return;
    }

    const product = JSON.parse(localStorage.getItem("checkoutProduct"));

    if(!product){

        container.innerHTML = "<h2>No Product Selected</h2>";

        return;

    }

    container.innerHTML = `

        <div class="checkout-card">

            <img src="${product.image}" alt="${product.name}">

            <div class="checkout-info">

                <h2>${product.name}</h2>

                <p><strong>Category:</strong> ${product.category}</p>

                <h3 class="price">
                    Rs. ${product.price.toLocaleString()}
                </h3>

                <p class="rating">
                    ⭐ ${product.rating} / 5
                </p>

                <form id="checkoutForm">

    <input
        type="text"
        placeholder="Full Name"
        required>

    <input
        type="email"
        placeholder="Email Address"
        required>

    <input
        type="text"
        placeholder="Phone Number"
        required>

    <textarea
        placeholder="Delivery Address"
        rows="4"
        required></textarea>

    <button id="placeOrderBtn" type="submit">
        Place Order
    </button>

</form>
            </div>

        </div>

    `;
    const checkoutForm = document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", function(event){

    event.preventDefault();

    alert("🎉 Order Placed Successfully!");

    localStorage.removeItem("checkoutProduct");

    window.location.href = "../index.html";

});

}

loadCheckout();