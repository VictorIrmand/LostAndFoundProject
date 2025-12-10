import QRCode from "qrcode";

export async function generateQR(url) {
    return await QRCode.toDataURL(url, {
        type: "image/png",
        margin: 1,
        scale: 4,
    });
}