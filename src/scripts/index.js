import { fetchProducts, searchProducts } from "../utils/api.js";

let allProducts = [];              // Alla hämtade produkter
let allCategories = [];            // Unika kategorier
let currentProductsDisplayed = []; // Produkter som för närvarande visas

document.addEventListener("DOMContentLoaded", async () => {
  // Ladda produkter och kategorier
  await loadProducts();
  loadCategoriesFromProducts();

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
function loadCategoriesFromProducts() {
  const sidebarNav = document.querySelector("aside nav");
  sidebarNav.innerHTML = "<p>Laddar kategorier...</p>";

  try {
    // Hämta unika kategorier
    const categorySet = new Set();
    allProducts.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    const categories = Array.from(categorySet);
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
    categories.forEach(categoryName => {
      const button = document.createElement("button");
      button.className = "category-button";
      button.textContent = categoryName;
      button.addEventListener("click", () => {
        filterProductsByCategory(categoryName);
      });
      sidebarNav.appendChild(button);
    });
  } catch (error) {
    console.error("Fel vid härledning av kategorier:", error);
    sidebarNav.innerHTML = "<p>Misslyckades med att ladda kategorier.</p>";
  }
}

// Filtrera produkter baserat på vald kategori
function filterProductsByCategory(categoryName) {
  const filtered = allProducts.filter(product => product.category === categoryName);
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
  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    alert(`Adding ${product.name} to cart\nFunctionality not implemented yet`);
  });
  return element;
}

const searchInput = document.getElementById("search-input");
if (searchInput) {
  const debounce = (func, delay = 100) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
  
    if (!query) {
      displayProducts(allProducts); 
      return;
    }
  
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
  
    displayProducts(results);
  };
  

  searchInput.addEventListener("input", debounce(handleSearch, 100));
}
});
