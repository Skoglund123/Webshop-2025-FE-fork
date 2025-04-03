import { getLoggedUserFromStorage, hashPassword, getFromStorage } from "./services.js";
import { User } from "./user.js";

const loginButton = document.getElementById("btn-login");
const error = document.getElementById("error");

const login = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        error.textContent = "Please fill in both email and password.";
        return;
    }

    const hashedPassword = await hashPassword(password);
    const usersList = getFromStorage("Users");

    const user = usersList.find(user => user.email === email && user.password === hashedPassword);

    if (user) {
        sessionStorage.setItem("loggedUser", JSON.stringify(new User(user.id, user.firstName, user.lastName, user.email)));
        error.textContent = "";
        window.location.href = "/dashboard/index.html";
    } else {
        error.textContent = "Incorrect email or password. Please try again!";
    }
};

if (loginButton) {
    loginButton.addEventListener("click", login);
}
