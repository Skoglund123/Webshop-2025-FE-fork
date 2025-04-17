const cartContainer = document.getElementById("cart-items");
const form = document.getElementById("order-form");
const allInputs = form.querySelectorAll("input");

allInputs.forEach(input => {
  input.addEventListener("input", () => validateInput(input));
});

function validateInput(input) {
  input.classList.remove("valid", "invalid");
  removeError(input);

  if (!input.checkValidity()) {
    input.classList.add("invalid");
    showError(input, input.validationMessage);
  } else {
    input.classList.add("valid");
  }
}

function showError(input, message) {
  const error = document.createElement("div");
  error.classList.add("error-msg");
  error.textContent = message;
  input.after(error);
}

function removeError(input) {
  const next = input.nextElementSibling;
  if (next && next.classList.contains("error-msg")) {
    next.remove();
  }
}

    function loadCart() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Din varukorg är tom.</p>";
        return;
      }

      let total = 0;
      cartContainer.innerHTML = "";

      cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        div.innerHTML = `
          <strong>${item.name}</strong><br>
          Pris: ${item.price.toFixed(2).replace(".", ",")} kr<br>
          Antal: ${item.quantity}<br>
          Summa: ${itemTotal.toFixed(2).replace(".", ",")} kr
        `;

        cartContainer.append(div);
      });

      document.getElementById("total-price").textContent = total.toFixed(2).replace(".", ",") + " kr";
    }

    document.getElementById("order-form").addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

     allInputs.forEach(input => {
     validateInput(input);
     
    if (!input.checkValidity()) {
        isValid = false;
    }
    });

if (!isValid) return;

      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        alert("Varukorgen är tom.");
        return;
      }

      const order = {
        customer: {
          firstName: document.getElementById("first-name").value,
          lastName: document.getElementById("last-name").value,
          address: document.getElementById("address").value,
          postalCode: document.getElementById("postal-code").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
          phone: document.getElementById("phone").value,
        },
        items: cart,
        total: document.getElementById("total-price").textContent,
        date: new Date().toISOString()
      };

      // Save to localStorage for now
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Empty cart
      localStorage.removeItem("cart");

      // Show Confirmation
      const conf = document.getElementById("confirmation");
      conf.innerHTML = `
        <h3>Tack för din beställning, ${order.customer.firstName}!</h3>
        <p>Vi sms:ar innan leverans. Vänligen betala med swish i förskott.</p>
      `;
      conf.style.display = "block";

      // Clear form and cart visually
      document.getElementById("order-form").reset();
      cartContainer.innerHTML = "";
      document.getElementById("total-price").textContent = "0 kr";
    });

    loadCart();