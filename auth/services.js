// services.js

// --- Session / Auth helpers ---
export const isAuthenticated = () => sessionStorage.getItem("loggedUser") !== null;

export const ifNotAuthenticated = () => {
    if (!isAuthenticated()) {
        window.location.href = "/auth/login.html";
        return false;
    }
    return true;
};

export const getLoggedUserFromStorage = () => {
    const user = sessionStorage.getItem("loggedUser");
    return user ? JSON.parse(user) : null;
};

export const logOutUser = () => {
    sessionStorage.clear();
    window.location.href = "/index.html";
};

// --- LocalStorage helpers ---
export const getFromStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

export const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// HIDE PASSWORD
export const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};


export const generateRandomUUID = () => {
    return crypto.randomUUID();
};
