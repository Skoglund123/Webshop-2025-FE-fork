export async function fetchProducts() {
  const url = 'https://webshop-2025-be-g9.vercel.app/api/products';
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Fel vid hämtning av produkter:', error);
    return [];
  }
}

export async function fetchCategories() {
  const url = 'https://webshop-2025-be-g9.vercel.app/api/products';
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Fel vid hämtning av kategorier:', error);
    return [];
  }
}

export async function searchProducts(query) {
  const url = `https://webshop-2025-be-g9.vercel.app/api/products?search=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Fel vid sökning av produkter:', error);
    return [];
  }
}
