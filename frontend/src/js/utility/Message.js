export function showMessage(msg, messageType) {
    const targetEl = document.querySelector("#message-container");
    if (!targetEl) return console.error("No #message-container found in DOM");

    targetEl.innerHTML = "";

    const messageEl = document.createElement("p");
    messageEl.textContent = msg;

    // Base styling
    messageEl.className = `
        px-4 py-2 rounded-md mt-2 text-sm font-medium 
        animate-[fadeIn_0.2s_ease-out]
    `;


    if (messageType === "error") {
        messageEl.classList.add(
            "bg-red-100",
            "text-red-700",
            "border",
            "border-red-300"
        );
    } else if (messageType === "info") {
        messageEl.classList.add(
            "bg-blue-100",
            "text-blue-700",
            "border",
            "border-blue-300"
        );
    } else {

        messageEl.classList.add(
            "bg-green-100",
            "text-green-700",
            "border",
            "border-green-300"
        );
    }

    targetEl.appendChild(messageEl);
}
