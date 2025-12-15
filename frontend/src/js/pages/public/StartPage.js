import {navigate} from "../../utility/router.js";

export function mount() {
    document.querySelector("#app-main").innerHTML = `
<div class="flex items-center justify-between border-b p-4 mb-8">
    <div class="text-3xl font-bold">Glyptoteket</div>

    <nav class="flex gap-8 text-lg">
        <a class="font-medium underline">Besøg</a>
        <a>Udstillinger</a>
        <a>Det sker</a>
        <a>Om museet</a>
    </nav>

    <div class="flex items-center gap-4">
        <div class="flex items-center justify-center w-8 h-8 border rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-5 w-5 text-gray-500"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke-width="2"
                 stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
            </svg>
        </div>
        <button class="px-4 py-2 border rounded-full">Billetter</button>
        <button class="px-4 py-2 border rounded-full">Årskort</button>
    </div>
</div>

<div class="grid grid-cols-3 gap-12 ml-6">

    <!-- Venstre kolonne -->
    <div class="text-xl">
        <div class="font-medium mb-4">Besøg</div>
        <ul class="space-y-2">
            <li>Åbningstider</li>
            <li>Billetter</li>
            <li>Årskort</li>
            <li>Picnic – Café</li>
            <li>Museumsbutik</li>
            <li>Besøg med børn</li>
            <li>Grupper</li>
            <li>Skoler</li>
            <li>Særlige behov og tilgængelighed</li>
            <li>Transport og parkering</li>
            <li class="hover:text-gray-400 cursor-pointer transition" id="link">Glemte ting - Lost & Found</li>
        </ul>
    </div>

    <!-- Midterkolonne -->
    <div></div>

    <!-- Højre kolonne -->
    <div class="border rounded-xl h-96 flex items-end p-4 mr-5">
        <div class="flex justify-between w-full">
            <div>Årskort</div>
            <div class="w-10 h-10 border rounded-full"></div>
        </div>
    </div>

</div>
    `;



    document.querySelector("#link").addEventListener("click",async () => navigate("/lost-items"));



}
