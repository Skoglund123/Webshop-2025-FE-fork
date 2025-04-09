import { ifNotAuthenticated, logOutUser } from "../auth/services.js";
import { fetchProducts, fetchCategories } from "../src/utils/api.js";

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

    // lookup for categoryname
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
    list.innerHTML = "<tr><td colspan='6'>Inga produkter hittades</td></tr>";
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
        <button class="btn btn-sm btn-danger">Ta bort</button>
      </td>
    `;

    list.append(row);
  });
}