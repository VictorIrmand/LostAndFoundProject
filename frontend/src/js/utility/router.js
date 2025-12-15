import {currentUser} from "../service/authService.js";

export const routes = {
    "/": () => import("../pages/public/StartPage.js"),
    "/lost-items": () => import("../pages/public/LostItems.js"),

    // staff:
    "/login": () => import("../pages/staff/LoginPage.js"),
    "/staff/lost-items/new": () => import("../pages/staff/CreateLostItem.js"),
    "/staff/lost-items": () => import("../pages/staff/LostItems.js"),
    "/staff/lost-items/:id": () => import("../pages/staff/ViewLostItem.js"),
    "/staff": () => import("../pages/staff/DashBoard.js"),
    "/staff/users": () => import("../pages/staff/ManageUsers.js"),
    "/staff/lost-items/handout/:id": () => import("../pages/staff/HandOutItem.js"),
    "/staff/update/lost-items/:id": () => import ("../pages/staff/updateLostItem.js")
};

// currentUnmount bliver returneret i mount og gør at en side fjerner sig selv.
let currentUnmount = null;

export async function route(path = location.pathname) {
    console.log("Routing to:", path);

    // findes currentUnmount, så kør den.
    currentUnmount?.();

    // den finder det module vi skal bruge baseret på location.pathname.
    let moduleLoader = routes[path];

    if (!moduleLoader) {
        if (path.startsWith("/staff/lost-items/handout/")) {
            moduleLoader = routes["/staff/lost-items/handout/:id"];
        } else if (path.startsWith("/staff/update/lost-items")) {
            moduleLoader = routes["/staff/update/lost-items/:id"]
        } else if (path.startsWith("/staff/lost-items/")) {
            moduleLoader = routes["/staff/lost-items/:id"];
        } else {
            console.error("Route not found:", path);
            return currentUser
                ? navigate("/staff")
                : navigate("/")
        }
    }

// er async, da det kan tage tid at indlæse et modul.
    const module = await moduleLoader();

// hvis at et modul har en mount funktion, så gør tag dens returværdi og sæt til unmount.
    if (typeof module.mount === "function") {

        console.log("Kalder mount() for: ", path);
        currentUnmount = await module.mount(); // tager returværdien af modulets mount som er en unmount.
    } else { // findes der ikke en mount funktion så skal unmount blive null igen.
        currentUnmount = null;
        console.error("No mount() in module:", path);
        return navigate("/")
    }
}

// manipulerer url og kører mount. bruges når man skal navigere i appen.
export async function navigate(path) {
    console.log("navigate KALDT med:", path);
    if (location.pathname === path) {
        console.log("Er allerede på: ", path, " -> vi skipper navigate");
    } else {
        console.log("Vi skifter url til: ", path);
        history.pushState("", "", path);// ændrer url.
        await route(path); // kalder route og indlæser det rigtige modul.
    }
}

// når man trykker frem og tilbage, så vil man få den sidste side i historikken.
window.addEventListener("popstate", async (e) => {
    e.preventDefault();
    await route(location.pathname, e.state);
})


