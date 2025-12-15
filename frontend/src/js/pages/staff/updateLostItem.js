

import {
    getLostItemById,
    updateLostItem,
    loadCategories,
    categories
} from "../../service/lostItemService.js";

import {Navbar} from "../components/staff/Navbar.js";
import {showMessage} from "../components/staff/Message.js";

export async function mount() {
    console.log("Vi er i updateLostItem")

    const lostItemId = location.pathname.split("/").pop();

    document.querySelector("#app-main").innerHTML = `

    <div id="nav-container"></div>

    <div class="create-page flex flex-col items-center gap-3 mt-2 font-serif font-semibold">
      <h1 class="text-lg font-normal opacity-60">Opdater Lost Item</h1>

      <div class="w-fit flex p-2 flex-col bg-gray-300 rounded-md">
        <form class="flex flex-col gap-1">

  <div class="flex w-full flex-col gap-1">
    <label for="name" class="text-sm font-medium font-serif text-gray-800">
      Navn på genstand:
    </label>
    <input
      id="name"
      type="text"
      class="w-96 p-2 rounded-md border border-gray-300
             focus:outline-none focus:ring-2 focus:ring-gray-900/20
             focus:border-gray-900/30 transition"
    />
  </div>

  <div class="flex w-full flex-col gap-1">
    <label for="description" class="text-sm font-medium font-serif text-gray-800">
      Beskrivelse:
    </label>
    <textarea
      id="description"
      rows="4"
      class="w-96 p-2 rounded-md border border-gray-300
             focus:outline-none focus:ring-2 focus:ring-gray-900/20
             focus:border-gray-900/30 transition resize-none"
    ></textarea>
  </div>

  <div class="flex w-full flex-col gap-1">
    <label for="place" class="text-sm font-medium font-serif text-gray-800">
      Hvor er den blevet fundet?
    </label>
    <select
      id="place"
      class="w-96 p-2 rounded-md border border-gray-300
             focus:outline-none focus:ring-2 focus:ring-gray-900/20
             focus:border-gray-900/30 transition"
    ></select>
  </div>

  <div class="flex w-full flex-col gap-1">
    <label for="category" class="text-sm font-medium font-serif text-gray-800">
      Kategori:
    </label>
    <select
      id="category"
      class="w-96 p-2 rounded-md border border-gray-300
             focus:outline-none focus:ring-2 focus:ring-gray-900/20
             focus:border-gray-900/30 transition"
    ></select>
  </div>

  <div class="flex w-full flex-col gap-1">
    <label for="dateFound" class="text-sm font-medium font-serif text-gray-800">
      Dato og tidspunkt fundet:
    </label>
    <input
      id="dateFound"
      type="datetime-local"
      class="w-96 p-2 rounded-md border border-gray-300
             focus:outline-none focus:ring-2 focus:ring-gray-900/20
             focus:border-gray-900/30 transition"
    />
  </div>

  <button
    id="update-btn"
    class="px-6 py-2 mt-3 bg-black text-white rounded-md
           hover:bg-gray-800 transition"
  >
    Opdater
  </button>
  
  <button
    id="back-btn"
    type="button"
    class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
    Tilbage
</button>

  <div id="message-container" class="text-center text-sm mt-4"></div>

</form>

      </div>
    </div>
  `;

    document.querySelector("#back-btn").addEventListener("click", () => {
        history.back();
    });


    const placeSelect = document.querySelector("#place");

    placeSelect.innerHTML = `
    <option value="">Vælg fundested</option>
    <option value="Fransk sidelys">Fransk sidelys</option>
    <option value="Dansk sidelys">Dansk sidelys</option>
    <option value="Forhallen">Forhallen</option>
    <option value="Dansk kunst">Dansk kunst</option>
    <option value="Fransk kunst 1800-1870">Fransk kunst 1800–1870</option>
    <option value="Fransk kunst 1870-1925">Fransk kunst 1870–1925</option>
    <option value="Antikken">Antikken</option>
    <option value="Bag facaden">Bag facaden</option>
    <option value="Vinterhaven">Vinterhaven</option>
    <option value="Larsen stuen">Larsen stuen</option>
    <option value="Larsen 1. sal">Larsen 1. sal</option>
    <option value="Larsen 2. sal">Larsen 2. sal</option>
    <option value="Tagterrasse">Tagterrasse</option>
    <option value="Picnic">Picnic</option>
`;

    document.querySelector("#nav-container").appendChild(Navbar());

    await loadCategories();

    const categorySelect = document.querySelector("#category");
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.value;
        option.textContent = cat.displayName;
        categorySelect.appendChild(option);
    });

    const lostItem = await getLostItemById(lostItemId);

    document.querySelector("#name").value = lostItem.name;
    document.querySelector("#description").value = lostItem.description;
    document.querySelector("#place").value = lostItem.placeFound;
    document.querySelector("#category").value = lostItem.category;
    document.querySelector("#dateFound").value = lostItem.dateFound.slice(0,16);

    document.querySelector("#update-btn").addEventListener("click", async e => {
        e.preventDefault();

        const updateDTO = {
            name: document.querySelector("#name").value,
            description: document.querySelector("#description").value,
            placeFound: document.querySelector("#place").value,
            category: document.querySelector("#category").value,
            dateFound: document.querySelector("#dateFound").value
        };
        await updateLostItem(lostItemId, updateDTO)

        showMessage("Genstanden blev opdateret ✅");

    })

    function unmount() {
        document.querySelector("#app-main").innerHTML = "";
    }

    return unmount;

}