import {apiDeleteJson, apiGetJson, apiPostJson, apiPutJson} from "../utility/api.js";
import {showMessage} from "../pages/components/staff/Message.js";
import {navigate} from "../utility/router.js";



export let allUsers = null;


export async function loadAllUsers() {
    console.log("Henter alle brugere...");
    const res = await apiGetJson("/api/admin/users");

    res.ok ? allUsers = res.data : allUsers = [];

    console.log(allUsers);
}

export async function getUserById (id) {
    const res = await apiGetJson(`/api/admin/users/${id}`);
    if (res.ok) {
        return res.data;
    }
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

export async function deleteUser(id) {

    const res = await apiDeleteJson(`/api/admin/users/${id}`)

    if (res.ok) {
        showMessage("Bruger med ID: " + id + " blev slettet.");
        await loadAllUsers();
    } else {
        console.log("Fejl ved sletning af bruger.");
    }
}

export async function updateUser(dto) {
    const res = await apiPutJson("/api/admin/users", dto)

    if (res.ok) {
        showMessage(`Bruger med ID: ${dto.id} er nu blevet opdateret.`);
        await loadAllUsers();
        await navigate("/staff/users");
    } else {
        console.log("Fejl ved opdatering af bruger.")
    }
}

