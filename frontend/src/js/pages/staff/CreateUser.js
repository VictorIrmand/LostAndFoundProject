
import {Navbar} from "../components/staff/Navbar.js";
import {createUser} from "../../service/userService.js";
import {showMessage} from "../components/staff/Message.js";


export async function mount() {
    /* language=HTML */

    document.querySelector("#app-main").innerHTML = `

        <div id="nav-container">

        </div>

        <div class="create-page flex flex-col items-center gap-3 mt-2 font-serif font-semibold">


        <h1 class="text-lg font-normal opacity-60">Lost & Found – Registrer ny medarbejder</h1>

            <div class="w-fit flex p-2 flex-col bg-gray-300 rounded-md">
                <form class="flex flex-col gap-1">


                <div class="flex w-full flex-col gap-1">
                        <label for="username" class="text-sm font-medium font-serif text-gray-800">
                            Brugernavn:
                        </label>

                        <input
                                id="username"
                                type="text"
                                placeholder="Vælg et brugernavn..."
                                required
                                class="w-96 p-2 rounded-md border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-gray-900/20 
               focus:border-gray-900/30 transition"
                        />
                    </div>
                    
                    
                    <div class="flex w-full flex-col gap-1">
                        <label for="firstname" class="text-sm font-medium font-serif text-gray-800">
                            Fornavn:
                        </label>

                        <input
                                id="firstname"
                                type="text"
                                placeholder="Fornavn på medarbejder..."
                                required
                                class="w-96 p-2 rounded-md border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-gray-900/20 
               focus:border-gray-900/30 transition"
                        />
                    </div>
                    
                    <div class="flex w-full flex-col gap-1">
                        <label for="lastname" class="text-sm font-medium font-serif text-gray-800">
                            Efternavn:
                        </label>

                        <input
                                id="lastname"
                                type="text"
                                placeholder="Efternavn på medarbejder..."
                                required
                                class="w-96 p-2 rounded-md border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-gray-900/20 
               focus:border-gray-900/30 transition"
                        />
                    </div>

            
                    
                    <div class="flex w-full flex-col gap-1">
                        <label for="role" class="text-sm font-medium font-serif text-gray-800">
                            Rolle:
                        </label>

                        <select
                                id="role"
                                required
                                class="w-96 p-2 rounded-md border border-gray-300
               focus:outline-none focus:ring-2 focus:ring-gray-900/20
               focus:border-gray-900/30 transition"
                        >
                            <option value="">Vælg rolle</option>
                            <option value="STAFF">Medarbejder</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div class="flex w-full flex-col gap-1">
                        <label for="password" class="text-sm font-medium font-serif text-gray-800">
                            Adgangskode:
                        </label>

                        <input
                                id="password"
                                type="password"
                                placeholder="Vælg en adgangskode..."
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


    document.querySelector("#nav-container").appendChild(Navbar());


   async function handleCreate() {
       let role = document.querySelector("#role").value;

       if (role.trim() === "") {
           showMessage("Medarbejder skal tildeles en rolle", "error");
           return;
       }

       let username = document.querySelector("#username").value.trim();
       let firstName = document.querySelector("#firstname").value.trim();
       let lastName = document.querySelector("#lastname").value.trim();
       let password = document.querySelector("#password").value;

        const createUserDTO = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            role: role,
            rawPassword: password
        }

        await createUser(createUserDTO);
    }

    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await handleCreate();
    });

    function unmount() {
        document.querySelector("#app-main").innerHTML = "";
    }

    return unmount;


}