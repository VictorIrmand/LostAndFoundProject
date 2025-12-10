import {currentUser, logout} from "../../../service/authService.js";

export function Navbar() {
    const div = document.createElement("div");
    div.className = "flex items-center justify-between border-b p-4 bg-white";

    div.innerHTML = `
        <div class="text-3xl font-serif font-semibold">
            <a class="cursor-pointer" href="/staff">Glyptoteket</a>
        </div>

        <nav id="staff-nav" class="flex items-center gap-8 text-sm">
          <a class="nav-link hover:underline cursor-pointer" href="/staff">Dashboard</a>
            <a class="nav-link hover:underline cursor-pointer" href="/staff/lost-items">Se genstande</a>
            <a class="nav-link hover:underline cursor-pointer" href="/staff/lost-items/new">Registrer tabt genstand</a>
            <a class="nav-link hover:underline cursor-pointer" href="/staff/lost-items/handout">Udlever genstand</a>
          
        </nav>

        <div class="flex items-center gap-4">

            <div class="flex items-center gap-2 mr-2 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                     class="w-5 h-5 opacity-70">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                </svg>

                <p id="user" class="text-sm font-medium"></p>
            </div>

            <button id="logoutBtn"
                class="px-4 py-2 border rounded-full text-sm hover:bg-gray-100 transition">
                Log ud
            </button>
        </div>
    `;

    div.querySelector("#user").textContent = currentUser?.username ?? "";

    let uri = location.pathname;




    if (currentUser.role === "ADMIN") {
        const a = document.createElement("a");
        a.textContent = "Administrer brugere"
        a.classList.add("nav-link", "hover:underline", "cursor-pointer");
        a.href = "/staff/users"
        div.querySelector("#staff-nav").appendChild(a);
    }

    div.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === uri) {
            link.classList.add("underline", "font-semibold")
        } else {
            link.classList.remove("underline", "font-semibold")
        }
    })

    div.querySelector("#logoutBtn")
        .addEventListener("click", async () => logout());

    return div;
}
