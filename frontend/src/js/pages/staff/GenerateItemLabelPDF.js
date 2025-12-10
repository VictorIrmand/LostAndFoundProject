import { jsPDF } from "jspdf";
import { generateQR } from "../../utility/generateQR.js";
import formatDate from "../../utility/formatDate.js";

export async function generateItemLabelPdf(item) {

    // Lille kompakt label (60mm x 80mm)
    const doc = new jsPDF({
        unit: "mm",
        format: [60, 80]
    });

    // QR URL
    const qrUrl = `https://glyptoteket.dk/staff/lost-items/${item.id}`;
    const qrDataUrl = await generateQR(qrUrl);

    // Center helpers
    const pageWidth = 60;
    const textCenter = pageWidth / 2;

    // HEADER
    doc.setFontSize(12);
    doc.text("Glyptoteket", textCenter, 10, { align: "center" });

    doc.setFontSize(10);
    doc.text("Lost & Found", textCenter, 15, { align: "center" });

    // ITEM INFO (kompakt blok)
    doc.setFontSize(9);
    doc.text(`Navn: ${item.name}`, textCenter, 24, { align: "center" });
    doc.text(`ID: ${item.id}`, textCenter, 30, { align: "center" });
    doc.text(`Kategori: ${item.category}`, textCenter, 36, { align: "center" });
    doc.text(`Lokation Fundet: ${item.placeFound}`, textCenter, 42, { align: "center" });
    doc.text(`Tidspunkt fundet: ${formatDate(item.dateFound)}`, textCenter, 48, { align: "center" });
    // QR KODE nederst i midten
    const qrSize = 25;                     // 25mm × 25mm
    const qrX = (pageWidth - qrSize) / 2;  // center X
    const qrY = 80 - qrSize - 5;           // 5mm margin fra bunden

    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // Open as PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
}
