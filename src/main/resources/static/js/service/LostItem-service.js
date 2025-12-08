import {apiPostJson} from "../utility/api.js";
import {showMessage} from "../utility/message.js";
import {navigate} from "../utility/router.js";


export async function createLostItem(lostItemDTO) {

    const response = await apiPostJson("/api/lostitem/lostitem",lostItemDTO);

    if (!response) return;

    if (response.ok) {
        showMessage("Tabt genstand er oprettet korrekt.", "info")
        navigate("/home")
    }

}