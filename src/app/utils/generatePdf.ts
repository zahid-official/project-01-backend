/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import httpStatus from "http-status-codes";
import AppError from "../errors/AppError";

// Invoice data interface
export interface IInvoiceData {
  name: string;
  email: string;
  phone: string;
  address: string;

  cost: number;
  guests: number;
  amount: number;
  status: string;
  tourTitle: string;
  paymentDate: string;
  transactionId: string;
}

// Generate pdf function
const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));

      // ======= Wrapper (like a box) =======
      doc
        .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
        .strokeColor("#ecf0f1")
        .lineWidth(1)
        .stroke();

      doc.font("Helvetica-Bold").fontSize(42).text("INVOICE", 60, 90);

      // ======= Date & Transaction rows =======
      let y = 150;
      const leftX = 60;
      const rightX = 320;

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Date of Payment:", leftX, y);
      doc.font("Helvetica").text(invoiceData.paymentDate, leftX, y + 15);

      doc.font("Helvetica-Bold").text("Transaction ID:", rightX, y);
      doc.font("Helvetica").text(invoiceData.transactionId, rightX, y + 15);

      // ======= Billed to/from =======
      y += 60;

      doc.font("Helvetica-Bold").text("Billed to:", leftX, y);
      doc
        .font("Helvetica")
        .text(invoiceData.name, leftX, y + 15)
        .text(invoiceData.email)
        .text(invoiceData.phone)
        .text(invoiceData.address);

      doc.font("Helvetica-Bold").text("From:", rightX, y);
      doc
        .font("Helvetica")
        .text("Wandora Ltd.", rightX, y + 15)
        .text("01958769425")
        .text("support@wandora.com")
        .text("Uttara, Dhaka, Bangladesh");

      // ======= Table =======
      y += 110;

      const tableX = 60;
      const tableWidth = doc.page.width - 120;
      const col1 = tableX;
      const col2 = tableX + 200;
      const col3 = tableX + 320;
      const col4 = tableX + 420;

      // Header row
      doc.rect(tableX, y, tableWidth, 25).fill("#e5e7eb").stroke();
      doc.fillColor("black").font("Helvetica-Bold");

      doc.text("Tour Title", col1 + 5, y + 7);
      doc.text("Guest", col2 + 5, y + 7);
      doc.text("Per Person", col3 + 5, y + 7);
      doc.text("Amount", col4 + 5, y + 7);

      // Header border
      doc.fillColor("black").font("Helvetica").fontSize(12);

      y += 25;

      // Row
      doc
        .moveTo(tableX, y + 25)
        .lineTo(tableX + tableWidth, y + 25)
        .strokeColor("#e5e7eb")
        .stroke();

      doc.text(invoiceData.tourTitle, col1 + 5, y + 7);
      doc.text(String(invoiceData.guests), col2 + 5, y + 7, { width: 50 });
      doc.text(`$${invoiceData.cost}`, col3 + 5, y + 7, { width: 60 });
      doc.text(`$${invoiceData.amount}`, col4 + 5, y + 7, { width: 80 });

      // Total row
      y += 25;
      doc
        .moveTo(tableX, y + 25)
        .lineTo(tableX + tableWidth, y + 25)
        .strokeColor("#e5e7eb")
        .stroke();

      doc.font("Helvetica-Bold");
      doc.text("Total =", col3 + 5, y + 7);
      doc.text(`$${invoiceData.amount}`, col4 + 5, y + 7);

      // ======= Footer =======
      y += 70;
      doc.font("Helvetica-Bold").text("Payment status:", leftX, y, {
        continued: true,
      });
      doc.font("Helvetica").text(` ${invoiceData.status}`);

      y += 20;
      doc.font("Helvetica-Bold").text("Note:", leftX, y, { continued: true });
      doc.font("Helvetica").text(" Thank you for choosing Wandora!");

      // Finalize pdf file
      doc.end();
    });
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to generate PDF"
    );
  }
};

export default generatePdf;
