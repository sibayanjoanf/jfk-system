import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProductRow } from "../types";

const toBase64FromUrl = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const exportProductsPDF = async (products: ProductRow[]) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Product List", 14, 11);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const now = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Exported: ${now}`, pageWidth - 14, 11, { align: "right" });

  const imageCache: Record<string, string | null> = {};
  await Promise.all(
    products.map(async (p) => {
      if (p.image_url && !imageCache[p.image_url]) {
        imageCache[p.image_url] = await toBase64FromUrl(p.image_url);
      }
    }),
  );

  const ROW_HEIGHT = 14;
  const IMG_SIZE = 10;

  autoTable(doc, {
    startY: 24,
    head: [["Image", "Name", "SKU", "Sub-category", "Price"]],
    body: products.map((p) => [
      "",
      p.name,
      p.sku,
      p.sub_category ?? "—",
      `PHP ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    ]),
    columnStyles: {
      0: { cellWidth: 18, halign: "right" },
      1: { cellWidth: 80 },
      2: { cellWidth: 40, halign: "left", font: "courier" },
      3: { cellWidth: 55, halign: "left" },
      4: { cellWidth: 35, halign: "left" },
    },
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2,
      minCellHeight: ROW_HEIGHT,
      valign: "middle",
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 0) {
        const product = products[data.row.index];
        const base64 = imageCache[product?.image_url];
        if (base64) {
          const x = data.cell.x + (data.cell.width - IMG_SIZE) / 2;
          const y = data.cell.y + (data.cell.height - IMG_SIZE) / 2;
          try {
            doc.addImage(base64, "JPEG", x, y, IMG_SIZE, IMG_SIZE);
          } catch {
            // skip broken images
          }
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Footer on each page
  const totalPages = (doc as jsPDF & { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Page ${i} of ${totalPages} · ${products.length} product${products.length !== 1 ? "s" : ""}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: "center" },
    );
  }

  doc.save(`product-list-${Date.now()}.pdf`);
};