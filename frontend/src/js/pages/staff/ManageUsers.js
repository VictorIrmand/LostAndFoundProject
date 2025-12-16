import {Navbar} from "../components/staff/Navbar.js";
import {allUsers, deleteUser} from "../../service/userService.js";
import {loadAllUsers} from "../../service/userService.js";
import {getDisplayName} from "../../utility/getDisplayName.js";
import {navigate} from "../../utility/router.js";
import ConfirmationPopUp from "../components/staff/ConfirmationPopUp.js";

export async function mount() {
    document.querySelector("#app-main").innerHTML = `
    <div id="nav-container"></div>
    
        <div class="w-full flex flex-col items-center justify-center">
<div class="w-full flex flex-col justify-center items-center mt-4 ">


  <h1 class="mb-4 text-xl font-semibold">Manage Users</h1>

<div class="flex-col w-full max-w-5xl flex items-center justify-between gap-4 mb-6">

    <div class="flex gap-3 items-center">
        <input
            id="search-user"
            type="text"
            placeholder="Søg..."
            class="w-64 px-4 py-2 border rounded-md text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
            id="role-filter"
            class="px-4 py-2 border rounded-md text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Alle roller</option>
            <option value="STAFF">Medarbejder</option>
            <option value="ADMIN">Admin</option>
        </select>
    </div>

    <button
        id="create-btn"
        class="px-5 py-2 text-sm font-medium text-white
               bg-green-600 rounded-md
               hover:bg-green-700
               focus:outline-none focus:ring-2 focus:ring-green-500"
    >
        + Registrer ny medarbejder
    </button>

</div>

</div>
  
<div id="user-list">



   <div class="users-container">
                <table id="users-table">
                    <thead>
                    <tr class="top-row">
                        <th>ID</th>
                        <th>Brugernavn</th>
                        <th>Fornavn</th>
                        <th>Efternavn</th>
                        <th>Rolle</th>
                        <th>Handlinger</th>
                    </tr>
                    </thead>
                    <tbody id="users-table-body"></tbody>
                </table>
            </div>
</div>

</div>

<div id="message-container" class="text-center text-sm mt-4"></div>

</div>
  
    `
    const searchUser = document.querySelector("#search-user");
    const roleSelect = document.querySelector("#role-filter");
    document.querySelector("#create-btn").addEventListener("click", async () => navigate("/staff/users/new"))

    searchUser.addEventListener("input", () => renderUsers());
    roleSelect.addEventListener("change", () => renderUsers());

    if (!allUsers || allUsers.length === 0) {
        await loadAllUsers();
    }

    console.log("Burde vise en user: " + allUsers)
    renderUsers();


    function renderUsers() {
        const filteredUsers = filterUsers();
        const tbody = document.querySelector("#users-table-body");
        tbody.innerHTML = "";

        filteredUsers.forEach(user => {
            const tr = document.createElement("tr");
            tr.className = "border-b ";

            tr.innerHTML = `
            <td class="px-4 py-2 text-sm">${user.id}</td>
            <td class="px-4 py-2">${user.username}</td>
            <td class="px-4 py-2">${user.firstName}</td>
            <td class="px-4 py-2">${user.lastName}</td>
            <td class="px-4 py-2">${getDisplayName(user.role)}</td>
            <td class="px-4 py-2 flex gap-2">
                <button 
                    class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    data-id="${user.id}"
                >
                    Opdater
                </button>
                <button 
                    class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    data-id="${user.id}"
                    id="delete-btn"
                >
                    Slet
                </button>
            </td>
        `;

            tr.querySelector("#delete-btn").addEventListener("click", async (e) => {
               ConfirmationPopUp("Er du sikker på at du vil slette denne bruger?", "Slet", "Gå tilbage",() => handleDeleteUser(user.id), "danger")
            })
            tbody.appendChild(tr);
        });
    }

    async function handleDeleteUser(id) {
        await deleteUser(id);
        renderUsers();
    }


    function filterUsers() {
        let filteredUsers = [...allUsers];

        let searchWord = searchUser.value.trim();
        let roleValue = roleSelect.value;

        if (searchWord !== "") {
            filteredUsers = filteredUsers.filter(user => user.username.includes(searchWord) || user.firstName.includes(searchWord) || user.lastName.includes(searchWord))
        }

        if (roleValue !== "") {
            filteredUsers = filteredUsers.filter(user => user.role === roleValue)
        }

        return filteredUsers;
    }


    document.querySelector("#nav-container").appendChild(Navbar());
    return () => {
    }
}