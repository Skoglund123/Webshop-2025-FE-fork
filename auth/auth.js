import { loginUser } from "../src/utils/api.js";
import { saveToStorage } from "./services.js";

const loginButton = document.getElementById("btn-login");
const error = document.getElementById("error");

const login = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        error.textContent = "Please fill in both email and password.";
        return;
    }

    const response = await loginUser(email, password)
    if(response.message){ //is error
        return
    }
    
    saveToStorage("token", response.token)
    window.location.href = "/dashboard/index.html";

    console.log(response)
};

if (loginButton) {
    loginButton.addEventListener("click", login);
}
