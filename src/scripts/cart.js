document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    updateCartHeader();
  });
  
  // Show cart items
  function displayCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Din varukorg är tom.</p>";
      return;
    }
  
    cartItemsContainer.innerHTML = "";
  
    cart.forEach(item => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
  
      itemElement.innerHTML = `
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>${item.price.toFixed(2)} kr</p>
          <p>Antal: <span class="item-quantity">${item.quantity}</span></p>
        </div>
        <div class="item-actions">
          <button class="decrease-item-btn" data-id="${item.id}">-</button>
          <button class="increase-item-btn" data-id="${item.id}">+</button>
          <button class="delete-item-btn" data-id="${item.id}">Ta bort</button>
        </div>
      `;
  
      cartItemsContainer.appendChild(itemElement);
  
      // Add event listeners for increase, decrease, and delete buttons
      itemElement.querySelector(".decrease-item-btn").addEventListener("click", () => {
        changeItemQuantity(item.id, -1);
      });
  
      itemElement.querySelector(".increase-item-btn").addEventListener("click", () => {
        changeItemQuantity(item.id, 1);
      });
  
      itemElement.querySelector(".delete-item-btn").addEventListener("click", () => {
        removeItemFromCart(item.id);
      });
    });
  
    updateTotalPrice(cart);
  }
  
  // Update total price
  function updateTotalPrice(cart) {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    document.getElementById("total-price").textContent = `${totalPrice} kr`;
  }
  
  // Remove item from cart
  function removeItemFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
  
    localStorage.setItem("cart", JSON.stringify(cart));
  
    displayCartItems();
    updateCartHeader();
  }
  
  // Change quantity of an item
  function changeItemQuantity(productId, amount) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
      const item = cart[itemIndex];
      item.quantity += amount;
      
      // Ensure the quantity doesn't go below 1
      if (item.quantity < 1) item.quantity = 1;
  
      cart[itemIndex] = item;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  
    displayCartItems();
    updateCartHeader();
  }
  
  // Update cart in the header
  function updateCartHeader() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  
    document.getElementById("cart-item-count").textContent = itemCount;
    document.getElementById("cart-total-price").textContent = totalPrice;
  }
  