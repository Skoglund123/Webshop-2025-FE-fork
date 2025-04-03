import { saveToStorage, getFromStorage, generateRandomUUID, hashPassword } from "./services.js";
import { User } from "./user.js";

const registerButton = document.getElementById("btn-register");
const error = document.getElementById("error");

const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const register = async () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        error.textContent = "Please fill in all fields!";
        return;
    }

    if (!isValidEmail(email)) {
        error.textContent = "The email address is invalid!";
        return;
    }

    if (password !== confirmPassword) {
        error.textContent = "Passwords do not match!";
        return;
    }

    if (password.length < 5) {
        error.textContent = "Password must be at least 5 characters long!";
        return;
    }

    const usersList = getFromStorage("Users");

    if (usersList.some(user => user.email === email)) {
        error.textContent = "This email is already registered. Please choose another one!";
        return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User(generateRandomUUID(), firstName, lastName, email, hashedPassword);

    usersList.push(newUser);
    saveToStorage("Users", usersList);

    sessionStorage.setItem("loggedUser", JSON.stringify(new User(newUser.userId, newUser.firstName, newUser.lastName, newUser.email)));

    error.textContent = "";
    window.location.href = "/dashboard/index.html";
};

if (registerButton) {
    registerButton.addEventListener("click", register);
}
