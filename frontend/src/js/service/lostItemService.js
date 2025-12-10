import {apiDeleteJson, apiGetJson, apiPostJson} from "../utility/api.js";
import {showMessage} from "../utility/message.js";
import {navigate} from "../utility/router.js";
import {getDisplayName} from "../utility/getDisplayName.js";
import {generateItemLabelPdf} from "../pages/staff/GenerateItemLabelPDF.js";

export let unreturnedItems = null;
export let allItems = null;
export let categories = null;



// bruges til public
export async function loadUnreturnedItems() {

    const res = await apiGetJson("/api/lost-items/public");

    res.ok ? unreturnedItems = res.data : unreturnedItems = [];

}

// kan kun bruges af staff

export async function loadAllItems() {

    const res = await apiGetJson("/api/lost-items");

    res.ok ? allItems = res.data : allItems = [];

    console.log(allItems);

}

export async function createLostItem(createLostItemDTO) {

    const response = await apiPostJson("/api/lost-items",createLostItemDTO);

    if (!response) {
        console.log("Error when creating lost item.");
        return;
    }

    if (response.ok) {
        await loadAllItems();
        await loadUnreturnedItems();
        await generateItemLabelPdf(response.data)
        showMessage("Tabt genstand er oprettet korrekt.", "info")
    }

}

export async function getLostItemById(id) {
    const response = await apiGetJson(`/api/lost-items/${id}`);

    if (!response) {
        console.log("Failed to view lost item with ID: " + id);
        return;
    }

    return response.data;
}

// bruges af alle
// laver et kategori objekt med både value og displayName.
export async function loadCategories() {
    const res = await apiGetJson("/api/lost-items/category")

    if (res.ok) {
        categories = res.data.map(category => {
            return {value: category, displayName: getDisplayName(category)}
        })
    } else {
        categories = [];
    }
}

export async function deleteItem(id) {
    const res = await apiDeleteJson(`/api/lost-items/${id}`);


    if (res.ok) {
        await loadAllItems();
        await loadUnreturnedItems();
        await navigate("/staff/lost-items");
        showMessage("Genstand med ID: " + id + " er nu slettet.");
    }
    else {
        console.log("Sletning af genstand med ID: " + id + " fejlede.")
    }


}