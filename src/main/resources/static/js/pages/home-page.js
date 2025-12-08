import {navigate} from "../utility/router.js";


export function mount() {
    /* language=HTML */
    document.querySelector("#app-main").innerHTML = `
        <div class="home-page">
            <button class="create-lostItem">Opret tabt genstand</button>
        </div>
        
        `
    console.log("home-page mounted");
    console.log("HTML i #app-main:", document.querySelector("#app-main").innerHTML);


    const createBtn = document.querySelector(".create-lostItem");
    console.log("createBtn fundet:", createBtn);

    createBtn.addEventListener("click", e => {
        navigate("/createLostItem")
    })

    return () => {
        document.querySelector("#app-main").innerHTML = "";
    }
}