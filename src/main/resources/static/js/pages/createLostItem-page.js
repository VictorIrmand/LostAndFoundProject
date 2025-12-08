import {createLostItem} from "../service/LostItem-service.js";
import {apiGetJson} from "../utility/api.js";


export async function mount() {

    /* language=HTML */

    document.querySelector("#app-main").innerHTML = `

        <div class="create-page">
            <div class="create-form">

                <div class="create-group">
                    <label for="name">Name:</label>
                    <input id="name" type="text" required>
                </div>

                <div class="create-group">
                    <label for="description">Beskrivelse:</label>
                    <input id="description" type="text" required>
                </div>

                <div class="create-group">
                    <label for="isFound">Er genstanden blevet hentet?:</label>
                    <input id="isFound" type="checkbox">
                </div>

                <div class="create-group">
                    <label for="place">Choose activities:</label>
                    <select id="place" required>
                        <option value="">Vælg fundested</option>
                        <option value="1">Fransk sidelys</option>
                        <option value="2">Dansk sidelys</option>
                        <option value="3">Forhallen</option>
                        <option value="4">Dansk kunst</option>
                        <option value="5">Fransk kunst 1800–1870</option>
                        <option value="6">Fransk kunst 1870–1925</option>
                        <option value="7">Antikken</option>
                        <option value="8">Bag facaden</option>
                        <option value="9">Vinterhaven</option>
                        <option value="10">Larsen stuen</option>
                        <option value="11">Larsen 1. sal</option>
                        <option value="12">Larsen 2. sal</option>
                        <option value="13">Tagterrasse</option>
                        <option value="14">Picnic</option>
                    </select>
                </div>

                <div class="create-group">
                    <label for="category">Kategori:</label>
                    <select id="category" required>
                    </select>
                </div>

                <button id="create-btn" type="submit">Opret</button>
                <div class="message-container"></div>

            </div>
        </div>

    `

    const categories = await apiGetJson("api/lostitem/category")

    function renderName(enumName) {
        return enumName
            .toLowerCase()
            .replaceAll("_", " ")
            .replace(/(^\w| \w)/g, c => c.toUpperCase());
    }

    const categorySelect = document.getElementById("category");

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = renderName(cat);
        categorySelect.appendChild(option);
    });

    const createbtn = document.querySelector("#create-btn");

    createbtn.addEventListener("click", async e => {
        e.preventDefault();

        const name = document.querySelector("#name").value;
        const description = document.querySelector("#description").value;
        const isFound = document.querySelector("#isFound").checked;
        const place = document.querySelector("#place").value;
        const category = document.querySelector("#category").value;

        const lostItemDTO = {
            name: name,
            description: description,
            isFound: isFound,
            place: place,
            category: category
        }
        await createLostItem(lostItemDTO);

    });


    function unmount() {
        document.querySelector("#app-main").innerHTML = "";
    }

    return unmount;


}