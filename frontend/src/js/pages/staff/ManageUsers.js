import {Navbar} from "../components/staff/Navbar.js";

export function mount () {
    document.querySelector("#app-main").innerHTML = `
    <div id="nav-container"></div>
    <p>Users</p>
    `

    document.querySelector("#nav-container").appendChild(Navbar());
    return () => {}
}