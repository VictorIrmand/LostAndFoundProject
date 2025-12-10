import './index.css'
import {currentUser, loadCurrentUser} from "./js/service/authService.js";
import {navigate, route} from "./js/utility/router.js";



document.addEventListener("DOMContentLoaded", async () => {
    if(location.pathname.startsWith("/staff")) {
    await loadCurrentUser();

    if (!currentUser) {
        await navigate("/login");
    }
    }
    console.log("Current user loaded: ", currentUser ? currentUser : "No user loaded.");

    await route(location.pathname)
})
