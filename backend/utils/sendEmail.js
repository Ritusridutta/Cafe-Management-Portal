const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Ready");
  }
});

// ================= PDF GENERATION =================
function generatePDF(order) {
  return new Promise((resolve) => {

    const filePath = path.join(__dirname, `../receipts/${order.order_id}.pdf`);

    const doc = new PDFDocument({
      margin: 0,
      size: "A4"
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ================= MAIN CARD =================
    doc
      .roundedRect(40, 40, 515, 700, 10)
      .strokeColor("#dddddd")
      .lineWidth(1)
      .stroke();

    // ================= HEADER =================
    doc
      .roundedRect(40, 40, 515, 90, 10)
      .fill("#1a1a2e");

    doc
      .fillColor("white")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Cafe BE", 40, 65, {
        width: 515,
        align: "center"
      });

    doc
      .fontSize(13)
      .font("Helvetica")
      .text("Order Confirmation", 40, 98, {
        width: 515,
        align: "center"
      });

    // ================= BODY =================
    let y = 170;

    doc
      .fillColor("black")
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Order ID:", 70, y);

    doc
      .font("Helvetica")
      .text(order.order_id, 145, y);

    y += 40;

    doc
      .font("Helvetica-Bold")
      .text("Date:", 70, y);

    doc
      .font("Helvetica")
      .text(new Date().toLocaleString(), 120, y);

    y += 45;

    // ================= TABLE HEADER =================
    doc
      .rect(70, y, 455, 35)
      .fill("#f3f3f3");

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12);

    doc.text("Item", 85, y + 11);
    doc.text("Category", 220, y + 11);
    doc.text("Qty", 385, y + 11);
    doc.text("Price", 455, y + 11);

    y += 50;

    // ================= ITEMS =================
    doc.font("Helvetica").fontSize(12);

    order.items.forEach(item => {

      const total = item.price * item.qty;

      doc.text(item.name, 85, y);
      doc.text(item.category || "-", 220, y);
      doc.text(String(item.qty), 390, y);
      doc.text(`Rs. ${total}`, 445, y);

      y += 35;
    });

    // ================= TOTAL =================
    y += 20;

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(`Total: Rs. ${order.total}`, 0, y, {
        align: "right",
        width: 500
      });

    y += 60;

    // ================= FOOTER =================
    doc
      .font("Helvetica")
      .fontSize(13)
      .fillColor("#333")
      .text("Thank you for ordering with us ☕", 70, y);

    doc.end();

    stream.on("finish", () => resolve(filePath));
  });
}

// ================= EMAIL =================
const sendOrderEmail = async (to, order) => {

  const pdfPath = await generatePDF(order);

  const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.category || "-"}</td>
      <td>${item.qty}</td>
      <td>₹${item.price * item.qty}</td>
    </tr>
  `).join("");

  const html = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e5e5; border-radius:10px; overflow:hidden;">

  <div style="background:#1a1a2e; color:white; padding:18px; text-align:center;">
    <h2 style="margin:0;">Cafe BE</h2>
    <p style="margin:5px 0 0;">Order Confirmation</p>
  </div>

  <div style="padding:20px;">
    <p><strong>Order ID:</strong> ${order.order_id}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

    <table style="width:100%; border-collapse: collapse; margin-top:15px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:10px; text-align:left;">Item</th>
          <th style="padding:10px; text-align:left;">Category</th>
          <th style="padding:10px; text-align:center;">Qty</th>
          <th style="padding:10px; text-align:right;">Price</th>
        </tr>
      </thead>

      <tbody>
        ${order.items.map(item => `
          <tr>
            <td style="padding:10px;">${item.name}</td>
            <td style="padding:10px;">${item.category}</td>
            <td style="padding:10px; text-align:center;">${item.qty}</td>
            <td style="padding:10px; text-align:right;">₹${item.price * item.qty}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <h3 style="text-align:right; margin-top:15px;">Total: ₹${order.total}</h3>

    <p style="margin-top:20px;">Thank you for ordering with us ☕</p>
  </div>
</div>
`;

  await transporter.sendMail({
    from: `"Cafe BE" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Order Receipt",
    html,
    attachments: [
      {
        filename: `Receipt-${order.order_id}.pdf`,
        path: pdfPath
      }
    ]
  });
};

module.exports = sendOrderEmail;
