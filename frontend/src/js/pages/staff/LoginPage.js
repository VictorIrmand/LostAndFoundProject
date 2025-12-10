import {login} from "../../service/authService.js";
import {navigate} from "../../utility/router.js";

export function mount() {

    document.querySelector("#app-main").innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center bg-white px-6">

        <h1 class="text-4xl font-serif font-semibold text-[#2c2c2c] text-center leading-tight mb-8">
            Glyptoteket<br>
            <span class="text-lg font-normal opacity-60">Lost & Found</span>
        </h1>

        <div class="w-full max-w-sm bg-white border border-[#e5e1da] shadow-sm rounded-md p-8">

<form id="login-form">
            <div class="mb-5">
                <label for="username" class="block mb-2 text-sm font-medium text-[#3a3a3a] font-serif">
                    Brugernavn eller e-mail
                </label>
                <input 
                    id="username"
                    type="text"
                    class="w-full px-3 py-2 border border-[#c8c3b9] rounded-md bg-[#faf9f7] focus:outline-none focus:ring-1 focus:ring-black"
                >
            </div>

            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-[#3a3a3a] font-serif">
                    Password
                </label>
                <input 
                    id="password"
                    type="password"
                    class="w-full px-3 py-2 border border-[#c8c3b9] rounded-md bg-[#faf9f7] focus:outline-none focus:ring-1 focus:ring-black"
                >
            </div>

            <button 
                type="submit"
                class="w-full py-2.5 bg-[#3b3a36] hover:bg-[#2d2c29] text-white rounded-md transition font-medium tracking-wide"
            >
                Login
            </button>
            </form>

            <div id="message-container" class="text-center text-sm mt-4 text-red-700"></div>

        </div>
        <div class="w-full max-w-sm flex items-center justify-center">
<button 
                type="submit"
                id="back"
                class="w-fit p-2 mt-5  py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition font-medium tracking-wide"
            >
                Tilbage
            </button>
            </div>
    </div>
`;


    document.querySelector("#login-form").addEventListener("submit", async (e) => {
        e.preventDefault(); // form reloader siden normalt. det skal stoppes
        const username = document.querySelector("#username").value;

        const rawPassword = document.querySelector("#password").value;

        const loginRequestDTO = {
            username: username,
            rawPassword: rawPassword
        }

        await login(loginRequestDTO)
    });

    document.querySelector("#back").addEventListener("click", async (e) => await navigate("/"))
}
