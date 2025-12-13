import {navigate} from "../../utility/router.js";
import {
    categories,
    filterItems,
    loadCategories, loadUnreturnedItems,
    unreturnedItems
} from "../../service/lostItemService.js";
import formatDate from "../../utility/formatDate.js";
import {getDisplayName} from "../../utility/getDisplayName.js";

export async function mount () {
    document.querySelector("#app-main").innerHTML = ` 
<div class="flex items-center justify-between border-b p-4 mb-8 ju">
    <div class="text-3xl font-bold">Glyptoteket</div>

    <nav class="flex gap-8 text-lg">
        <a id="public-nav" class="font-medium underline cursor-pointer">Besøg</a>
        <a>Udstillinger</a>
        <a>Det sker</a>
        <a>Om museet</a>
    </nav>

    <div class="flex items-center gap-4">
        <div class="flex items-center justify-center w-8 h-8 border rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-5 w-5 text-gray-500"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke-width="2"
                 stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
            </svg>
        </div>
        <button class="px-4 py-2 border rounded-full">Billetter</button>
        <button class="px-4 py-2 border rounded-full">Årskort</button>
        <button class="px-4 py-2 border rounded-full hover:scale-95 transition" id="loginBtn">Login</button>
    </div>
</div>

<div class="w-full flex items-center justify-center">
<div class="w-full flex flex-col justify-center items-center">
<p class="text-sm  mb-2">Glyptoteket -> Besøg -> Lost & Found</p>

<!-- Page Title -->
<h1 class="text-3xl font-bold mb-6">Glemte ting – Lost & Found</h1>

<!-- Intro -->
<p class="text-lg max-w-2xl mb-8 text-center">
  Her kan du se en oversigt over ting, der er blevet fundet på Glyptoteket.
  Hvis du har mistet en genstand, bedes du henvende dig i receptionen med korrekt beskrivelse og billed-id, for at få den udleveret.
</p>


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


    document.querySelector("#loginBtn").addEventListener("click",async () => navigate("/login"));

document.querySelector("#public-nav").addEventListener("click", () => navigate("/"));

    if (categories === null) {
        await loadCategories();
    }

    const categorySelect = document.getElementById("category-select");

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.value;
        option.textContent = cat.displayName;
        categorySelect.appendChild(option);
    });

    // sikrer at den ikke bliver ved med at fetche hvis den allerede har fetched én gang.
    if (unreturnedItems === null || unreturnedItems.length < 1) {
        await loadUnreturnedItems();
    }

    const itemList = document.querySelector("#item-list")
    const dateInput = document.querySelector("#date-input")

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

    searchInput.addEventListener("input", (e) => {
        e.preventDefault();
        loadItemCards()
    })




    function loadItemCards() {

        let dateInputValue = dateInput.value;
        let categorySelectValue = categorySelect.value;

        let searchInputValue = searchInput.value;
        itemList.innerHTML = ``;

        if (unreturnedItems.length > 0) {
            let filteredItems = filterItems(unreturnedItems, dateInputValue, categorySelectValue, "", searchInputValue)


            if (filteredItems.length > 0) {

                filteredItems.forEach(item => {
                    const itemCard = document.createElement("div");
                    itemCard.className =
                        "border rounded-xl p-4 h-48 flex flex-col justify-between border-gray-300 hover:shadow-md transition cursor-pointer";

                    // language=HTML
                    itemCard.innerHTML = `
<div class="flex flex-row justify-between">
    <p class="font-medium text-lg">${item.name}</p>
    </div>
<div>
    <p class="font-medium text-m ">Afdeling fundet:</p>
    <p class="font-medium text-m text-gray-500">${item.placeFound}</p>
</div>
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