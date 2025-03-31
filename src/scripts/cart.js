document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    updateCartHeader();
  });
  
  // Visa varor i kundvagn
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
        <button class="delete-item-btn" data-id="${item.id}">Ta bort</button>
      `;
  
      cartItemsContainer.appendChild(itemElement);
  
      itemElement.querySelector(".delete-item-btn").addEventListener("click", () => {
        removeItemFromCart(item.id);
      });
    });
  
    updateTotalPrice(cart);
  }
  
  // Uppdatera totala priset
  function updateTotalPrice(cart) {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    document.getElementById("total-price").textContent = `${totalPrice} kr`;
  }
  
  // Ta bort från kundvagn
  function removeItemFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
  
    localStorage.setItem("cart", JSON.stringify(cart));
  
    displayCartItems();
  
    updateCartHeader();
  }
  
  // Uppdatera kundvagn i header
  function updateCartHeader() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  
    document.getElementById("cart-item-count").textContent = itemCount;
    document.getElementById("cart-total-price").textContent = totalPrice;
  }
  