import { ifNotAuthenticated, logOutUser } from "../auth/services.js";

window.addEventListener("DOMContentLoaded", () => {
    
  ifNotAuthenticated();

 
  // Måste läggas till
  const logoutButton = document.getElementById("btn-logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", logOutUser);
  }
});
