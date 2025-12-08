import {navigate} from "./router.js";

export async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        credentials: "include",
        headers: {"Content-type": "application/json", ...options.headers},
        ...options
    });

    if (response.status === 401) {
        console.log("Unauthorized - redirecting...")
        navigate("/");
        throw new Error("Unauthorized");
    }

    if (response.status === 403) {
        console.log("Access denied - redirecting...")
        navigate("/");
        throw new Error("Access denied");
    }

    return response;
}

export async function apiGetJson(url) {
    const response = await apiFetch(url, {method: "GET"});
    if (!response) return null;
    return await response.json();
}

export async function apiPostJson(url, body) {
    return await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(body)
    });
}
