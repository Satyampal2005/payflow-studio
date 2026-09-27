/* =====================================================
   PAYFLOW STUDIO
   Frontend Checkout + Merchant Dashboard Simulation
   ===================================================== */


/* ================= PRODUCTS ================= */

const products = [

    {
        id: 1,
        name: "Wireless Earbuds",
        category: "Audio",
        price: 799,
        icon: "🎧"
    },

    {
        id: 2,
        name: "Smart Watch",
        category: "Wearable",
        price: 1299,
        icon: "⌚"
    },

    {
        id: 3,
        name: "Laptop Backpack",
        category: "Accessories",
        price: 899,
        icon: "🎒"
    },

    {
        id: 4,
        name: "Mechanical Keyboard",
        category: "Electronics",
        price: 1499,
        icon: "⌨️"
    },

    {
        id: 5,
        name: "Gaming Mouse",
        category: "Electronics",
        price: 599,
        icon: "🖱️"
    },

    {
        id: 6,
        name: "Bluetooth Speaker",
        category: "Audio",
        price: 999,
        icon: "🔊"
    },

    {
        id: 7,
        name: "USB-C Cable",
        category: "Accessories",
        price: 249,
        icon: "🔌"
    },

    {
        id: 8,
        name: "Phone Stand",
        category: "Accessories",
        price: 299,
        icon: "📱"
    },

    {
        id: 9,
        name: "Wireless Charger",
        category: "Electronics",
        price: 699,
        icon: "⚡"
    },

    {
        id: 10,
        name: "Webcam",
        category: "Electronics",
        price: 1099,
        icon: "📷"
    },

    {
        id: 11,
        name: "Desk Lamp",
        category: "Home",
        price: 649,
        icon: "💡"
    },

    {
        id: 12,
        name: "Power Bank",
        category: "Electronics",
        price: 899,
        icon: "🔋"
    },

    {
        id: 13,
        name: "Laptop Sleeve",
        category: "Accessories",
        price: 549,
        icon: "💻"
    },

    {
        id: 14,
        name: "Mini Tripod",
        category: "Camera",
        price: 449,
        icon: "📸"
    },

    {
        id: 15,
        name: "Gaming Mouse Pad",
        category: "Gaming",
        price: 399,
        icon: "🎮"
    },

    {
        id: 16,
        name: "Bluetooth Keyboard",
        category: "Electronics",
        price: 899,
        icon: "⌨️"
    }

];


/* ================= STORAGE KEYS ================= */

const CART_KEY = "payflow_cart";

const ORDERS_KEY = "payflow_orders";

const THEME_KEY = "payflow_theme";


/* ================= STATE ================= */

let cart = [];

let orders = [];

let currentSearch = "";

let currentCategory = "all";

let notificationTimer;


/* ================= DOM ================= */

const productGrid =
    document.getElementById("productGrid");

const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const cartProducts =
    document.getElementById("cartProducts");

const summaryItems =
    document.getElementById("summaryItems");

const summarySubtotal =
    document.getElementById("summarySubtotal");

const deliveryCharge =
    document.getElementById("deliveryCharge");

const summaryTotal =
    document.getElementById("summaryTotal");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const customerName =
    document.getElementById("customerName");

const customerEmail =
    document.getElementById("customerEmail");

const customerPhone =
    document.getElementById("customerPhone");

const customerAddress =
    document.getElementById("customerAddress");

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

const ordersContainer =
    document.getElementById("ordersContainer");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const orderCount =
    document.getElementById("orderCount");

const orderModal =
    document.getElementById("orderModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const modalContent =
    document.getElementById("modalContent");

const notification =
    document.getElementById("notification");

const notificationIcon =
    document.getElementById("notificationIcon");

const notificationTitle =
    document.getElementById("notificationTitle");

const notificationMessage =
    document.getElementById("notificationMessage");

const themeBtn =
    document.getElementById("themeBtn");


/* ================= HELPERS ================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ================= LOCAL STORAGE ================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(CART_KEY);

        cart = saved
            ? JSON.parse(saved)
            : [];

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {

        console.error("Cart loading error:", error);

        cart = [];

    }

}


function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


function loadOrders() {

    try {

        const saved =
            localStorage.getItem(ORDERS_KEY);

        orders = saved
            ? JSON.parse(saved)
            : [];

        if (!Array.isArray(orders)) {
            orders = [];
        }

    } catch (error) {

        console.error("Order loading error:", error);

        orders = [];

    }

}


function saveOrders() {

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );

}


/* ================= CATEGORIES ================= */

function loadCategories() {

    const categories =
        [...new Set(
            products.map(product => product.category)
        )].sort();

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


/* ================= PRODUCTS ================= */

function displayProducts(list = products) {

    if (!list.length) {

        productGrid.innerHTML = `
            <div class="empty-cart">
                <div>🔎</div>
                <h3>No products found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }


    productGrid.innerHTML =
        list.map(product => `

            <div class="product-card">

                <div class="product-icon">
                    ${product.icon}
                </div>

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatCurrency(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `).join("");

}


function filterProducts() {

    const search =
        currentSearch.toLowerCase().trim();

    const filtered =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                currentCategory === "all" ||
                product.category === currentCategory;

            return matchesSearch && matchesCategory;

        });


    displayProducts(filtered);

}


/* ================= SEARCH ================= */

productSearch.addEventListener(
    "input",
    function () {

        currentSearch = this.value;

        filterProducts();

    }
);


categoryFilter.addEventListener(
    "change",
    function () {

        currentCategory = this.value;

        filterProducts();

    }
);


/* ================= CART ================= */

function addToCart(productId) {

    const existing =
        cart.find(item => item.id === productId);


    if (existing) {

        existing.quantity++;

    } else {

        const product =
            products.find(item => item.id === productId);

        if (!product) return;

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    updateCart();

    showNotification(
        "success",
        "Added to cart",
        "Product added successfully."
    );

}


function increaseQuantity(productId) {

    const item =
        cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity++;

    saveCart();

    updateCart();

}


function decreaseQuantity(productId) {

    const item =
        cart.find(product => product.id === productId);

    if (!item) return;


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart =
            cart.filter(product => product.id !== productId);

    }


    saveCart();

    updateCart();

}


function removeFromCart(productId) {

    cart =
        cart.filter(product => product.id !== productId);

    saveCart();

    updateCart();

    showNotification(
        "success",
        "Removed",
        "Product removed from cart."
    );

}


/* ================= TOTALS ================= */

function calculateTotals() {

    const itemCount =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    const delivery =
        subtotal === 0
            ? 0
            : subtotal < 3000
                ? 99
                : 0;


    const total =
        subtotal + delivery;


    return {
        itemCount,
        subtotal,
        delivery,
        total
    };

}


/* ================= UPDATE CART ================= */

function updateCart() {

    if (!cart.length) {

        cartProducts.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                    Add products to continue.
                </p>

            </div>

        `;

    } else {

        cartProducts.innerHTML =
            cart.map(item => `

                <div class="cart-item">

                    <div class="cart-item-icon">
                        ${item.icon}
                    </div>

                    <div class="cart-item-info">

                        <h4>
                            ${escapeHTML(item.name)}
                        </h4>

                        <p>
                            ${formatCurrency(item.price)}
                            each
                        </p>

                    </div>


                    <div class="quantity-controls">

                        <button
                            onclick="decreaseQuantity(${item.id})"
                        >
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="increaseQuantity(${item.id})"
                        >
                            +
                        </button>

                    </div>


                    <strong>
                        ${formatCurrency(
                            item.price * item.quantity
                        )}
                    </strong>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${item.id})"
                    >
                        Remove
                    </button>

                </div>

            `).join("");

    }


    updateSummary();

    updateCheckoutSummary();

    filterProducts();

}


/* ================= SUMMARY ================= */

function updateSummary() {

    const totals =
        calculateTotals();


    summaryItems.textContent =
        totals.itemCount;


    summarySubtotal.textContent =
        formatCurrency(totals.subtotal);


    deliveryCharge.textContent =
        formatCurrency(totals.delivery);


    summaryTotal.textContent =
        formatCurrency(totals.total);


    checkoutBtn.disabled =
        cart.length === 0;

}


/* ================= CHECKOUT SUMMARY ================= */

function updateCheckoutSummary() {

    if (!cart.length) {

        checkoutItems.innerHTML =
            `<p>Your cart is empty.</p>`;

        checkoutTotal.textContent =
            "₹0";

        return;

    }


    checkoutItems.innerHTML =
        cart.map(item => `

            <div class="checkout-item">

                <span>
                    ${escapeHTML(item.name)}
                    × ${item.quantity}
                </span>

                <strong>
                    ${formatCurrency(
                        item.price * item.quantity
                    )}
                </strong>

            </div>

        `).join("");


    const totals =
        calculateTotals();


    checkoutItems.innerHTML += `

        <div class="checkout-item">

            <span>Delivery</span>

            <strong>
                ${formatCurrency(totals.delivery)}
            </strong>

        </div>

    `;


    checkoutTotal.textContent =
        formatCurrency(totals.total);

}


/* ================= CHECKOUT BUTTON ================= */

checkoutBtn.addEventListener(
    "click",
    function () {

        if (!cart.length) {

            showNotification(
                "error",
                "Cart is empty",
                "Please add a product first."
            );

            return;

        }


        document
            .getElementById("checkout")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* ================= VALIDATION ================= */

function clearErrors() {

    document.getElementById("nameError").textContent = "";

    document.getElementById("emailError").textContent = "";

    document.getElementById("phoneError").textContent = "";

    document.getElementById("addressError").textContent = "";

    document.getElementById("paymentError").textContent = "";

}


function validateCheckout() {

    clearErrors();

    let valid = true;


    const name =
        customerName.value.trim();

    const email =
        customerEmail.value.trim();

    const phone =
        customerPhone.value.trim();

    const address =
        customerAddress.value.trim();


    if (name.length < 3) {

        document.getElementById("nameError").textContent =
            "Please enter a valid name.";

        valid = false;

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        document.getElementById("emailError").textContent =
            "Please enter a valid email.";

        valid = false;

    }


    if (!/^\d{10}$/.test(phone)) {

        document.getElementById("phoneError").textContent =
            "Phone number must contain 10 digits.";

        valid = false;

    }


    if (address.length < 10) {

        document.getElementById("addressError").textContent =
            "Please enter a complete address.";

        valid = false;

    }


    const selectedPayment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    if (!selectedPayment) {

        document.getElementById("paymentError").textContent =
            "Please select a payment method.";

        valid = false;

    }


    return valid;

}


/* ================= PHONE INPUT ================= */

customerPhone.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .replace(/\D/g, "")
                .slice(0, 10);

    }
);


/* ================= ORDER ID ================= */

function generateOrderId() {

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return `PF-${random}`;

}


/* ================= PLACE ORDER ================= */

placeOrderBtn.addEventListener(
    "click",
    function () {

        if (!cart.length) {

            showNotification(
                "error",
                "Cart is empty",
                "Add a product before checkout."
            );

            return;

        }


        if (!validateCheckout()) {

            showNotification(
                "error",
                "Check your details",
                "Please fix the highlighted fields."
            );

            return;

        }


        /* PROCESSING STATE */

        placeOrderBtn.disabled = true;

        placeOrderBtn.textContent =
            "Processing Payment...";


        const selectedPayment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        const totals =
            calculateTotals();


        /*
            Frontend simulation only.
            This does NOT process real money.
        */

        setTimeout(function () {

            const isSuccessful =
                Math.random() > 0.20;


            const status =
                isSuccessful
                    ? "Successful"
                    : "Failed";


            const order = {

                orderId:
                    generateOrderId(),

                customer: {

                    name:
                        customerName.value.trim(),

                    email:
                        customerEmail.value.trim(),

                    phone:
                        customerPhone.value.trim(),

                    address:
                        customerAddress.value.trim()

                },

                products:
                    cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),

                subtotal:
                    totals.subtotal,

                delivery:
                    totals.delivery,

                total:
                    totals.total,

                paymentMethod:
                    selectedPayment.value,

                status,

                date:
                    new Date().toLocaleString(
                        "en-IN",
                        {
                            dateStyle: "medium",
                            timeStyle: "short"
                        }
                    )

            };


            orders.unshift(order);

            saveOrders();


            if (isSuccessful) {

                showNotification(
                    "success",
                    "Payment Successful",
                    `Order ${order.orderId} was created.`
                );

            } else {

                showNotification(
                    "error",
                    "Payment Failed",
                    `Order ${order.orderId} was marked failed.`
                );

            }


            renderOrders();

            updateDashboard();


            /*
                Clear cart after simulation.
            */

            cart = [];

            saveCart();

            updateCart();


            customerName.value = "";

            customerEmail.value = "";

            customerPhone.value = "";

            customerAddress.value = "";


            document
                .querySelectorAll(
                    'input[name="paymentMethod"]'
                )
                .forEach(input => {
                    input.checked = false;
                });


            placeOrderBtn.disabled = false;

            placeOrderBtn.textContent =
                "Place Order";


        }, 1800);

    }
);


/* ================= ORDER HISTORY ================= */

function renderOrders() {

    orderCount.textContent =
        `${orders.length} ${
            orders.length === 1
                ? "Order"
                : "Orders"
        }`;


    if (!orders.length) {

        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <div class="empty-orders-icon">
                    📦
                </div>

                <h3>No orders yet</h3>

                <p>
                    Your completed orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    ordersContainer.innerHTML =
        orders.map((order, index) => {

            const productNames =
                order.products
                    .map(product =>
                        `${escapeHTML(product.name)} × ${product.quantity}`
                    )
                    .join(", ");


            const statusClass =
                order.status === "Successful"
                    ? "status-success"
                    : "status-failed";


            return `

                <div class="order-card">

                    <div class="order-card-top">

                        <div>

                            <div class="order-id">
                                ${escapeHTML(order.orderId)}
                            </div>

                            <div class="order-date">
                                ${escapeHTML(order.date)}
                            </div>

                        </div>


                        <span class="order-status ${statusClass}">
                            ${escapeHTML(order.status)}
                        </span>

                    </div>


                    <div class="order-card-middle">

                        <div>

                            <div class="order-products">
                                ${productNames}
                            </div>

                            <div class="order-date">
                                Payment:
                                ${escapeHTML(order.paymentMethod)}
                            </div>

                        </div>


                        <div class="order-total">

                            ${formatCurrency(order.total)}

                        </div>

                    </div>


                    <button
                        class="view-order-btn"
                        onclick="viewOrder(${index})"
                    >
                        View Details
                    </button>

                </div>

            `;

        }).join("");

}


/* ================= ORDER DETAILS ================= */

function viewOrder(index) {

    const order =
        orders[index];

    if (!order) return;


    const statusClass =
        order.status === "Successful"
            ? "status-success"
            : "status-failed";


    modalContent.innerHTML = `

        <h2 class="modal-title">
            Order ${escapeHTML(order.orderId)}
        </h2>


        <div class="modal-info">

            <div>

                <span>Status</span>

                <strong class="order-status ${statusClass}">
                    ${escapeHTML(order.status)}
                </strong>

            </div>


            <div>

                <span>Date</span>

                <strong>
                    ${escapeHTML(order.date)}
                </strong>

            </div>


            <div>

                <span>Customer</span>

                <strong>
                    ${escapeHTML(order.customer.name)}
                </strong>

            </div>


            <div>

                <span>Payment</span>

                <strong>
                    ${escapeHTML(order.paymentMethod)}
                </strong>

            </div>


            <div>

                <span>Email</span>

                <strong>
                    ${escapeHTML(order.customer.email)}
                </strong>

            </div>


            <div>

                <span>Phone</span>

                <strong>
                    ${escapeHTML(order.customer.phone)}
                </strong>

            </div>

        </div>


        <h3>Products</h3>


        <div class="modal-products">

            ${order.products.map(product => `

                <div class="modal-product">

                    <span>
                        ${escapeHTML(product.name)}
                        × ${product.quantity}
                    </span>

                    <strong>
                        ${formatCurrency(
                            product.price * product.quantity
                        )}
                    </strong>

                </div>

            `).join("")}

        </div>


        <div class="modal-product">

            <span>Subtotal</span>

            <strong>
                ${formatCurrency(order.subtotal)}
            </strong>

        </div>


        <div class="modal-product">

            <span>Delivery</span>

            <strong>
                ${formatCurrency(order.delivery)}
            </strong>

        </div>


        <div class="modal-product">

            <strong>Total</strong>

            <strong>
                ${formatCurrency(order.total)}
            </strong>

        </div>

    `;


    orderModal.classList.add("show");

}


/* ================= CLOSE MODAL ================= */

closeModalBtn.addEventListener(
    "click",
    function () {

        orderModal.classList.remove("show");

    }
);


orderModal.addEventListener(
    "click",
    function (event) {

        if (event.target === orderModal) {

            orderModal.classList.remove("show");

        }

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            orderModal.classList.remove("show");

        }

    }
);


/* ================= CLEAR ORDERS ================= */

clearHistoryBtn.addEventListener(
    "click",
    function () {

        if (!orders.length) {

            showNotification(
                "error",
                "No orders",
                "There is no order history to clear."
            );

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to clear order history?"
            );


        if (!confirmed) return;


        orders = [];

        saveOrders();

        renderOrders();

        updateDashboard();


        showNotification(
            "success",
            "History cleared",
            "All saved orders were removed."
        );

    }
);


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const total =
        orders.length;


    const successful =
        orders.filter(
            order =>
                order.status === "Successful"
        ).length;


    const failed =
        orders.filter(
            order =>
                order.status === "Failed"
        ).length;


    const revenue =
        orders
            .filter(
                order =>
                    order.status === "Successful"
            )
            .reduce(
                (sum, order) =>
                    sum + order.total,
                0
            );


    const successRate =
        total === 0
            ? 0
            : Math.round(
                (successful / total) * 100
            );


    document.getElementById(
        "totalOrders"
    ).textContent = total;


    document.getElementById(
        "successfulOrders"
    ).textContent = successful;


    document.getElementById(
        "failedOrders"
    ).textContent = failed;


    document.getElementById(
        "totalRevenue"
    ).textContent =
        formatCurrency(revenue);


    document.getElementById(
        "analyticsRate"
    ).textContent =
        `${successRate}%`;


    document.getElementById(
        "analyticsProgress"
    ).style.width =
        `${successRate}%`;


    document.getElementById(
        "analyticsSuccessful"
    ).textContent =
        successful;


    document.getElementById(
        "analyticsTotal"
    ).textContent =
        total;


    /* HERO */

    document.getElementById(
        "heroRevenue"
    ).textContent =
        formatCurrency(revenue);


    document.getElementById(
        "heroSuccessRate"
    ).textContent =
        `${successRate}%`;


    document.getElementById(
        "heroOrders"
    ).textContent =
        total;


    /* AVERAGE ORDER VALUE */

    const successfulOrders =
        orders.filter(
            order =>
                order.status === "Successful"
        );


    const average =
        successfulOrders.length === 0
            ? 0
            : revenue /
                successfulOrders.length;


    document.getElementById(
        "averageOrderValue"
    ).textContent =
        formatCurrency(average);


    /* MOST USED PAYMENT */

    const paymentCounts = {};


    orders.forEach(order => {

        const method =
            order.paymentMethod;

        paymentCounts[method] =
            (paymentCounts[method] || 0) + 1;

    });


    let mostUsed = "-";

    let highestCount = 0;


    Object.entries(paymentCounts)
        .forEach(([method, count]) => {

            if (count > highestCount) {

                highestCount = count;

                mostUsed = method;

            }

        });


    document.getElementById(
        "mostUsedPayment"
    ).textContent =
        mostUsed;


    /* LAST ORDER */

    document.getElementById(
        "lastOrderTime"
    ).textContent =
        orders.length
            ? orders[0].date
            : "-";

}


/* ================= NOTIFICATIONS ================= */

function showNotification(
    type,
    title,
    message
) {

    clearTimeout(notificationTimer);


    notificationTitle.textContent =
        title;


    notificationMessage.textContent =
        message;


    if (type === "error") {

        notificationIcon.textContent =
            "×";

        notificationIcon.style.background =
            "#fdeaea";

        notificationIcon.style.color =
            "#c52f2f";

    } else {

        notificationIcon.textContent =
            "✓";

        notificationIcon.style.background =
            "#e8f7ee";

        notificationIcon.style.color =
            "#238855";

    }


    notification.classList.add("show");


    notificationTimer =
        setTimeout(
            function () {

                notification.classList.remove("show");

            },
            3500
        );

}


/* ================= THEME ================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(THEME_KEY);


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";

    }

}


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            THEME_KEY,
            dark ? "dark" : "light"
        );


        themeBtn.textContent =
            dark ? "☀️" : "🌙";

    }
);


/* ================= HERO BUTTONS ================= */

document
    .getElementById("heroProductsBtn")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("products")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


document
    .getElementById("heroDashboardBtn")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("dashboard")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* ================= REAL-TIME VALIDATION ================= */

customerName.addEventListener(
    "input",
    function () {

        const error =
            document.getElementById("nameError");

        if (this.value.trim().length >= 3) {

            error.textContent = "";

            this.classList.remove("input-error");

            this.classList.add("input-success");

        } else {

            this.classList.remove("input-success");

        }

    }
);


customerEmail.addEventListener(
    "input",
    function () {

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (pattern.test(this.value.trim())) {

            this.classList.remove("input-error");

            this.classList.add("input-success");

        } else {

            this.classList.remove("input-success");

        }

    }
);


customerPhone.addEventListener(
    "input",
    function () {

        if (/^\d{10}$/.test(this.value)) {

            this.classList.remove("input-error");

            this.classList.add("input-success");

        } else {

            this.classList.remove("input-success");

        }

    }
);


customerAddress.addEventListener(
    "input",
    function () {

        if (this.value.trim().length >= 10) {

            this.classList.remove("input-error");

            this.classList.add("input-success");

        } else {

            this.classList.remove("input-success");

        }

    }
);


/* ================= INITIALIZATION ================= */

function init() {

    loadCart();

    loadOrders();

    loadCategories();

    loadTheme();

    displayProducts();

    updateCart();

    renderOrders();

    updateDashboard();

}


init();