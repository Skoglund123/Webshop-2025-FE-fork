document.addEventListener("DOMContentLoaded", function() {
    const orderListContainer = document.getElementById("order-list");

    // Visa ordrar
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        
        if (orders.length === 0) {
            orderListContainer.innerHTML = "<p>Inga ordrar hittades.</p>";
            return;
        }

        // Sortera ordrar
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));

        orderListContainer.innerHTML = '';

        orders.forEach((order, index) => {
            const orderDiv = document.createElement("div");
            orderDiv.classList.add("order");

            const orderStatus = order.status || 'new'; // Default status
            const statusOptions = ['ny', 'betald', 'packad', 'levererad'];
            
            const orderHTML = `
                <div>
                    <h3>Order #${index + 1}</h3>
                    <p><strong>Namn:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                    <p><strong>E-Mail:</strong> ${order.customer.email}</p>
                    <p><strong>Telefon:</strong> ${order.customer.phone}</p>
                    <p><strong>Adress:</strong> ${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}</p>
                    <p><strong>Totalbelopp:</strong> ${order.total}</p>
                    <p><strong>Orderdatum:</strong> ${new Date(order.date).toLocaleString()}</p>
                    
                    <label for="status-${index}">Status: </label>
                    <select id="status-${index}">
                        ${statusOptions.map(status => `
                            <option value="${status}" ${status === orderStatus ? 'selected' : ''}>${status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        `).join('')}
                    </select>
                    
                    <button onclick="printOrder(${index})">Skriv Ut Order</button>
                </div>
            `;
            orderDiv.innerHTML = orderHTML;

            // Ändra status på order
            const statusSelect = orderDiv.querySelector(`#status-${index}`);
            statusSelect.addEventListener("change", function() {
                updateOrderStatus(index, statusSelect.value);
            });

            orderListContainer.appendChild(orderDiv);
        });
    }

    // Uppdatera status på order
    function updateOrderStatus(index, newStatus) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        if (orders[index]) {
            orders[index].status = newStatus;
            localStorage.setItem("orders", JSON.stringify(orders));
        }
    }

    // Skriv ut order
    window.printOrder = function(index) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const order = orders[index];
        if (order) {
            let orderContent = `
                <h1>Order #${index + 1}</h1>
                <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                <p><strong>Email:</strong> ${order.customer.email}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
                <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <h2>Items</h2>
                <ul>
                    ${order.items.map(item => `
                        <li>${item.name} - ${item.quantity} x ${item.price} kr</li>
                    `).join('')}
                </ul>
                <p><strong>Status:</strong> ${order.status || 'new'}</p>
            `;

            const printWindow = window.open('', '', 'width=600,height=400');
            printWindow.document.write(orderContent);
            printWindow.document.close();
            printWindow.print();
        }
    }

    // Ladda sidan och visa ordrar
    loadOrders();
});
