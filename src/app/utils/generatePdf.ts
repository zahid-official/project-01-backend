/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import httpStatus from "http-status-codes";
import AppError from "../errors/AppError";

// Invoice Data Interface
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

// Generate PDF function
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

      // ====================
      // Invoice Header
      // ====================
      doc
        .font("Helvetica-Bold")
        .fontSize(42)
        .fillColor("black")
        .text("INVOICE", { align: "left" })
        .moveDown(1.5);

      // Payment Date & Transaction ID (two column)
      const startY = doc.y;
      const col1X = 50;
      const col2X = 300;

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Date of Payment:", col1X, startY);
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`${invoiceData?.paymentDate}`, col1X, startY + 15);

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Transaction ID:", col2X, startY);
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`${invoiceData?.transactionId}`, col2X, startY + 15);

      doc.moveDown(3);

      // ====================
      // Company Information
      // ====================
      const infoY = doc.y;
      const leftX = 50;
      const rightX = 300;

      // Billed To
      doc.font("Helvetica-Bold").fontSize(12).text("Billed to:", leftX, infoY);
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("black")
        .text(`${invoiceData?.name}`, leftX, infoY + 15)
        .text(`${invoiceData?.phone}`)
        .text(`${invoiceData?.email}`)
        .text(`${invoiceData.address}`);

      // From
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("black")
        .text("From:", rightX, infoY);
      doc
        .font("Helvetica")
        .fontSize(12)
        .text("Wandora Ltd.", rightX, infoY + 15)
        .text("01958769425")
        .text("support@wandora.com")
        .text("Uttara, Dhaka, Bangladesh");

      doc.moveDown(5);

      // ====================
      // Invoice Items Table
      // ====================
      const tableTop = doc.y;
      const itemX = 50;
      const guestX = 250;
      const costX = 350;
      const amountX = 450;

      // Table Header Background
      doc.rect(itemX, tableTop, 500, 25).fill("#E5E7EB").stroke();

      doc.fillColor("black").font("Helvetica-Bold").fontSize(12);
      doc.text("Tour Title", itemX + 5, tableTop + 7);
      doc.text("Guest", guestX + 5, tableTop + 7);
      doc.text("Cost", costX + 5, tableTop + 7);
      doc.text("Amount", amountX + 5, tableTop + 7);

      // Reset fill for rows
      doc.fillColor("black").font("Helvetica").fontSize(12);

      let rowY = tableTop + 25;

      // Draw row bottom border
      doc
        .moveTo(itemX, rowY + 25)
        .lineTo(itemX + 500, rowY + 25)
        .strokeColor("#E5E7EB")
        .stroke();

      doc.fillColor("black").font("Helvetica").fontSize(12);
      doc.text(`${invoiceData.tourTitle}`, itemX + 5, rowY + 7);
      doc.text(`${invoiceData.guests}`, guestX + 5, rowY + 7);
      doc.text(`${invoiceData.cost}`, costX + 5, rowY + 7);
      doc.text(`${invoiceData.amount}`, amountX + 5, rowY + 7);

      rowY += 25;

      // Total Row
      doc
        .moveTo(itemX, rowY + 25)
        .lineTo(itemX + 500, rowY + 25)
        .strokeColor("#E5E7EB")
        .stroke();

      doc.font("Helvetica-Bold").fillColor("black");
      doc.text("Total =", costX + 5, rowY + 7);
      doc.text(`${invoiceData.amount}`, amountX + 5, rowY + 7);

      doc.moveDown(5);

      // ====================
      // Payment Information
      // ====================
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("black")
        .text("Payment status:", 50, rowY + 50, { continued: true });
      doc.font("Helvetica").text(`${invoiceData.status}`);

      doc.moveDown(0.5);

      doc.font("Helvetica-Bold").text("Note:", { continued: true });
      doc.font("Helvetica").text(" Thank you for choosing Wandora!");

      // End
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
