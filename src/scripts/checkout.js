const cartContainer = document.getElementById("cart-items");
const form = document.getElementById("order-form");
const allInputs = form.querySelectorAll("input");

// Validering
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

// Ladda varukorg
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

// Skicka beställning
document.getElementById("order-form").addEventListener("submit", async function (e) {
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
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    streetAddress: document.getElementById("address").value,
    postalCode: document.getElementById("postal-code").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
    phoneNumber: document.getElementById("phone").value,
    products: cart.map(item => ({
      productId: item._id || item.id,
      quantity: item.quantity
    }))
  };

  try {
    const response = await fetch("https://webshop-2025-be-g9.vercel.app/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      throw new Error("Beställningen kunde inte skickas.");
    }

    const result = await response.json();

    localStorage.removeItem("cart");
    document.getElementById("order-form").reset();
    cartContainer.innerHTML = "";
    document.getElementById("total-price").textContent = "0 kr";

    let total = 0;
    cart.forEach(item => {
    total += item.price * item.quantity;
    });

    const formattedTotal = total.toFixed(2).replace('.', ',');

    const conf = document.getElementById("confirmation");
    conf.innerHTML = `
      <h3>Tack för din beställning, ${order.firstName}!</h3>
      <p>Vi sms:ar innan leverans. Vänligen betala ${formattedTotal + " kr"} med swish i förskott till nr: 0707070707.</p>
    `;
    conf.style.display = "block";
  } catch (err) {
    alert("Något gick fel: " + err.message);
  }
});

loadCart();