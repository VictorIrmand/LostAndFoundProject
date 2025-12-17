import {Navbar} from "../components/staff/Navbar.js";
import {allItems, categories, filterItems, loadAllItems, loadCategories} from "../../service/lostItemService.js";
import formatDate from "../../utility/formatDate.js";
import {navigate} from "../../utility/router.js";


export async function mount() {
    document.querySelector("#app-main").innerHTML = ` 
 
 <div id="nav-container"></div>

<div class="w-full flex justify-center">
  <div class="w-full max-w-5xl flex flex-col items-center mt-4">

    <!-- Page Title -->
    <h1 class="text-3xl font-bold mb-6">
      Glemte ting – Lost & Found
    </h1>

    <!-- Filters -->
    <div
      class="w-fit flex flex-col gap-2 mb-8 bg-gray-50 px-6 py-4 rounded-md"
    >

      <!-- Row 1 -->
      <div class="flex gap-5 justify-center">

        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1">Dato fundet</label>
          <input
            type="date"
            id="date-input"
            class="border rounded-md px-3 py-2 w-48"
          >
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1">Kategori</label>
          <select
            id="category-select"
            class="border rounded-md px-3 py-2 w-56"
          >
            <option value="">Alle kategorier</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1">Er udleveret?</label>
          <select
            id="is-returned-select"
            class="border rounded-md px-3 py-2 w-48"
          >
            <option value="">Alle genstande</option>
            <option value="true">Er udleveret</option>
            <option value="false">Ikke udleveret</option>
          </select>
        </div>

      </div>

      <!-- Row 2 -->
      <div class="flex gap-5 justify-center items-end">
       
        <div class="flex flex-col">
          <label class="text-sm font-medium mb-1">Søg</label>
          <input
            type="text"
            id="search-input"
            placeholder="Søg efter navn eller ID..."
            class="border rounded-md px-3 py-2 w-64 h-[42px]"
          >
        </div>

        <button
          class="px-5 py-2 border rounded-md h-[42px] bg-gray-200 hover:bg-gray-300 transition"
        >
          Søg
        </button>

      </div>

    </div>

    <!-- Item list -->
    <div
      id="item-list"
      class="grid grid-cols-3 gap-6 w-full mb-10  bg-gray-50 rounded-md p-4"
    >
    </div>

    <div id="message-container" class="text-center text-sm mt-1"></div>

  </div>
</div>

 `

    if (categories === null) {
        await loadCategories();
    }
    document.querySelector("#nav-container").appendChild(Navbar());

    const categorySelect = document.getElementById("category-select");

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.value;
        option.textContent = cat.displayName;
        categorySelect.appendChild(option);
    });

    // sikrer at den ikke bliver ved med at fetche hvis den allerede har fetched én gang.
    if (allItems === null || allItems.length < 1) {
        await loadAllItems();
    }

    const itemList = document.querySelector("#item-list")
    const dateInput = document.querySelector("#date-input")
    const isReturnedSelect = document.querySelector("#is-returned-select")
    const searchInput = document.querySelector("#search-input");


    // filter eventlisteners.
    categorySelect.addEventListener("change", (e) => {
        e.preventDefault();
        console.log(itemList)
        loadItemCards()
    })
    dateInput.addEventListener("change", (e) => {
        e.preventDefault();
        loadItemCards()
    })
    isReturnedSelect.addEventListener("change", (e) => {
        e.preventDefault();
        loadItemCards()
    })
    searchInput.addEventListener("input", (e) => {
        e.preventDefault();
        loadItemCards()
    })


    function loadItemCards() {

        let dateInputValue = dateInput.value;
        let categorySelectValue = categorySelect.value;
        let isReturnedSelectValue = isReturnedSelect.value;
        let searchInputValue = searchInput.value;
        itemList.innerHTML = ``;

        if (allItems.length > 0) {
            let filteredItems = filterItems(allItems, dateInputValue, categorySelectValue, isReturnedSelectValue, searchInputValue)


            if (filteredItems.length > 0) {

                filteredItems.forEach(item => {
                    const itemCard = document.createElement("div");
                    itemCard.className =
                        "border rounded-xl p-4 h-48 flex flex-col justify-between border-gray-300 bg-gray-100 hover:shadow-md hover:bg-gray-200 transition cursor-pointer";

                    itemCard.innerHTML = `
  <div class="flex justify-between items-start">
    <div>
      <p class="font-semibold text-lg">${item.name}</p>
      <p class="text-sm text-gray-500">ID: ${item.id}</p>
    </div>

    <span
      class="text-xs px-2 py-1 rounded-full ${
                        item.isReturned
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                    }"
    >
      ${item.isReturned ? "Udleveret" : "Ikke udleveret"}
    </span>
  </div>

  <p class="text-sm text-gray-700 mt-2">
    ${item.description.length > 60
                        ? item.description.substring(0, 60) + "..."
                        : item.description}
  </p>

  <div class="text-sm text-gray-500 mt-3 space-y-1">
    <div>
      <span class="font-medium">Lokation:</span> ${item.placeFound}
    </div>
    <div>
      <span class="font-medium">Dato fundet:</span> ${formatDate(item.dateFound)}
    </div>
  </div>
`;
                    itemCard.addEventListener("click", async () => await navigate(`/staff/lost-items/${item.id}`))
                    itemList.appendChild(itemCard)
                })
            } else {
                const itemCard = document.createElement("div");
                itemCard.className =
                    "border rounded-xl p-4 h-48 flex flex-col justify-between border-gray-300 hover:shadow-md transition";

                itemCard.innerHTML = `
<div class="flex flex-row justify-between">
    <p class="font-medium text-lg">Ingen genstande matchede søgeresultatet.</p>
  
    </div>
 
`
                itemList.appendChild(itemCard)
            }
        } else {
            const itemCard = document.createElement("div");
            itemCard.className =
                "border rounded-xl p-4 h-48 flex flex-col justify-between border-gray-300 hover:shadow-md transition cursor-pointer";

            itemCard.innerHTML = `
<div class="flex flex-row justify-center items-center">
    <p class="font-medium text-lg">Der er på nuværende tidspunkt ingen genstande på Lost & Found hylden.</p>
    
`;
            itemList.appendChild(itemCard)
        }

    }

    loadItemCards();
    return () => {
    }
}