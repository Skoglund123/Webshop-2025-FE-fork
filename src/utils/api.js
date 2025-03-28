
// export function getBaseUrl() {
//   // Get the group number from the hostname to determine the base URL for BE
//   const regex = /webshop\-2025\-(g[0-9]{1,2})\-fe/g;
//   const href = window.location.href;
//   const match = regex.exec(href);
//   console.log(match);
//   if (match) {
//     const group = match[1];
//     return `https://webshop-2025-be-g9.vercel.app/api/products`;
//   }
//   return "http://localhost:3000/";
// }

// export async function fetchProducts(endpoint = "api/products") {
//   //! DONT USE THIS IN PRODUCTION
//   const url = `${getBaseUrl()}${endpoint}`;
//   const response = await fetch(url);
//   if(response.ok){
//     const data = await response.json();
//     return data;
//   }
//   return [];    
// }






//fetch

// export async function fetchProducts() {
//   const url = 'https://webshop-2025-be-g9.vercel.app/api/products';
//   const response = await fetch(url);
//   if (response.ok) {
//     const data = await response.json();
//     return data;
//   }
//   return [];
// }



//axios

export async function fetchProducts() {
  const url = 'http://localhost:5003/product';
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Fel vid hämtning av produkter:', error);
    return [];
  }
}

export async function fetchCategories() {
  const url = 'http://localhost:5003/category';
  try {
    const response = await axios.get(url);
    return response.data; // Array med alla kategorier
  } catch (error) {
    console.error('Fel vid hämtning av kategorier:', error);
    return [];
  }
}
// https://webshop-2025-be-g9.vercel.app/api/products