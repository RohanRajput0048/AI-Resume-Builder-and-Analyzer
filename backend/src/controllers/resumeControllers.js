import { generatePDFModern, generatePDFClassic, generatePDFAzurill, generatePDFBhendi, generatePDFkd } from '../utils/pdfGenerator.js';

export const generateResume = async (req, res) => {
  try {
    console.log("Received Data:", req.body);


    const { template, data } = req.body || {};

    if (!template || !data) {
      return res.status(400).json({ message: "Template and data are required." });
    }

    let pdfBuffer;

    if (template === "modern") {
      pdfBuffer = await generatePDFModern(data);
    } else if (template === "classic") {
      pdfBuffer = await generatePDFClassic(data);
    } else if (template === "azurill") {
      pdfBuffer = await generatePDFAzurill(data);
    } else if (template === "bhendi") {
      pdfBuffer = await generatePDFBhendi(data);
    } else if (template === "kd") {
      pdfBuffer = await generatePDFkd(data);
    } else {
      return res.status(400).json({ message: "Invalid template type." });
    }

    // Set headers to download the PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${data.name}_resume.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
