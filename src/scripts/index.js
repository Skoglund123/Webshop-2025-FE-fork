import { fetchProducts, searchProducts, fetchCategories } from "../utils/api.js";

let allProducts = [];              // Alla hämtade produkter
let allCategories = [];            // Unika kategorier
let currentProductsDisplayed = []; // Produkter som för närvarande visas

document.addEventListener("DOMContentLoaded", async () => {
  // Ladda produkter och kategorier
  await loadProducts();
  await loadCategories();

  // Update the cart display when the page loads
  updateCartDisplay();

  // Eventlyssnare för dropdownen
  document.getElementById("sort-select").addEventListener("change", () => {
    displayProducts(currentProductsDisplayed);
  });

  
// Hämta och visa produkter
async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Laddar produkter...</p>";

  try {
    const products = await fetchProducts();
    allProducts = products;
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Härled och visa kategorier i sidomenyn
async function loadCategories() {
  const sidebarNav = document.querySelector("aside nav");
  sidebarNav.innerHTML = "<p>Laddar kategorier...</p>";

  try {
    // Hämta unika kategorier
    const categories = await fetchCategories()
    allCategories = categories;
    sidebarNav.innerHTML = "";

    // "Alla produkter"-knapp
    const allButton = document.createElement("button");
    allButton.className = "category-button";
    allButton.textContent = "Alla produkter";
    allButton.addEventListener("click", () => {
      displayProducts(allProducts);
    });
    sidebarNav.appendChild(allButton);

    if (categories.length === 0) {
      sidebarNav.innerHTML += "<p>Inga kategorier tillgängliga.</p>";
      return;
    }

    // Skapa en knapp per kategori
    categories.forEach(category => {
      const button = document.createElement("button");
      button.className = "category-button";
      button.textContent = category.name;
      button.addEventListener("click", () => {
        filterProductsByCategory(category._id);
      });
      sidebarNav.appendChild(button);
    });
  } catch (error) {
    console.error("Fel vid härledning av kategorier:", error);
    sidebarNav.innerHTML = "<p>Misslyckades med att ladda kategorier.</p>";
  }
}

// Filtrera produkter baserat på vald kategori
function filterProductsByCategory(categoryId) {
  const filtered = allProducts.filter(product => product.category === categoryId);
  displayProducts(filtered);
}

// Sorteringsfunktion med stöd för stigande och fallande ordning
function sortProducts(products) {
  const sortSelect = document.getElementById("sort-select");
  const sortOption = sortSelect ? sortSelect.value : "";
  let sortedProducts = [...products];

  switch (sortOption) {
    case "price-asc":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // Om inget alternativ är valt behåll ursprunglig ordning
      break;
  }
  return sortedProducts;
}

// Visa produkter med sortering
function displayProducts(products) {
  currentProductsDisplayed = products; // Spara aktuellt filtrerade produkter
  const sortedProducts = sortProducts(products);
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  if (sortedProducts.length === 0) {
    productsContainer.innerHTML = "<p>Inga produkter tillgängliga.</p>";
    return;
  }

  sortedProducts.forEach((product) => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

// Function to add product to the cart (Reusable)
function addToCart(product) {
  // Get the current cart from localStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the product is already in the cart
  const productInCart = cart.find(item => item.id === product._id);

  if (productInCart) {
    // If the product is already in the cart, increase the quantity
    productInCart.quantity += 1;
  } else {
    // If the product is not in the cart, add it with quantity 1
    cart.push({
      id: product._id, // Use the _id from the API as the unique identifier
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  // Save the updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart display in the header
  updateCartDisplay();
}

// Popup Produktkort
async function showProductDetailsPopup(product) {
  const popup = document.createElement("div");

  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  try {
    const categories = await fetchCategories();

    const category = categories.find(c => c._name === product.category);

    if (!category) {
      console.log("Category not found for the product.");
    }

    const categoryName = category ? category.name : "Unknown Category";
    const categoryId = category ? category._id : "N/A";

    // Popup innehåll
    const popupContent = document.createElement("div");
    popupContent.className = "product-popup";
    popupContent.innerHTML = `
      <span class="close-btn">&times;</span>
      <img src="${product.img}" alt="${product.name}" class="product-image" style="height: 160px;width: 160px;">
      <h3>${product.name}</h3>
      <p>Varumärke: ${product.brand}</p>
      <p>Kategori: ${categoryName} (ID: ${categoryId})</p>
      <p>Produkt ID: ${product._id}</p>
      <p>Produktbeskrivning: ${product.description}.</p>
      <p><strong>${product.price.toFixed(2)} kr</strong></p>
      <button class="add-to-cart-btn">Köp</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popupContent);

    // Köp knapp
    const addToCartButton = popupContent.querySelector(".add-to-cart-btn");
    addToCartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(product);
    });

    // Stäng knapp
    popupContent.querySelector(".close-btn").addEventListener("click", () => {
      overlay.remove();
      popupContent.remove();
    });

    // Stäng med overlay
    overlay.addEventListener("click", () => {
      overlay.remove();
      popupContent.remove();
    });

  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Skapa ett produktkort
function createProductCard(product) {
  const element = document.createElement("div");
  element.className = "product-card";
  element.innerHTML = `
    <img src="${product.img}" alt="${product.name}" class="product-image" style="height: 160px;width: 160px;">
    <div class="card-info">
      <h3 style="color:red;font-size: 30px;">${product.price.toFixed(2)} kr</h3>
      <p>${product.name}</p>
      <p style="font-size: 14px;">${product.brand}</p>
      <button class="add-to-cart-btn">Köp</button>
    </div>
  `;

  // Handle the "Add to Cart" button click in the product card
  const addToCartButton = element.querySelector(".add-to-cart-btn");
  addToCartButton.addEventListener("click", (event) => {
    // Prevent the click from triggering the popup by stopping the event propagation
    event.stopPropagation(); 

    // Add the product to the cart
    addToCart(product);

    // Optionally update the cart display
    updateCartDisplay();
  });

  // Eventlistener for showing the popup (only for clicks on the product card itself, not the button)
  element.addEventListener("click", (event) => {
    // Only show the popup if the click wasn't on the "Add to Cart" button
    if (!event.target.closest(".add-to-cart-btn")) {
      showProductDetailsPopup(product); // Pass the product to the popup function
    }
  });

  return element;
}


const searchInput = document.getElementById("search-input");
if (searchInput) {

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
  
    if (!query) {
      displayProducts(allProducts); 
      return;
    }
  
    const results = allProducts.filter(product =>
      product.name && product.name.toLowerCase().includes(query) ||
      product.brand && product.brand.toLowerCase().includes(query) ||
      product.category && product.category.toLowerCase().includes(query)
     
    );
  
    displayProducts(results);
  };
  

  searchInput.addEventListener("input", handleSearch);
}
});
// Update Cart Display
function updateCartDisplay() {
  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Calculate the number of items and total price
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

  // Update the cart counter in the header
  document.getElementById("cart-item-count").textContent = itemCount;
  document.getElementById("cart-total-price").textContent = totalPrice;
}
