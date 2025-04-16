import { ifNotAuthenticated, logOutUser } from "../auth/services.js";
import { fetchProducts, fetchCategories, deleteProductDashboard } from "../src/utils/api.js";

window.addEventListener("DOMContentLoaded", async () => {
  ifNotAuthenticated();

  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", logOutUser);
  }

  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);

    
    const categoryLookup = {};
    categories.forEach(cat => {
      categoryLookup[cat._id] = cat.name;
    });

    renderProducts(products, categoryLookup);
  } catch (err) {
    console.error("Fel vid hämtning av produkter/kategorier:", err);
  }
});

function renderProducts(products, categoryLookup) {
  const list = document.getElementById("products-body");

  if (!products || products.length === 0) {
    list.innerHTML = "<tr><td colspan='8'>Inga produkter hittades</td></tr>";
    return;
  }

  list.innerHTML = "";

  products.forEach(p => {
    const row = document.createElement("tr");

    const image = p.img && p.img.trim() !== "" 
      ? p.img 
      : "https://dummyimage.com/60x60/000000/fff&text=bild+saknas";

    const categoryName = categoryLookup[p.category] || "Okänd";

    row.innerHTML = `
      <td><img src="${image}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover;"></td>
      <td>${p.name}</td>
      <td>${p.brand}</td>
      <td>${p.quantity ?? "-"}</td>
      <td>${p.price} kr</td>
      <td>${p.stock} st</td>
      <td>${categoryName}</td>
      <td>
        <button class="btn btn-sm btn-primary">Redigera</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${p._id}">Ta bort</button>
      </td>
    `;

    list.append(row);

    const deleteBtn = row.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      if (confirm('Är du säker på att du vill ta bort produkten?')) {
        try {
          const result = await deleteProductDashboard(p._id);
          row.remove();
          alert("Produkten togs bort!");
        } catch (error) {
          console.error("Fel vid borttagning av produkt:", error);
          alert("Kunde inte ta bort produkten.");
        }
      }
    });
  });
}
