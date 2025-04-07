// services.js

// --- Session / Auth helpers ---
export const ifNotAuthenticated = () => {
    const token = getFromStorage("token", true)
    console.log("token", token)
    if (!token) {
        removeFromStorage("token")
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
    removeFromStorage("token")
    window.location.href = "/index.html";
};

// --- LocalStorage helpers ---
export const getFromStorage = (key, isString = false) => {
    const data = localStorage.getItem(key);
    if(isString) return data
    return data ? JSON.parse(data) : [];
};

export const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromStorage = (key) => {
    localStorage.removeItem(key)
}


export const generateRandomUUID = () => {
    return crypto.randomUUID();
};
