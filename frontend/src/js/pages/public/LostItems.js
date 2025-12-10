import {navigate} from "../../utility/router.js";

export function mount () {
    document.querySelector("#app-main").innerHTML = ` 
<div class="flex items-center justify-between border-b p-4 mb-8 ju">
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
        <button class="px-4 py-2 border rounded-full hover:scale-95 transition" id="loginBtn">Login</button>
    </div>
</div>

<div class="w-full flex items-center justify-center">
<div class="w-2/3 flex flex-col justify-center items-center ">
<p class="text-lg max-w-2xl mb-8">Glyptoteket -> Besøg -> Lost & Found</p>

<!-- Page Title -->
<h1 class="text-3xl font-bold mb-6">Glemte ting – Lost & Found</h1>

<!-- Intro -->
<p class="text-lg max-w-2xl mb-8 text-center">
  Her kan du se en oversigt over ting, der er blevet fundet på Glyptoteket.
  Hvis du genkender en genstand, bedes du henvende dig i receptionen og
  beskrive den for at få den udleveret.
</p>


<div class="flex items-end gap-6 mb-8 w-full justify-center border-[0.25px] border-gray-300 px-2 py-4 rounded-md">


  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Søg</label>
    <input
            type="text"
            placeholder="Søg efter genstand..."
            class="border rounded-md px-3 py-2 w-64"
    >
  </div>

  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Dato</label>
    <input
            type="date"
            class="border rounded-md px-3 py-2 w-48"
    >
  </div>

  <div class="flex flex-col">
    <label class="text-sm font-medium mb-1">Kategori</label>
    <select class="border rounded-md px-3 py-2 w-56">
      <option>Alle kategorier</option>
      <option>Tøj</option>
      <option>Tasker & rygsække</option>
      <option>Elektronik</option>
      <option>Smykker</option>
      <option>Nøgler</option>
      <option>Punge & kort</option>
      <option>Briller</option>
      <option>Legetøj</option>
      <option>Dokumenter</option>
      <option>Diverse</option>
    </select>
  </div>


  <button class="px-5 py-2 border rounded-md h-[42px]">Søg</button>

</div>


<div class="grid grid-cols-3 gap-6 w-full mb-10">


  <div class="border rounded-xl p-4 h-48 flex flex-col justify-between">
    <div class="font-medium text-lg">Genstand 1</div>
    <div class="text-sm text-gray-500">Fundet: dato</div>
  </div>

  <div class="border rounded-xl p-4 h-48 flex flex-col justify-between">
    <div class="font-medium text-lg">Genstand 2</div>
    <div class="text-sm text-gray-500">Fundet: dato</div>
  </div>

  <div class="border rounded-xl p-4 h-48 flex flex-col justify-between">
    <div class="font-medium text-lg">Genstand 3</div>
    <div class="text-sm text-gray-500">Fundet: dato</div>
  </div>

  <div class="border rounded-xl p-4 h-48 flex flex-col justify-between">
    <div class="font-medium text-lg">Genstand 4</div>
    <div class="text-sm text-gray-500">Fundet: dato</div>
  </div>

  <div class="border rounded-xl p-4 h-48 flex flex-col justify-between">
    <div class="font-medium text-lg">Genstand 5</div>
    <div class="text-sm text-gray-500">Fundet: dato</div>
  </div>

  <div class="border rounded-xl p-4 h-48 flex flex-col justify-between">
    <div class="font-medium text-lg">Genstand 6</div>
    <div class="text-sm text-gray-500">Fundet: dato</div>
  </div>

</div>
</div>
</div>
    `


    document.querySelector("#loginBtn").addEventListener("click",async () => navigate("/login"));
}