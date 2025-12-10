import {deleteItem, getLostItemById} from "../../service/lostItemService.js";
import {Navbar} from "../components/staff/Navbar.js";
import formatDate from "../../utility/formatDate.js";
import {currentUser} from "../../service/authService.js";
import {navigate} from "../../utility/router.js";
import {generateItemLabelPdf} from "./GenerateItemLabelPDF.js";

export async function mount() {

    document.querySelector("#app-main").innerHTML = `
        <div id="nav-container"></div>

        <div class="w-full flex items-center justify-center">
            <div id="container"
                 class="w-full max-w-2xl p-6 bg-white border border-gray-300 rounded-md shadow-sm mt-10 font-serif">
            </div>
        </div>
    `;

    document.querySelector("#nav-container").appendChild(Navbar());

    // get id from URL
    const id = location.pathname.split("/").pop();
    const item = await getLostItemById(id);

    const container = document.querySelector("#container");

    if (!item) {
        container.innerHTML = `<p class="text-center text-red-600">Kunne ikke hente genstanden.</p>`;
        return;
    }

    const dateFormatted = formatDate(item.dateFound);

    container.innerHTML = `
        <div class="flex flex-col gap-6">
        
            <!-- Top -->
   <div class="flex justify-between items-center">

    <div class="flex">
        <h1 class="text-l font-semibold">${item.name}</h1>
    </div>

<div class="flex items-center gap-2">
    <p class="text-l text-gray-500 m-0 leading-none">ID:</p>
    <p class="text-l mb-1 text-gray-800 m-0 leading-none">${item.id}</p>
</div>

</div>


            <!-- Beskrivelse -->
            <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide">Beskrivelse</p>
                <p class="text-gray-800 mt-1">${item.description}</p>
            </div>

            <!-- Kategori -->
            <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide">Kategori</p>
                <p class="mt-1 text-gray-800">${item.category}</p>
            </div>

            <!-- Fundested -->
            <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide">Lokation fundet:</p>
                <p class="mt-1 text-gray-800">${item.placeFound}</p>
            </div>

            <!-- Dato -->
            <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide">Dato fundet</p>
                <p class="mt-1 text-gray-800">${dateFormatted}</p>
            </div>

            <!-- Indleveret af -->
            <div>
                <p class="text-sm text-gray-500 uppercase tracking-wide">Registreret af</p>
                <p class="mt-1 text-gray-800">${item.user?.username || "Ukendt"}</p>
                <p class="text-gray-800">${formatDate(item.registeredAt)}</p>
            </div>

            <!-- Knapper -->
            <div class="flex justify-between gap-3 mt-4">
              <div>
                <button id="back-btn"
                        class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
                    Tilbage
                </button>
                </div>
                
                <div id="buttons" class="flex flex-row gap-3">
               
                  <div id="handout-btn" class=" gap-2  justify-center items-center flex flex-row bg-green-800 px-2 py-1  text-white rounded hover:bg-green-900 transition cursor-pointer">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
    <path d="M9.75 17.25 4.5 12l1.41-1.41 3.84 3.84 8.34-8.34L19.5 7.5l-9.75 9.75z"/>
</svg>
                      <p>Udlever genstand</p>
                 

                </div>
                
                
                 <div id="print-btn" class=" gap-2  justify-center items-center flex flex-row bg-blue-800 px-2 py-1  text-white rounded hover:bg-blue-900 transition cursor-pointer">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
    <path d="M17 3H7v4H3v9h4v5h10v-5h4V7h-4V3zM9 5h6v2H9V5zm6 14H9v-3h6v3zm4-5H5V9h14v5z"/>
</svg>
                      <p>Label print</p>
                      
                </div>
                
                </div>
            </div>
        </div>
    `;

    document.querySelector("#back-btn").addEventListener("click", () => {
        history.back();
    });

    // du kan selv lave handler til handout-btn
    document.querySelector("#handout-btn").addEventListener("click", () => {
navigate(`/staff/lost-items/handout/${id}`)
    });

    document.querySelector("#print-btn").addEventListener("click", async () => generateItemLabelPdf(item))


    if (currentUser.role === "ADMIN") {
        const buttons = document.querySelector("#buttons");

        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = `
            <div id="delete-btn" class=" gap-2  justify-center items-center flex flex-row bg-red-800 px-2 py-1  text-white rounded hover:bg-red-900 transition cursor-pointer">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" 
     stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" 
        d="M3 6h18M10 11v6M14 11v6M5 6l1 14h12l1-14M8 6V4h8v2"/>
</svg>

                      <p>Slet genstand</p>
                 

                </div>
        `
        buttonContainer.addEventListener("click", async () => deleteItem(id));
        buttons.append(buttonContainer);
    }




       return () => document.querySelector("#app-main").innerHTML = ``;
}
