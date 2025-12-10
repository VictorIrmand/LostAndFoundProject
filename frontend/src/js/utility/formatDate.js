export default function formatDate (dateString) {
    const d = new Date(dateString);
    return d.toLocaleString("da-DK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}