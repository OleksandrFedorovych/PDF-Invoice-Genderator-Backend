const express = require("express");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const app = express();
app.use(express.json());

// Serve static files in the /files directory
app.use("/files", express.static(path.join(__dirname, "files")));

app.post("/generate", async (req, res) => {
  try {
    const data = req.body;
    const existingPdfBytes = fs.readFileSync(path.join(__dirname, "as-is.pdf"));
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField("seller_full_name").setText($(`${data.seller_name_1}` `${data.seller_name_2}`));
    form.getTextField("buyer_full_name").setText(`Adir Schneider PA`);
    form.getTextField("property_street_address").setText(`${data.property_street_address}, ${data.property_city}, ${data.property_state}`);
    form.getTextField("property_county").setText(`${data.property_county}`);
    form.getTextField("property_tax_id").setText(`${data.property_tax_id}`);
    form.getTextField("legal_description").setText(`${data.legal_description}`);
    form.getTextField("other_personal_property").setText(""); // ??
    form.getTextField("excluded_items").setText(""); // ??
    form.getTextField("purchase_price").setText(`${data.purchase_price}`);
    form.getTextField("initial_deposit_amount").setText(`${data.initial_deposit_amount}`);
    form.getTextField("escrow_agent_name").setText(`Cooperative Title Agency of Florida, lnc.`);
    form.getTextField("escrow_agent_address").setText(`9700 Griffin Road Cooper City FL 33328`);
    form.getTextField("escrow_agent_phone").setText(`(954) 616-5302`);
    form.getTextField("escrow_agent_email").setText(`richard@cooptitle.com`);
    form.getTextField("escrow_agent_fax").setText("");

    form.getTextField("additional_deposit_delay_days").setText(`10`);
    form.getTextField("additional_deposit_amount").setText("");

    form.getTextField("loan_amount").setText("");
    form.getTextField("other_closing_funds_description").setText("");
    form.getTextField("other_closing_funds").setText("");

    form.getTextField("balance_to_close").setText(`${data.balance_to_close}`);
    form.getTextField("offer_acceptance_deadline").setText(`${data.offer_acceptance_deadline}`);
    form.getTextField("closing_date").setText(`${data.closing_date}`);

    form.getTextField("buyer_initial_1").setText(`${data.first_name}`);
    form.getTextField("buyer_initial_2").setText(`${data.last_name}`);
    form.getTextField("seller_initial_1").setText(`${data.seller_name_1}`);
    form.getTextField("seller_initial_2").setText(`${data.seller_name_2}`);

    form.getTextField("loan_approval_period_days").setText(`30`);
    form.getTextField("loan_type_other").setText("");
    form.getTextField("loan_interest_rate_cap").setText("");
    form.getTextField("loan_term_years").setText(`30`);
    form.getTextField("loan_application_deadline_days").setText(`5`);

    form.getTextField("buyer_other_costs").setText("");
    form.getTextField("title_evidence_deadline_days").setText("");
    form.getTextField("title_evidence_deadline_days").setText(`15`);

    form.getTextField("title_search_max_cost").setText(`200`);
    form.getTextField("home_warranty_provider").setText("");
    form.getTextField("home_warranty_cost_cap").setText("");
    
    form.getTextField("flood_termination_days").setText(`20`);

    form.getTextField("inspection_period_days").setText(`15`);

    form.getTextField("other_terms").setText("");
    form.getTextField("additional_terms").setText(`- Seller shalle convey and transfer clear and marketable title, free and clear from any encumbrances, clouds, \n title, defects, open, active, expired or inactive permits, county or municipal violations liens or other defects. \n buyer is a licensed real estate agent \n
                                                   - Seller shall provide access to the property with 24 hours notice.`);

    form.getTextField("buyer1").setText(`?`);
    form.getTextField("buyer2").setText(`?`);
    form.getTextField("seller1").setText(`?`);
    form.getTextField("seller2").setText(`?`);
    form.getTextField("buyer1_date").setText(`?`);
    form.getTextField("buyer2_date").setText(`?`);
    form.getTextField("seller1_date").setText(`?`);
    form.getTextField("seller2_date").setText(`?`);
    form.getTextField("buyer_address_notice").setText(`?`);
    form.getTextField("seller_address_notice").setText(`?`);
    form.getTextField("cooperate_sales_associate").setText(`?`);
    form.getTextField("cooperate_broker").setText(`?`);
    form.getTextField("list_sales_associat").setText(`?`);
    form.getTextField("list_broker").setText(`?`);


    form.flatten();
    console.log("✅ Generate PDF Start");

    const pdfBytes = await pdfDoc.save();
    const timestamp = Date.now();
    const filename = `offer_contract_${timestamp}.pdf`;
    const outputPath = path.join(__dirname, "files", filename);

    // Ensure the directory exists
    fs.mkdirSync(path.join(__dirname, "files"), { recursive: true });
    fs.writeFileSync(outputPath, pdfBytes);

    const publicUrl = `https://pdf-invoice-genderator-backend.onrender.com/files/${filename}`;
    res.json({ pdf_url: publicUrl });
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    res.status(500).send("PDF generation failed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 PDF generator server running on port ${PORT}`);
});
