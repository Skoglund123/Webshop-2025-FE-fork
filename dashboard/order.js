document.addEventListener("DOMContentLoaded", function() {
    const orderListContainer = document.getElementById("order-list");
    const statusOptions = ['ny', 'betald', 'packad', 'levererad'];

    // Ladda och visa ordrar
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        
        if (orders.length === 0) {
            orderListContainer.innerHTML = "<tr><td colspan='8'>Inga ordrar hittades.</td></tr>";
            return;
        }

        // Sortera ordrar efter datum (senaste först)
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        orderListContainer.innerHTML = '';

        orders.forEach((order, index) => {
            const orderStatus = order.status || 'ny'; // Default status

            // Skapa en tabellrad
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>Order #${index + 1}</td>
                <td>${order.customer.firstName} ${order.customer.lastName}</td>
                <td>
                    <p><strong>E-Mail:</strong> ${order.customer.email}</p>
                    <p><strong>Telefon:</strong> ${order.customer.phone}</p>
                </td>
                <td>${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}</td>
                <td>${order.total} kr</td>
                <td>${new Date(order.date).toLocaleString()}</td>
                <td>
                    <select id="status-${index}" class="form-select form-select-sm">
                        ${statusOptions.map(status => `
                            <option value="${status}" ${status === orderStatus ? 'selected' : ''}>
                                ${status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        `).join('')}
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="printOrder(${index})">
                      <i class="fa-solid fa-print"></i> Skriv ut
                    </button>
                </td>
            `;

            // Lägg till event-lyssnare för dropdownen för att uppdatera orderstatus
            const statusSelect = row.querySelector(`#status-${index}`);
            statusSelect.addEventListener("change", function() {
                updateOrderStatus(index, statusSelect.value);
            });

            orderListContainer.appendChild(row);
        });
    }

    // Uppdatera status och spara i localStorage
    function updateOrderStatus(index, newStatus) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        if (orders[index]) {
            orders[index].status = newStatus;
            localStorage.setItem("orders", JSON.stringify(orders));
        }
    }

    // Skriv ut order – öppnar ett nytt fönster med orderinformation
    window.printOrder = function(index) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const order = orders[index];
        if (order) {
            let orderContent = `
                <h1>Order #${index + 1}</h1>
                <p><strong>Namn:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                <p><strong>E-Mail:</strong> ${order.customer.email}</p>
                <p><strong>Telefon:</strong> ${order.customer.phone}</p>
                <p><strong>Adress:</strong> ${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}</p>
                <p><strong>Total:</strong> ${order.total} kr</p>
                <p><strong>Orderdatum:</strong> ${new Date(order.date).toLocaleString()}</p>
                <h2>Items</h2>
                <ul>
                    ${order.items.map(item => `
                        <li>${item.name} - ${item.quantity} x ${item.price} kr</li>
                    `).join('')}
                </ul>
                <p><strong>Status:</strong> ${order.status || 'ny'}</p>
            `;

            const printWindow = window.open('', '', 'width=600,height=400');
            printWindow.document.write(orderContent);
            printWindow.document.close();
            printWindow.print();
        }
    }

    // Initiera sidladdning
    loadOrders();
});
