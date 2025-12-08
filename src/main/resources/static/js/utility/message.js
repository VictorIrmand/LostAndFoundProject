
export function showMessage(msg, messageType) {
    const targetEl = document.querySelector(".message-container");
    if (!targetEl) return console.error("No .message-container found in DOM");

    targetEl.innerHTML = "";

    const messageEl = document.createElement("p");
    messageEl.textContent = msg;

    if (messageType === "error") messageEl.classList.add("active-error");
    if (messageType === "info") messageEl.classList.add("active-info");

    targetEl.appendChild(messageEl);
}