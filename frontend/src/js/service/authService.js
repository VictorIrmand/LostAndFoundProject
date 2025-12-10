import {navigate} from "../utility/router.js";
import {showMessage} from "../utility/Message.js";

const baseUrl = import.meta.env.VITE_BASE_URL;
export let currentUser = null;

export async function login(loginRequestDTO) {
    try {
        const response = await fetch(baseUrl + "/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(loginRequestDTO)
        })

        if (response.ok) {
            console.log("User with username: " + loginRequestDTO.username + " was successfully logged in");
            await loadCurrentUser();
            await navigate("/staff")
        } else {
            showMessage("Wrong username or password.")
        }
    } catch (e) {
        showMessage("Login failed. Try again later.");
    }
}


export async function loadCurrentUser() {
    try {
        const response = await fetch(baseUrl + "/api/auth/me", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            currentUser = null;
            return null;
        }

        // Prøv at parse JSON sikkert
        let data;
        try {
            data = await response.json();
        } catch {
            data = null;
        }

        currentUser = data;
        return currentUser;

    } catch (e) {
        currentUser = null;
        return null;
    }
}


export async function logout() {
    await navigate("/login");
    showMessage("Du er nu logget ud.")

    currentUser = null;

    try {

    const res = await fetch(baseUrl + "/api/auth/logout", {
        method: "POST",
        credentials: "include",

    })
    } catch (e) {
        // gør intet- bruger er allerede logget ud af frontend.  currentUser = null.
    }
}