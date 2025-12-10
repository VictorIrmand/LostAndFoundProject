import {Navbar} from "../components/staff/Navbar.js";
import {allItems, loadAllItems} from "../../service/lostItemService.js";
import formatDate from "../../utility/formatDate.js";


export async function mount() {
    document.querySelector("#app-main").innerHTML = ` 
 
 <div id="nav-container"></div>
    <div class="w-full flex items-center justify-center">
<div class="w-2/3 flex flex-col justify-center items-center mt-4 ">

<!-- Page Title -->
<h1 class="text-3xl font-bold mb-6">Glemte ting – Lost & Found</h1>



<div class="flex items-end gap-6 mb-8 w-full justify-center border-[0.25px] border-gray-300 px-2 py-4 rounded-md">


  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Søg</label>
    <input
            type="text"
            placeholder="Søg efter genstand..."
            class="border rounded-md px-3 py-2 w-64"
    >
  </div>

  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Dato</label>
    <input
            type="date"
            class="border rounded-md px-3 py-2 w-48"
    >
  </div>

  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Kategori</label>
    <select class="border rounded-md px-3 py-2 w-56">
      <option>Alle kategorier</option>
      <option>Tøj</option>
      <option>Tasker & rygsække</option>
      <option>Elektronik</option>
      <option>Smykker</option>
      <option>Nøgler</option>
      <option>Punge & kort</option>
      <option>Briller</option>
      <option>Legetøj</option>
      <option>Dokumenter</option>
      <option>Diverse</option>
    </select>
  </div>


  <button class="px-5 py-2 border rounded-md h-[42px]">Søg</button>

</div>


<div class="grid grid-cols-3 gap-6 w-full mb-10" id="item-list">
 
</div>



</div>
</div>
 `

    document.querySelector("#nav-container").appendChild(Navbar());

    await loadAllItems();

    const itemList = document.querySelector("#item-list")


    function filterItems() {
        let items = allItems;


        console.log(items);
        return items;
    }

    if (allItems.length > 0) {
        filterItems().forEach(item => {
            const itemCard = document.createElement("div");
            itemCard.className =
                "border rounded-xl p-4 h-48 flex flex-col justify-between border-gray-300 hover:shadow-md transition";

            itemCard.innerHTML = `
    <div class="font-medium text-lg">${item.name}</div>
    <div>${item.description}</div>
    <div>${item.isReturned ? `Udleveret` :`Ikke udleveret`}</div>
    <div class="text-sm text-gray-500">
        Fundet: ${formatDate(item.dateFound)}
    </div>
`;
            itemList.appendChild(itemCard)
        })
    }


    return () => {
    }
}