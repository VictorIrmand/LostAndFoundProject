export default function ConfirmationPopUp(message, confirmText, cancelText, onConfirm, type = "primary") {
    const overlay = document.createElement("div");
    overlay.className =
        "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50";

    const confirmBtnClass = {
        danger: "bg-red-600 hover:bg-red-700 text-white",
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        default: "bg-gray-800 hover:bg-gray-900 text-white"
    }[type];

    overlay.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center flex flex-col">
            <p class="mb-6 text-lg">${message}</p>

            <div class="flex justify-end gap-3">
                <button id="cancel-btn"
                    class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                    ${cancelText}
                </button>

                <button id="confirm-btn"
                    class="px-4 py-2 rounded ${confirmBtnClass}">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;


    document.querySelector("#app-main").appendChild(overlay);

    overlay.querySelector("#confirm-btn").addEventListener("click", async () => {
        await onConfirm()
        overlay.remove();
    });
    overlay.querySelector("#cancel-btn").addEventListener("click", async () => overlay.remove());
}