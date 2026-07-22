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
  

async function fetchProducts(gender) {

    const response = await fetch(
        `http://127.0.0.1:8000/products/${gender}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return await response.json();
}
 async function initPageProducts() {

    if(!document.body || !document.body.dataset){
        return;
    }

    const currentPage = document.body.dataset.page;

  if(currentPage === "men"){

    pageProducts = await fetchProducts("Men");

}

else if(currentPage === "women"){

    pageProducts = await fetchProducts("Women");

}

applyFilters();

}

//initPageProducts();


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

    let product = null;

    try {
        product = JSON.parse(localStorage.getItem("checkoutProduct"));
    } catch (e) {
        product = null;
    }

    container.innerHTML = `

        <div class="checkout-card">

            ${product && product.image ? `<img src="${product.image}" alt="${product.name || 'Product'}">` : ''}

            <div class="checkout-info">

                <h2>${product ? product.name : 'Checkout'}</h2>

                <p>
                    <strong>Category:</strong>
                    ${product ? (product.category || 'General') : 'No product selected'}
                </p>

                <h3>
                   ${product && product.price ? `Rs. ${Number(product.price).toLocaleString()}` : 'Price not available'}
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

   if (checkoutForm) {

    checkoutForm.addEventListener("submit", async function(event){

        event.preventDefault();
         console.log("SUBMIT CLICKED");


        const inputs = checkoutForm.querySelectorAll("input, textarea");


       const orderData = {

    customer_name: inputs[0].value.trim(),

    email: inputs[1].value.trim(),

    phone: inputs[2].value.trim(),

    address: inputs[3].value.trim(),

    total: product && product.price ? Number(product.price) : 0

};

        try {


            const response = await fetch(
                "http://127.0.0.1:8000/products/orders",
                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(orderData)

                }
            );


            if(response.ok){


                const data = await response.json();


                console.log("Order Saved:", data);


                alert("🎉 Order Placed Successfully!");


                localStorage.removeItem("checkoutProduct");


                localStorage.removeItem("cart");


                window.location.href = "../index.html";


            }

            else {

                alert("Order Failed!");

            }


        } catch(error){

            console.error(error);

            alert("Server Error! Please try again.");

        }


    });

}

}

loadCheckout();

// ======================================
// ADMIN ORDERS
// ======================================

async function loadOrders(){

    const container = document.getElementById("ordersContainer");

    if(!container){
        return;
    }

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/products/orders"
        );

        const orders = await response.json();
        document.getElementById("totalOrders").textContent = orders.length;
   const productResponse = await fetch(
    "http://127.0.0.1:8000/products/"
);

const products = await productResponse.json();

document.getElementById("totalProducts").textContent = products.length;
        console.log("Orders:", orders);
        window.allOrders = orders;
        container.innerHTML = "";

orders.forEach(function(order){

    container.innerHTML += `

      

        <div class="order-card">

            <h2>Order #${order.id}</h2>

            <p>
                <strong>Name:</strong>
                ${order.customer_name}
            </p>

            <p>
                <strong>Email:</strong>
                ${order.email}
            </p>

            <p>
                <strong>Phone:</strong>
                ${order.phone}
            </p>

            <p>
                <strong>Address:</strong>
                ${order.address}
            </p>

            <h3>
                Total: Rs. ${Number(order.total).toLocaleString()}
            </h3>
        <p>
    <strong>Status:</strong>
    ${order.status}
</p>
<select onchange="updateOrderStatus(${order.id}, this.value)">
    <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>
        Pending
    </option>

    <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>
        Processing
    </option>

    <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>
        Shipped
    </option>

    <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>
        Delivered
    </option>
</select>

    <button
        onclick="deleteOrder(${order.id})"
        class="delete-order-btn">

        Delete Order

    </button>

        </div>

    `;

});

    }

    catch(error){

        console.error(error);

    }

}
async function deleteOrder(orderId){

    const confirmDelete = confirm(
        "Are you sure you want to delete this order?"
    );

    if(!confirmDelete){
        return;
    }

    try{

        const response = await fetch(

            `http://127.0.0.1:8000/products/orders/${orderId}`,

            {
                method: "DELETE"
            }

        );

        if(response.ok){

            alert("Order deleted successfully!");

            loadOrders();

        }
        else{

            alert("Failed to delete order.");

        }

    }
    catch(error){

        console.error(error);

    }

}
async function updateOrderStatus(orderId, status){

    try{

        const response = await fetch(
            `http://127.0.0.1:8000/products/orders/${orderId}`,
            {
                method: "PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );


        if(response.ok){

            alert("Order status updated!");

            loadOrders();

        }
        else{

            alert("Status update failed!");

        }

    }
    catch(error){

        console.error(error);

    }

}

function searchOrders(){

    const search = document
        .getElementById("searchOrder")
        .value
        .toLowerCase();

    const container = document.getElementById("ordersContainer");

    container.innerHTML = "";

    const filteredOrders = window.allOrders.filter(function(order){

       return order.customer_name
    .trim()
    .toLowerCase()
    .includes(search.trim().toLowerCase());

    });

    console.log(filteredOrders);

    filteredOrders.forEach(function(order){

        container.innerHTML += `

            <div class="order-card">

                <h2>Order #${order.id}</h2>

                <p>
                    <strong>Name:</strong>
                    ${order.customer_name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${order.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${order.phone}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${order.address}
                </p>

                <h3>
                    Total: Rs. ${Number(order.total).toLocaleString()}
                </h3>

                <button
                    onclick="deleteOrder(${order.id})"
                    class="delete-order-btn">

                    Delete Order

                </button>

            </div>

        `;

    });

}
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

    try {
        initPageProducts();

        if(document.getElementById("productContainer")){
            applyFilters();
        }

        if(document.getElementById("cartItems")){
            loadCart();
        }

        if(document.getElementById("productDetails")){
            loadProductDetails();
        }

        if(document.getElementById("checkoutContainer")){
            loadCheckout();
        }
        if(document.getElementById("ordersContainer")){
    loadOrders();
}
    } catch (error) {
        console.error("Initialization error:", error);
        const checkoutContainer = document.getElementById("checkoutContainer");
        if (checkoutContainer) {
            checkoutContainer.innerHTML = `
                <div class="checkout-card">
                    <div class="checkout-info">
                        <h2>Checkout</h2>
                        <p>Please refresh the page if the form does not appear.</p>
                    </div>
                </div>
            `;
        }
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
async function createProduct(productData){

    const response = await fetch(
        "http://127.0.0.1:8000/products/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create product");
    }

    return await response.json();
}

// ================= ADMIN PANEL =================
let editIndex = -1;
const productForm = document.getElementById("productForm");


 displayAdminProducts();
 

if (productForm) {

    productForm.addEventListener("submit", async function(e){

        e.preventDefault();

        const name = document.getElementById("productName").value.trim();
        const price = document.getElementById("productPrice").value;
        const rating = document.getElementById("productRating").value;
        const image = document.getElementById("productImage").value.trim();
        const category = document.getElementById("productCategory").value;
        const gender = document.getElementById("productGender").value;
const productData = {
        
            // tumhara existing code
        };

    });

}


async function getProducts() {

    const response = await fetch(
        "http://127.0.0.1:8000/products/"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return await response.json();

}
async function updateProduct(id, productData) {

    const response = await fetch(
        `http://127.0.0.1:8000/products/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update product");
    }

    return await response.json();

}
async function deleteProductAPI(id) {

    const response = await fetch(
        `http://127.0.0.1:8000/products/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }

    return await response.json();

}

 async function displayAdminProducts(){

    const adminProducts = document.getElementById("adminProducts");

    if(!adminProducts) return;

    const products = await getProducts();
    alert(products.length);

    adminProducts.innerHTML = "";

    products.forEach(function(product, index){

       adminProducts.innerHTML += `

<div class="admin-product">

    <img src="${product.image}" alt="${product.name}">

    <h3>${product.name}</h3>

    <p>Rs ${product.price}</p>

    <button type="button" onclick="deleteProduct(${product.id})">
    Delete
</button>

<button type="button" onclick="editProduct(${product.id})">
    Edit
</button>

</div>

`;

    });

}
async function deleteProduct(id){

    if(!confirm("Are you sure you want to delete this product?")){
        return;
    }

    try{

        await deleteProductAPI(id);

        alert("Product deleted successfully!");

        displayAdminProducts();

    }
    catch(error){

        console.error(error);
        alert("Delete failed");

    }

}

// ================= BEST SELLING PRODUCTS =================

async function loadBestSellingProducts() {

    const container = document.getElementById("bestSellingProducts");

    if (!container) return;

    try {

        const menResponse = await fetch("http://127.0.0.1:8000/products/Men");
        const womenResponse = await fetch("http://127.0.0.1:8000/products/Women");

        const menProducts = await menResponse.json();
        const womenProducts = await womenResponse.json();

        // Men + Women products ko combine karo
       const products = [];

const max = Math.max(menProducts.length, womenProducts.length);

for (let i = 0; i < max; i++) {

    if (menProducts[i]) {
        products.push(menProducts[i]);
    }

    if (womenProducts[i]) {
        products.push(womenProducts[i]);
    }

}

        container.innerHTML = "";

        products.slice(0, 5).forEach(product => {

            container.innerHTML += `
                <div class="product-card">

                    <img src="${product.image}" alt="${product.name}">

                    <h3>${product.name}</h3>

                    <p class="price">Rs. ${product.price}</p>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = "<p>Failed to load products.</p>";

    }

}

loadBestSellingProducts();

// ================= FEATURED CATEGORY IMAGES =================

async function loadFeaturedCategoryImages() {

    try {

        const menResponse = await fetch("http://127.0.0.1:8000/products/Men");
        const womenResponse = await fetch("http://127.0.0.1:8000/products/Women");

        const menProducts = await menResponse.json();
        const womenProducts = await womenResponse.json();

        const menImage = document.getElementById("featuredMenImage");
        const womenImage = document.getElementById("featuredWomenImage");

        if (menImage && menProducts.length > 0) {
            menImage.src = menProducts[0].image;
        }

        if (womenImage && womenProducts.length > 0) {
            womenImage.src = womenProducts[0].image;
        }

    } catch (error) {

        console.error("Featured Images Error:", error);

    }

}

loadFeaturedCategoryImages();