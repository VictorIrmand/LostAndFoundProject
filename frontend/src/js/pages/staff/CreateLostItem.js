import {createLostItem, loadCategories} from "../../service/lostItemService.js";
import {currentUser} from "../../service/authService.js";
import {categories} from "../../service/lostItemService.js";
import {Navbar} from "../components/staff/Navbar.js";
import {showMessage} from "../../utility/Message.js";

export async function mount() {
    /* language=HTML */

    document.querySelector("#app-main").innerHTML = `

        <div id="nav-container">

        </div>

        <div class="create-page flex flex-col items-center gap-3 mt-2 font-serif font-semibold">


        <h1 class="text-lg font-normal opacity-60">Lost & Found – Register genstand</h1>

            <div class="w-fit flex p-2 flex-col bg-gray-300 rounded-md">
                <form class="flex flex-col gap-1">


                <div class="flex w-full flex-col gap-1">
                        <label for="name" class="text-sm font-medium font-serif text-gray-800">
                            Navn på genstand (ingen beskrivelser):
                        </label>

                        <input
                                id="name"
                                type="text"
                                placeholder="Eks: pung, iPhone, taske ..."
                                required
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
                                placeholder="Eks: Rød pung, iPhone 15, Gucci taske"
                                required
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
                                required
                                class="w-96 p-2 rounded-md border border-gray-300
               focus:outline-none focus:ring-2 focus:ring-gray-900/20
               focus:border-gray-900/30 transition"
                        >
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
                        </select>
                    </div>


                    <div class="flex w-full flex-col gap-1">
                        <label for="category" class="text-sm font-medium font-serif text-gray-800">
                            Kategori:
                        </label>

                        <select
                                id="category"
                                required
                                class="w-96 p-2 rounded-md border border-gray-300
               focus:outline-none focus:ring-2 focus:ring-gray-900/20
               focus:border-gray-900/30 transition"
                        >
                            <option value="">Vælg Kategori</option>
                        </select>
                    </div>

                    <div class="flex w-full flex-col gap-1">
                        <label for="dateFound" class="text-sm font-medium font-serif text-gray-800">
                            Dato og tidspunkt fundet:
                        </label>

                        <input
                                id="dateFound"
                                type="datetime-local"
                                required
                                class="w-96 p-2 rounded-md border border-gray-300
               focus:outline-none focus:ring-2 focus:ring-gray-900/20
               focus:border-gray-900/30 transition"
                        />
                    </div>

                    <div class="flex w-full items-center justify-center">
                        <button
                                id="create-btn"
                                type="submit"
                                class="px-6 py-2 mt-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                        >
                            Opret
                        </button>
                    </div>



                    <div id="message-container" class="text-center text-sm mt-4"></div>

                </form>
            </div>
        </div>

    `

    await loadCategories();

    document.querySelector("#nav-container").appendChild(Navbar());

    const categorySelect = document.getElementById("category");

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.value;
        option.textContent = cat.displayName;
        categorySelect.appendChild(option);
    });

    const createbtn = document.querySelector("#create-btn");

    createbtn.addEventListener("click", async e => {
        e.preventDefault();

        const name = document.querySelector("#name").value;
        const description = document.querySelector("#description").value;
        const placeFound = document.querySelector("#place").value;
        const category = document.querySelector("#category").value;
        const dateFound = document.querySelector("#dateFound").value;

        const createLostItemDTO = {
            user: currentUser.id,
            name: name,
            description: description,
            placeFound: placeFound,
            category: category,
            dateFound: dateFound
        }
        await createLostItem(createLostItemDTO);
    });


    function unmount() {
        document.querySelector("#app-main").innerHTML = "";
    }

    return unmount;


}