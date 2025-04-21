import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm';
import { fetchOrders } from "../src/utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const orderListContainer = document.getElementById("order-list");
  const statusOptions = ["ny", "betald", "packad", "levererad"];

  async function loadOrders() {
    try {
      const orders = await fetchOrders();

      if (!orders || orders.length === 0) {
        orderListContainer.innerHTML =
          "<tr><td colspan='8'>Inga ordrar hittades.</td></tr>";
        return;
      }

      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      orderListContainer.innerHTML = "";

      orders.forEach((order, index) => {
        const orderStatus = order.status || "ny";
        const customer = order;
        const products = order.products || [];

        // Beräkna total, hantera null eller saknade priser och kvantiteter
        const total = products.reduce(
          (sum, product) =>
            sum +
            (product.productId?.price ?? 0) *
            (product.quantity ?? 0),
          0
        );
        order.total = total;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>Order #${index + 1}</td>
          <td>${customer.firstName || "N/A"} ${customer.lastName || "N/A"}</td>
          <td>
            <p><strong>E-Mail:</strong> ${customer.email || "N/A"}</p>
            <p><strong>Telefon:</strong> ${customer.phoneNumber || "N/A"}</p>
          </td>
          <td>${customer.streetAddress || "N/A"}, ${
          customer.postalCode || "N/A"
        } ${customer.city || "N/A"}</td>
          <td>${total} kr</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
          <td>
            <select id="status-${index}" class="form-select form-select-sm">
              ${statusOptions
                .map(
                  (status) => `
                <option value="${status}" ${
                    status === orderStatus ? "selected" : ""
                  }>${status.charAt(0).toUpperCase() + status.slice(1)}</option>`
                )
                .join("")}
            </select>
          </td>
          <td>
            <button class="btn btn-sm btn-info me-1 print-btn">
              <i class="fa-solid fa-print"></i> Skriv ut
            </button>
          </td>
        `;

        
        const statusSelect = row.querySelector(`#status-${index}`);
        statusSelect.addEventListener("change", function () {
          updateOrderStatus(order._id, statusSelect.value);
        });

        
        const printBtn = row.querySelector(".print-btn");
        printBtn.addEventListener("click", () => {
          printOrder(index, order);
        });

        orderListContainer.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      orderListContainer.innerHTML =
        "<tr><td colspan='8'>Kunde inte hämta ordrar. Försök igen senare.</td></tr>";
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const response = await axios.put(
        `https://webshop-2025-be-g9.vercel.app/api/orders/${orderId}`,
        { status: newStatus }
      );
      console.log("Status uppdaterad:", response.data);
    } catch (error) {
      console.error("Fel vid uppdatering av status:", error);
    }
  }

  function printOrder(index, order) {
    if (order) {
      const orderContent = `
        <h1>Order #${index + 1}</h1>
        <p><strong>Namn:</strong> ${order.firstName} ${order.lastName}</p>
        <p><strong>E-Mail:</strong> ${order.email}</p>
        <p><strong>Telefon:</strong> ${order.phoneNumber}</p>
        <p><strong>Adress:</strong> ${order.streetAddress}, ${order.postalCode} ${order.city}</p>
        <p><strong>Total:</strong> ${order.total} kr</p>
        <p><strong>Orderdatum:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <h2>Varor</h2>
        <ul>
          ${order.products
            .map(
              (item) =>
                `<li>${item.productId.name} - ${item.quantity} x ${item.productId.price} kr</li>`
            )
            .join("")}
        </ul>
        <p><strong>Status:</strong> ${order.status || "ny"}</p>
      `;

      const printWindow = window.open("", "", "width=600,height=600");
      printWindow.document.write(`
        <html>
          <head><title>Orderutskrift</title></head>
          <body>${orderContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  loadOrders();
});
