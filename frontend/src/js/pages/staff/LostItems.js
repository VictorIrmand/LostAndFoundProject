import {Navbar} from "../components/staff/Navbar.js";
import {allItems, categories, filterItems, loadAllItems, loadCategories} from "../../service/lostItemService.js";
import formatDate from "../../utility/formatDate.js";
import {navigate} from "../../utility/router.js";


export async function mount() {
    document.querySelector("#app-main").innerHTML = ` 
 
 <div id="nav-container"></div>
    <div class="w-full flex items-center justify-center">
<div class="w-full flex flex-col justify-center items-center mt-4 ">

<!-- Page Title -->
<h1 class="text-3xl font-bold mb-6">Glemte ting – Lost & Found</h1>



<div class="flex flex-col items-center gap-6 mb-8 w-3/5 justify-center border-[0.25px] border-gray-300 px-2 py-4 rounded-md">



  
<div class="flex flex-row gap-5 justify-center items-center">
  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Dato fundet</label>
    <input
            type="date"
            class="border rounded-md px-3 py-2 w-48"
            id="date-input"
    >
  </div>

  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Kategori</label>
    <select class="border rounded-md px-3 py-2 w-56" id="category-select">
       <option value="">Alle kategorier</option>
    </select>
  </div>
  
    <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Er fundet?</label>
    <select class="border rounded-md px-3 py-2 w-30" id="is-found-select">
    <option value="">Alle genstande</option>
      <option value="false">Ikke fundet</option>
      <option value="true">Fundet</option>
      
    </select>
  </div>
  
  </div>
<div class="flex flex-row justify-center items-center gap-5">
  <div class="flex flex-col">
    <input
            type="text"
            placeholder="Søg efter navn eller ID..."
            class="border rounded-md px-3 py-2 w-64"
            id="search-input"
    >
  </div>
  <div class="flex flex-col">
  
  <button class="px-5 py-2 border rounded-md h-[42px]">Søg</button>
  </div>
</div>
</div>


<div class="grid grid-cols-3 gap-6 w-3/5 mb-10 border-gray-300 rounded md border-[0.25px] p-4" id="item-list">
 
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
    const isFoundSelect = document.querySelector("#is-found-select")
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
    isFoundSelect.addEventListener("change", (e) => {
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
        let isFoundSelectValue = isFoundSelect.value;
        let searchInputValue = searchInput.value;
        itemList.innerHTML = ``;

        if (allItems.length > 0) {
            let filteredItems = filterItems(allItems, dateInputValue, categorySelectValue, isFoundSelectValue, searchInputValue)


            if (filteredItems.length > 0) {

                filteredItems.forEach(item => {
                    const itemCard = document.createElement("div");
                    itemCard.className =
                        "border rounded-xl p-4 h-48 flex flex-col justify-between border-gray-300 hover:shadow-md transition cursor-pointer";

                    itemCard.innerHTML = `
<div class="flex flex-row justify-between">
    <p class="font-medium text-lg">${item.name}</p>
    <p class="font-medium text-lg text-gray-500">${item.id}</p>
    </div>
    <div>${item.description.substring(0, 15) + "..."}</div>
    <div>${item.isReturned ? `Udleveret` : `Ikke udleveret`}</div>
    <div class="text-sm text-gray-500">
        Fundet: ${formatDate(item.dateFound)}
    </div>  
`
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