// ==============================
// Fake Store API
// ==============================

const API_URL = "https://fakestoreapi.com/products";

// ==============================
// DOM Elements
// ==============================

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cart = document.getElementById("cart");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// ==============================
// Variables
// ==============================

let products = [];
let filteredProducts = [];
let cartData = [];

// ==============================
// Fetch Products
// ==============================

async function fetchProducts() {
  productsContainer.innerHTML = `
        <h2 style="text-align:center;">Loading products...</h2>
    `;

  try {
    const response = await fetch(API_URL);

    products = await response.json();

    filteredProducts = products;

    displayProducts(filteredProducts);

    loadCategories();
  } catch (error) {
    productsContainer.innerHTML = `
            <h2 style="text-align:center;color:red;">
                Failed to load products.
            </h2>
        `;

    console.error(error);
  }
}

// ==============================
// Display Products
// ==============================

function displayProducts(productList) {
  productsContainer.innerHTML = "";

  if (productList.length === 0) {
    productsContainer.innerHTML = `
            <div class="no-products">
                <h2>No products found.</h2>
                <p>Try another search or category.</p>
            </div>
        `;

    return;
  }

  productList.forEach((product) => {
    productsContainer.innerHTML += `

            <div class="product-card">

                <img src="${product.image}" alt="${product.title}">

                <h3>${product.title}</h3>

                <p class="price">$${product.price}</p>

                <p class="category">${product.category}</p>

                <button onclick="addToCart(${product.id})">
                    Add To Cart
                </button>

            </div>

        `;
  });
}

// ==============================
// Load Categories
// ==============================

function loadCategories() {
  const categories = [...new Set(products.map((product) => product.category))];

  categories.forEach((category) => {
    categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
  });
}

// ==============================
// Start App
// ==============================

fetchProducts();
// ==============================
// Search Products
// ==============================

searchInput.addEventListener("input", filterProducts);

// ==============================
// Filter by Category
// ==============================

categoryFilter.addEventListener("change", filterProducts);

// ==============================
// Combined Filter
// ==============================

function filterProducts() {
  const searchText = searchInput.value.toLowerCase();

  const selectedCategory = categoryFilter.value;

  filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}
// ==============================
// Add to Cart
// ==============================

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  const existingItem = cartData.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartData.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
}

// ==============================
// Update Cart
// ==============================

function updateCart() {
  cartItems.innerHTML = "";

  if (cartData.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;

    cartTotal.textContent = "0.00";

    cartCount.textContent = "0";

    return;
  }

  let total = 0;
  let totalItems = 0;

  cartData.forEach((item) => {
    total += item.price * item.quantity;

    totalItems += item.quantity;

    cartItems.innerHTML += `

            <div class="cart-item">

                <img src="${item.image}" alt="${item.title}">

                <div class="cart-item-info">

                    <h4>${item.title}</h4>

                    <p>$${item.price}</p>

                    <p>Quantity: ${item.quantity}</p>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})">

                    Remove

                </button>

            </div>

        `;
  });

  cartTotal.textContent = total.toFixed(2);

  cartCount.textContent = totalItems;
}

// ==============================
// Remove Item
// ==============================

function removeFromCart(productId) {
  cartData = cartData.filter((item) => item.id !== productId);

  updateCart();
}
// ==============================
// Open Cart
// ==============================

cartBtn.addEventListener("click", () => {
  cart.classList.add("active");
});

// ==============================
// Close Cart
// ==============================

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});
