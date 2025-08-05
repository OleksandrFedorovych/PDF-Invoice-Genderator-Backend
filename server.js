const express = require("express");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const data = req.body;
    const existingPdfBytes = fs.readFileSync(path.join(__dirname, "as-is.pdf"));
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField("property_street_address").setText(`${data.property_street_address}, ${data.property_city}, ${data.property_state}`);
    form.getTextField("seller_full_name").setText(`${data.seller_name_1} ${data.seller_name_2}`);
    form.getTextField("buyer_full_name").setText(`${data.buyer_name}`);
    form.getTextField("property_county").setText(`${data.property_county}`);
    form.getTextField("property_tax_id").setText(`${data.property_tax_id}`);
    form.getTextField("legal_description").setText(`${data.legal_description}`);
    form.getTextField("purchase_price").setText(`${data.purchase_price}`);
    form.getTextField("initial_deposit_amount").setText(`${data.initial_deposit_amount}`);
    form.getTextField("listing_agent_name").setText(`${data.list_agent_name}`);
    form.getTextField("listing_agent_phone").setText(`${data.list_agent_phone}`);
    form.getTextField("listing_agent_email").setText(`${data.list_agent_email}`);
    form.getTextField("listing_agent_address").setText(`${data.list_agent_address}`);
    form.getTextField("listing_agent_fax").setText(`${data.list_agent_fax}`);
    form.getTextField("effective_date").setText(`${data.effective_date}`);
    form.getTextField("closing_date").setText(`${data.closing_date}`);
    form.getTextField("buyer_name_1").setText(`${data.buyer_name_1}`);
    form.getTextField("buyer_name_2").setText(`${data.buyer_name_2}`);
    form.getTextField("seller_name_1").setText(`${data.seller_name_1}`);
    form.getTextField("seller_name_2").setText(`${data.seller_name_2}`);

    form.flatten();
    console.log("Generate PDF Start");
    const pdfBytes = await pdfDoc.save();

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="offer_contract.pdf"',
      'Content-Length': pdfBytes.length,
    });
    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    res.status(500).send("PDF generation failed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 PDF generator server running on port ${PORT}`);
});
