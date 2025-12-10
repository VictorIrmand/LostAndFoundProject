import {navigate} from "../../utility/router.js";
import {Navbar} from "../components/staff/Navbar.js";
import {currentUser} from "../../service/authService.js";

export function mount() {

    document.querySelector("#app-main").innerHTML = `
<div id="nav-container">

</div>

        <div class="dashboard-page flex flex-col items-center gap-6 py-10 font-serif font-semibold">

            <h1 class="text-lg font-normal opacity-60">Lost & Found – Dashboard</h1>
            
            <div class="flex w-2/3 items-center justify-center">
            <p class="text-center opacity-60">Her kan personalet registrere, opdatere og administrere fundne genstande. Beskrivelser af mistede genstande bør ikke deles med de besøgende, og ved afhentning af mistede genstande, skal der noteres gyldig billed ID, og beskrivelsen af den mistede genstand bør stemme overens med systemet.</p>
</div>
            <div class="flex flex-col gap-4 w-full max-w-sm" id="btn-links">
<button class="btn-lost bg-gray-200 py-3 rounded">
                    Se tabte genstande
                </button> 
                
                <button class="btn-create bg-gray-200 text-black py-3 rounded">
                    Registrer tabt genstand
                </button>

                

                <button class="btn-handout bg-gray-200 py-3 rounded">
                    Udlever genstande
                </button>

            </div>
        </div>
    `;

    document.querySelector("#nav-container").appendChild(Navbar());

    document.querySelector(".btn-create")
        .addEventListener("click", async () => await navigate("/staff/lost-items/new"));

    document.querySelector(".btn-lost")
        .addEventListener("click", async () => await navigate("/staff/lost-items"));

    document.querySelector(".btn-handout")
        .addEventListener("click", async () => await navigate("/staff/lost-items/handout"));

    if (currentUser && currentUser.role === "ADMIN") {
        const manageUsersBtn = document.createElement("button");
        manageUsersBtn.textContent = "Administrer brugere"
        manageUsersBtn.classList.add(
            "bg-gray-200",
            "py-3",
            "px-4",
            "rounded",
            "hover:bg-gray-300"
        );
        manageUsersBtn.addEventListener("click", async () => await navigate("/staff/users"))

        document.querySelector("#btn-links").appendChild(manageUsersBtn);
    }

    return () => {
        document.querySelector("#app-main").innerHTML = "";
    };
}
