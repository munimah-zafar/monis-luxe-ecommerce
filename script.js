// ======================================
// MZ LUXE - SCRIPT.JS
// PART 1
// Global Variables + Cart + Filters
// ======================================

// ----------------------------
// CART
// ----------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ----------------------------
// UPDATE CART COUNT
// ----------------------------

function updateCartCount(){

    const cartCount = document.getElementById("cartCount");

    if(!cartCount){
        return;
    }

    let totalItems = 0;

    cart.forEach(function(item){

        totalItems += item.quantity || 1;

    });

    cartCount.innerHTML = totalItems;

}

updateCartCount();


// ----------------------------
// PAGE PRODUCTS
// ----------------------------

let pageProducts = [];

function initPageProducts() {

    if(!document.body || !document.body.dataset){
        return;
    }

    const currentPage = document.body.dataset.page;

    if(currentPage === "men"){
        pageProducts = [...menProducts];
    }

    else if(currentPage === "women"){
        pageProducts = [...womenProducts];
    }

}

initPageProducts();


// ----------------------------
// DOM ELEMENTS
// ----------------------------

const searchInput =
document.getElementById("searchInput");

const categoryFilter =
document.getElementById("categoryFilter");

const sortProducts =
document.getElementById("sortProducts");


// ----------------------------
// APPLY FILTERS
// ----------------------------

function applyFilters(){

    let filteredProducts = [...pageProducts];

    // SEARCH

    if(searchInput){

        const keyword =
        searchInput.value.toLowerCase();

        filteredProducts =
        filteredProducts.filter(function(product){

            return(

                product.name
                .toLowerCase()
                .includes(keyword)

                ||

                product.category
                .toLowerCase()
                .includes(keyword)

            );

        });

    }

    // CATEGORY

    if(categoryFilter){

        const selected =
        categoryFilter.value;

        if(selected !== "All"){

            filteredProducts =
            filteredProducts.filter(function(product){

                return product.category === selected;

            });

        }

    }

    // SORTING

    if(sortProducts){

        switch(sortProducts.value){

            case "low-high":

                filteredProducts.sort(function(a,b){

                    return a.price-b.price;

                });

            break;

            case "high-low":

                filteredProducts.sort(function(a,b){

                    return b.price-a.price;

                });

            break;

            case "rating":

                filteredProducts.sort(function(a,b){

                    return b.rating-a.rating;

                });

            break;

            case "name":

                filteredProducts.sort(function(a,b){

                    return a.name.localeCompare(b.name);

                });

            break;

        }

    }

    displayProducts(filteredProducts);

}


// ----------------------------
// EVENTS
// ----------------------------

if(searchInput){

    searchInput.addEventListener(
        "keyup",
        applyFilters
    );

}

if(categoryFilter){

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

}

if(sortProducts){

    sortProducts.addEventListener(
        "change",
        applyFilters
    );

}

// ======================================
// PART 2
// DISPLAY PRODUCTS
// ======================================

function displayProducts(products){

    const container = document.getElementById("productContainer");

    if(!container){
        return;
    }

    container.innerHTML = "";

    if(products.length === 0){

        container.innerHTML = `
            <div class="no-products">
                <h2>🔍 No Products Found</h2>
                <p>Try another search.</p>
            </div>
        `;

        return;

    }

    products.forEach(function(product,index){

        const card = document.createElement("div");

        card.className = "product-card";

        card.style.cursor = "pointer";

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

            <button class="addCartBtn">
                Add To Cart
            </button>

        `;

        // ------------------------
        // PRODUCT DETAILS
        // ------------------------

        card.addEventListener("click", function(){

            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(product)
            );

            window.location.href = "product-details.html";

        });

        // ------------------------
        // ADD TO CART
        // ------------------------

        const button = card.querySelector(".addCartBtn");

        button.addEventListener("click", function(event){

            event.stopPropagation();

            const existingProduct = cart.find(function(item){

                return item.id === product.id;

            });

            if(existingProduct){

                existingProduct.quantity++;

            }

            else{

                const newProduct = {

                    ...product,

                    quantity: 1

                };

                cart.push(newProduct);

            }

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            updateCartCount();

            alert(product.name + " Added To Cart");

        });

        container.appendChild(card);

    });

}

// ======================================
// INITIAL PRODUCT LOAD
// ======================================

if(pageProducts.length > 0){

    applyFilters();

}

// ======================================
// PART 3
// CART PAGE
// ======================================

function loadCart(){

    const cartContainer =
        document.getElementById("cartItems");

    if(!cartContainer){
        return;
    }

    cartContainer.innerHTML = "";

    if(cart.length === 0){

        cartContainer.innerHTML = `
            <h2 style="text-align:center;">
                Your Cart is Empty
            </h2>
        `;

        const totalPrice =
            document.getElementById("totalPrice");

        if(totalPrice){
            totalPrice.innerHTML = "";
        }

        updateCartCount();

        return;

    }

    let total = 0;

    cart.forEach(function(product,index){

        total += product.price * product.quantity;

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <p>${product.category}</p>

            <h3 class="price">

                Rs. ${(product.price * product.quantity).toLocaleString()}

            </h3>

            <div class="quantity-box">

                <button class="minusBtn">-</button>

                <span>${product.quantity}</span>

                <button class="plusBtn">+</button>

            </div>

            <button class="removeBtn">

                Remove

            </button>

        `;

        // -----------------------
        // PLUS
        // -----------------------

        card.querySelector(".plusBtn")
        .addEventListener("click",function(){

            product.quantity++;

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            loadCart();

            updateCartCount();

        });

        // -----------------------
        // MINUS
        // -----------------------

        card.querySelector(".minusBtn")
        .addEventListener("click",function(){

            product.quantity--;

            if(product.quantity <= 0){

                removeFromCart(index);

                return;

            }

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            loadCart();

            updateCartCount();

        });

        // -----------------------
        // REMOVE
        // -----------------------

        card.querySelector(".removeBtn")
        .addEventListener("click",function(){

            removeFromCart(index);

        });

        cartContainer.appendChild(card);

    });

    const totalPrice =
        document.getElementById("totalPrice");

    if(totalPrice){

        totalPrice.innerHTML = `

            <h2>

                Total : Rs. ${total.toLocaleString()}

            </h2>

        `;

    }

}

// ======================================
// REMOVE PRODUCT
// ======================================

function removeFromCart(index){

    cart.splice(index,1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    loadCart();

}

// ======================================
// CLEAR CART
// ======================================

const clearCartBtn =
document.getElementById("clearCartBtn");

if(clearCartBtn){

    clearCartBtn.onclick = function(){

        if(confirm("Are you sure you want to clear the cart?")){

            cart = [];

            localStorage.removeItem("cart");

            updateCartCount();

            loadCart();

        }

    };

}

// ======================================
// CHECKOUT BUTTON
// ======================================

const checkoutBtn = document.getElementById("checkoutBtn");

if(checkoutBtn){

    checkoutBtn.addEventListener("click", function(){

        if(cart.length === 0){

            alert("Your cart is empty!");

            return;

        }

        localStorage.setItem(
            "checkoutProduct",
           JSON.stringify(cart)
        );

        window.location.href = "checkout.html";

    });

}

// ======================================
// START CART
// ======================================

loadCart();

// ======================================
// PART 4
// PRODUCT DETAILS PAGE
// ======================================

function loadProductDetails(){

    const container =
        document.getElementById("productDetails");

    if(!container){
        return;
    }

    const product = JSON.parse(
        localStorage.getItem("selectedProduct")
    );

    if(!product){

        container.innerHTML = `
            <h2>Product Not Found</h2>
        `;

        return;

    }

    container.innerHTML = `

        <div class="details-card">

            <img src="${product.image}" alt="${product.name}">

            <div class="details-info">

                <h2>${product.name}</h2>

                <p>
                    <strong>Category:</strong>
                    ${product.category}
                </p>

                <h3 class="price">
                    Rs. ${product.price.toLocaleString()}
                </h3>

                <p class="rating">
                    ⭐ ${product.rating} / 5
                </p>

                <p class="description">

                    Premium quality product from
                    MZ Luxe.
                    Comfortable fabric with
                    elegant stitching.

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

    // ----------------------------
    // ADD TO CART
    // ----------------------------

    const detailsCartBtn =
        document.getElementById("detailsCartBtn");

    detailsCartBtn.addEventListener("click",function(){

        const existingProduct =
        cart.find(function(item){

            return item.id===product.id;

        });

        if(existingProduct){

            existingProduct.quantity++;

        }

        else{

            cart.push({

                ...product,

                quantity:1

            });

        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        updateCartCount();

        alert(product.name + " Added To Cart");

    });

    // ----------------------------
    // BUY NOW
    // ----------------------------

    const buyNowBtn =
        document.getElementById("buyNowBtn");

    buyNowBtn.addEventListener("click",function(){

        localStorage.setItem(

            "checkoutProduct",

            JSON.stringify(product)

        );

        window.location.href="checkout.html";

    });

}

loadProductDetails();


// ======================================
// CHECKOUT PAGE
// ======================================

function loadCheckout(){

    const container =
        document.getElementById("checkoutContainer");

    if(!container){

        return;

    }

    const product = JSON.parse(

        localStorage.getItem("checkoutProduct")

    );

    if(!product){

        container.innerHTML=`

            <h2>No Product Selected</h2>

        `;

        return;

    }

    container.innerHTML = `

        <div class="checkout-card">

            <img src="${product.image}" alt="${product.name}">

            <div class="checkout-info">

                <h2>${product.name}</h2>

                <p>

                    <strong>Category:</strong>

                    ${product.category}

                </p>

                <h3>

                    Rs. ${product.price.toLocaleString()}

                </h3>

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
                        required>
                    </textarea>

                    <button type="submit">

                        Place Order

                    </button>

                </form>

            </div>

        </div>

    `;

    const checkoutForm =
    document.getElementById("checkoutForm");

    checkoutForm.addEventListener("submit",function(event){

        event.preventDefault();

        alert("🎉 Order Placed Successfully!");

        localStorage.removeItem("checkoutProduct");

        window.location.href="../index.html";

    });

}

loadCheckout();

// ======================================
// PART 5
// FINAL INITIALIZATION
// ======================================

// Prevent accidental global errors
window.addEventListener("error", function(event){

    console.log("Error:", event.message);

});

// Refresh cart count on every page
updateCartCount();

// Auto initialize pages

document.addEventListener("DOMContentLoaded", function(){

    initPageProducts();

    // Products Page
    if(document.getElementById("productContainer")){

        applyFilters();

    }

    // Cart Page
    if(document.getElementById("cartItems")){

        loadCart();

    }

    // Product Details
    if(document.getElementById("productDetails")){

        loadProductDetails();

    }

    // Checkout
    if(document.getElementById("checkoutContainer")){

        loadCheckout();

    }

});

// ======================================
// END OF SCRIPT
// ======================================

console.log("✅ MZ Luxe Loaded Successfully");

// ================= SIGNUP =================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match!");
            return;

        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {

            alert("Email already exists!");
            return;

        }

        users.push({

            name: name,
            email: email,
            password: password

        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Account Created Successfully!");

        window.location.href = "login.html";

    });

}

// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(function(u){

            return u.email === email && u.password === password;

        });

        if (!user){

            alert("Invalid Email or Password!");
            return;

        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));

        alert("Login Successful!");

        window.location.href = "index.html";

    });

}

// ================= NAVBAR LOGIN =================

const loginLink = document.getElementById("loginLink");

if (loginLink) {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {

        loginLink.textContent = "My Account";
        loginLink.href = "account.html";

    }

}

// ================= MY ACCOUNT =================

// ================= MY ACCOUNT =================

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

if (userName && userEmail) {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {

        alert("Please login first!");

        window.location.href = "login.html";

    } else {

        userName.textContent = loggedInUser.name;
        userEmail.textContent = loggedInUser.email;

    }

}

// ================= ACCOUNT LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("loggedInUser");

        alert("Logged Out Successfully!");

        window.location.href = "login.html";

    });

}

// ================= ADMIN PANEL =================
let editIndex = -1;
const productForm = document.getElementById("productForm");

if (productForm) {

    displayAdminProducts();

    productForm.addEventListener("submit", function(e){

        e.preventDefault();

        const name = document.getElementById("productName").value.trim();
        const price = document.getElementById("productPrice").value;
        const image = document.getElementById("productImage").value.trim();
       
        let products = JSON.parse(localStorage.getItem("adminProducts")) || [];
       if (editIndex >= 0 && products[editIndex]) {

    // Update existing product
    products[editIndex] = {
        name,
        price,
        image
    };

    editIndex = -1;

}
else {

    // Add new product
    products.push({
        name,
        price,
        image
    });

}

        localStorage.setItem("adminProducts", JSON.stringify(products));

        productForm.reset();
        document.getElementById("productForm").querySelector("button[type='submit']").textContent = "Add Product";

        displayAdminProducts();

    });

}

function displayAdminProducts(){

    const adminProducts = document.getElementById("adminProducts");

    if(!adminProducts) return;

    let products = JSON.parse(localStorage.getItem("adminProducts")) || [];

    adminProducts.innerHTML = "";

    products.forEach(function(product, index){

       adminProducts.innerHTML += `

<div class="admin-product">

    <img src="${product.image}" alt="${product.name}">

    <h3>${product.name}</h3>

    <p>Rs ${product.price}</p>

    <button type="button" onclick="deleteProduct(${index})">
        Delete
    </button>
    <button type="button" onclick="editProduct(${index})">
    Edit
</button>

</div>

`;

    });

}

function deleteProduct(index){

    let products = JSON.parse(localStorage.getItem("adminProducts")) || [];

    products.splice(index,1);

    localStorage.setItem("adminProducts", JSON.stringify(products));

    displayAdminProducts();

}

function editProduct(index){

    let products = JSON.parse(localStorage.getItem("adminProducts")) || [];

    const product = products[index];

    if (!product) return;

    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const imageInput = document.getElementById("productImage");

    if (nameInput) nameInput.value = product.name;
    if (priceInput) priceInput.value = product.price;
    if (imageInput) imageInput.value = product.image;

    editIndex = index;

    const form = document.getElementById("productForm");
    const submitButton = form ? form.querySelector("button[type='submit']") : null;
    if (submitButton) {
        submitButton.textContent = "Update Product";
    }

    if (nameInput) nameInput.focus();
}

function deleteProduct(index){

    let products = JSON.parse(localStorage.getItem("adminProducts")) || [];

    products.splice(index, 1);

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(products)
    );

    displayAdminProducts();

}