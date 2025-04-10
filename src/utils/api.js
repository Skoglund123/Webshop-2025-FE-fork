import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm';


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
  const url = 'https://webshop-2025-be-g9.vercel.app/api/category/';
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Fel vid hämtning av kategorier:', error);
    return [];
  }
}

export async function fetchOrders() {
  const url = 'https://webshop-2025-be-g9.vercel.app/api/orders/';
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

export async function fetchUser() {
  const url = 'https://webshop-2025-be-g9.vercel.app/api/user/';
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Fel vid hämtning av User:', error);
    return [];
  }
}

export async function loginUser(email, password) {
  const url = 'https://webshop-2025-be-g9.vercel.app/api/user/login/'
  try {
    const response = await axios.post(url, {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Fel vid hämtning av User:', error);
    return error
  }
}