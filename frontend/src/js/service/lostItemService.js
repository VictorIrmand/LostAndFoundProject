import {apiDeleteJson, apiGetJson, apiPostJson, apiPutJson} from "../utility/api.js";
import {showMessage} from "../pages/components/staff/Message.js";
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

    const response = await apiPostJson("/api/lost-items", createLostItemDTO);

    if (response.ok) {
        await loadAllItems();
        await loadUnreturnedItems();
        await generateItemLabelPdf(response.data)
        showMessage("Tabt genstand er oprettet korrekt.", "info")
    } else {
       console.log("Fejl ved registrering af mistet genstand");
        return;
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
    const res = await apiGetJson("/api/lost-items/categories")

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
    } else {
        console.log("Sletning af genstand med ID: " + id + " fejlede.")
    }
}

export async function updateLostItem(id, updateDTO) {
    const res = await apiPutJson(`/api/lost-items/${id}`,updateDTO)

    if (res.ok) {
        await loadAllItems();
        await loadUnreturnedItems();
        await generateItemLabelPdf(res.data)
        await navigate(`/staff/lost-items/${id}`);
        showMessage("Genstand med id " + id + " er blevet opdateret", "info")
    }
}


export async function handoutItem(dto) {
    const res = await apiPutJson("/api/lost-items/handout", dto);

    if (res.ok) {
        await loadAllItems();
        await loadUnreturnedItems();

        showMessage("Genstand med ID: " + dto.lostItem + " er nu udleveret.");
    } else {
        console.log("Udlevering af genstand med ID: " + dto.lostItem + " fejlede.")
    }

    return res;

}


export function filterItems(list, dateInputValue = "", categorySelectValue = "", isFoundSelectValue = "", searchInputValue = "") {
    let items = [...list]; // som udgangspunkt så ændrer jeg ikke på originalen, da filter altid reassigner
    // men hvis man f.esk. bruger push eller splice, så vil spreading altså en shallow copy af originalen være et beskyttelseslag,
    // således at originalen ikke bliver ændret.

    if (dateInputValue && dateInputValue.trim() !== "") {
        // mismatch mellem frontend der er ddd --- mmm --- yy og entiten har ISO format som også er timer og minutter.
        items = items.filter(item => item.dateFound.split("T")[0] === dateInputValue);
    }

    if (categorySelectValue && categorySelectValue.trim() !== "") {
        items = items.filter(item => item.category === categorySelectValue)
    }

    if (isFoundSelectValue && isFoundSelectValue.trim() !== "") {
        items = items.filter(item => {
            if (isFoundSelectValue === "false") {
                return !item.isFound
            } else {
                return item.isFound;
            }
        })
    }

    if (searchInputValue && searchInputValue.trim() !== "") {
        const s = searchInputValue.toLowerCase().trim();

        items = items.filter(item =>
            item.name.toLowerCase().includes(s) ||
            item.id === searchInputValue
        );
    }


    console.log(items);
    return items;
}