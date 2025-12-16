import {deleteItem, getLostItemById, handoutItem} from "../../service/lostItemService.js";
import {Navbar} from "../components/staff/Navbar.js";
import formatDate from "../../utility/formatDate.js";
import {currentUser} from "../../service/authService.js";
import {navigate} from "../../utility/router.js";
import {generateItemLabelPdf} from "./GenerateItemLabelPDF.js";
import ConfirmationPopUp from "../components/staff/ConfirmationPopUp.js";

export async function mount() {

    const actionBtnClass = `
        flex items-center gap-2
        h-9 min-w-[100px] px-1
        justify-center
        text-sm font-medium
        rounded transition cursor-pointer
    `;

    document.querySelector("#app-main").innerHTML = `
        <div id="nav-container"></div>

        <div class="w-full flex items-center justify-center">
            <div id="container"
                 class="w-full max-w-2xl p-6 bg-white border border-gray-300 rounded-md shadow-sm mt-10 font-serif">
            </div>
        </div>
    `;

    document.querySelector("#nav-container").appendChild(Navbar());

    const id = location.pathname.split("/").pop();
    const item = await getLostItemById(id);
    const container = document.querySelector("#container");

    if (!item) {
        container.innerHTML = `<p class="text-center text-red-600">Kunne ikke hente genstanden.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="flex flex-col gap-3">

            <div class="flex justify-between items-center">
                <h1 class="text-lg font-semibold">${item.name}</h1>
                <div class="flex items-center gap-2">
                    <span class="text-gray-500">ID:</span>
                    <span class="text-gray-800">${item.id}</span>
                </div>
            </div>

            <div>
                <p class="text-sm text-gray-500 uppercase">Status</p>
                <p>${item.isReturned ? "Udleveret" : "Ikke udleveret"}</p>
            </div>

            <div>
                <p class="text-sm text-gray-500 uppercase">Beskrivelse</p>
                <p>${item.description}</p>
            </div>

            <div>
                <p class="text-sm text-gray-500 uppercase">Kategori</p>
                <p>${item.category}</p>
            </div>

            <div>
                <p class="text-sm text-gray-500 uppercase">Fundet</p>
                <p>${item.placeFound}</p>
            </div>

            <div>
                <p class="text-sm text-gray-500 uppercase">Dato fundet</p>
                <p>${formatDate(item.dateFound)}</p>
            </div>

            <div>
                <p class="text-sm text-gray-500 uppercase">Registreret af</p>
                <p>${item.user?.username ?? "Ukendt"}</p>
                <p>${formatDate(item.registeredAt)}</p>
            </div>

            <div class="flex justify-between mt-4">
                <button id="back-btn"
                        class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                    Tilbage
                </button>

                <div id="buttons" class="flex gap-3">
                    <div id="print-btn"
                         class="${actionBtnClass} bg-blue-800 text-white hover:bg-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M17 3H7v4H3v9h4v5h10v-5h4V7h-4V3z"/>
                        </svg>
                        <span>Label print</span>
                    </div>
                </div>
            </div>

            <div id="message-container" class="text-center text-sm mt-4"></div>
        </div>
    `;

    document.querySelector("#back-btn").addEventListener("click", () => history.back());
    document.querySelector("#print-btn").addEventListener("click", () => generateItemLabelPdf(item));

    async function handleHandoutItem() {
        const dto = {
            lostItem: id,
            handedOutBy: currentUser.id
        };
        const res = await handoutItem(dto);
        if (res.ok) await mount();
    }

    const buttons = document.querySelector("#buttons");

    if (!item.isReturned) {
        const handoutBtn = document.createElement("div");
        handoutBtn.className = `${actionBtnClass} bg-green-800 text-white hover:bg-green-900`;
        handoutBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M9.75 17.25 4.5 12l1.41-1.41 3.84 3.84 8.34-8.34L19.5 7.5z"/>
            </svg>
            <span>Udlever</span>
        `;
        handoutBtn.addEventListener("click", () =>
            ConfirmationPopUp(
                "Er gyldig billed-ID kontrolleret?",
                "Udlever",
                "Annuller",
                handleHandoutItem
            )
        );
        buttons.append(handoutBtn);

        const updateBtn = document.createElement("div");
        updateBtn.className = `${actionBtnClass} bg-yellow-700 text-white hover:bg-yellow-800`;
        updateBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
            </svg>
            <span>Opdater</span>
        `;
        updateBtn.addEventListener("click", () =>
            navigate(`/staff/update/lost-items/${item.id}`)
        );
        buttons.append(updateBtn);
    }

    if (currentUser.role === "ADMIN") {
        const deleteBtn = document.createElement("div");
        deleteBtn.className = `${actionBtnClass} bg-red-800 text-white hover:bg-red-900`;
        deleteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>
            </svg>
            <span>Slet</span>
        `;
        deleteBtn.addEventListener("click", () =>
            ConfirmationPopUp(
                "Slet genstanden permanent?",
                "Slet",
                "Annuller",
                () => deleteItem(id),
                "danger"
            )
        );
        buttons.append(deleteBtn);
    }

    return () => document.querySelector("#app-main").innerHTML = "";
}
