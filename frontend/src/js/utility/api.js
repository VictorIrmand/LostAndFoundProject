import {navigate} from "./router.js";
import {showMessage} from "../pages/components/staff/Message.js";

const baseUrl = import.meta.env.VITE_BASE_URL;

export async function apiFetch(url, options = {}) {
    const res = await fetch(baseUrl + url, {
        credentials: "include",
        headers: {"Content-type": "application/json", ...options.headers},
        ...options
    });



    // forsøg JSON, ellers text, ellers tom. primitive typer er aldrig json især ikke i globalexceptionhandler.
    // Det er derimod json hvis man smider et OBJEKT ind altså noget der matcher json i et responseobjekt, så kan man hente dens rå tekst og formatterer til json alligevel.
    // På den måde er man altid sikker på at res.json() ikke bliver brugt og hardcrasher programmet.
    const status = res.status;

    // læs body én gang
    const text = await res.text();

    // parse én gang
    let body;
    try {
        body = JSON.parse(text); // hvis at det er et objekt der sendes i gennem bliver det til json.
    } catch {
        body = text; // hvis det er primitiv type der sendes igennem fra controlleren, så bliver den bare rå tekst.
    }

    switch (status) {
        // 400 - BAD REQUEST / Validation (MethodArgumentNotValidException)
        case 400:
            showMessage(body, "error");
            break;

        // 401 - Unauthorized (Spring Security smider)
        case 401:
            await navigate("/")
            showMessage("Du er logget ud. Log ind for at fortsætte.", "error")
            break;
        // 403 - Forbidden (AccessDenied) spring security smider
        case 403:
            showMessage("Du har ikke tilladelse til at vise denne side.")
            break;

        // 404 - NotFoundException
        case 404:
            showMessage(body || "Not found", "error");
            break;

        // 409 - Conflict (DuplicateResourceException)
        case 409:
            showMessage(body || "Conflict", "error");
            break;

        // 500 - Internal Server Error (DatabaseAccessException)
        case 500:
            showMessage("A system error occurred.", "error");
            break;
    }

    return {ok: res.ok, status: status, data: body};
}

export async function apiGetJson(url) {
    return await apiFetch(url, {method: "GET"});
}

export async function apiPostJson(url, body) {
    return await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(body)
    });
}


export async function apiPutJson(url, body) {
    return await apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

export async function apiDeleteJson(url) {
    return await apiFetch(url, {
        method: "DELETE"
    })
}
