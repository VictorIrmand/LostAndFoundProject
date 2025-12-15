import {apiGetJson, apiPostJson} from "../utility/api.js";
import {showMessage} from "../pages/components/staff/Message.js";



export let allUsers = null;


export async function loadAllUsers() {
    console.log("Henter alle brugere...");
    const res = await apiGetJson("/api/admin/users");

    res.ok ? allUsers = res.data : allUsers = [];

    console.log(allUsers);
}

export async function createUser(dto) {

    const res = await apiPostJson("/api/admin/users", dto);

    if (res.ok) {
        showMessage("Medarbejder med brugernavn: " + dto.username + " er nu registreret.");
        console.log("Medarbejder med brugernavn: " + dto.username + " er nu registreret.");
        await loadAllUsers();
    }
    else {
        console.log("Fejl ved oprettelse af medarbejder. Prøv igen senere...");
    }

    return res;
}

