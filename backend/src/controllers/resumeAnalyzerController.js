// --- START OF FILE resumeAnalyzerController.js ---

// resumeAnalyzerController.js
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Check for API Key
if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
    process.exit(1); // Exit if key is missing
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ safer pdf parsing wrapper
const extractPdfText = async (buffer) => {
  try {
    // Add basic buffer check
    if (!buffer || buffer.length === 0) {
        throw new Error("PDF buffer is empty.");
    }
    const data = await pdf(buffer);
    // Add check for extracted text
    if (!data || typeof data.text !== 'string') {
        throw new Error("Failed to extract text content from PDF.");
    }
    return data.text;
  } catch (err) {
    console.error("PDF Parsing failed:", err.message); // Log only message
    // Don't log the full error object here unless needed for specific debugging
    // console.error(err);
    throw new Error(`Failed to parse PDF: ${err.message}`); // Throw a cleaner error
  }
};

export const analyzeResume = async (req, res) => {
  try {
    // CHANGED: Access file via req.file (due to upload.single)
    const file = req.file;
    // CHANGED: More direct file check
    if (!file) {
      console.log("Analysis request failed: No file uploaded.");
      return res.status(400).json({ message: 'No resume file uploaded.' });
    }
     if (!file.buffer) {
       console.log("Analysis request failed: Uploaded file has no buffer.");
       return res.status(400).json({ message: 'Uploaded file is invalid or empty.' });
     }


    // 1. Extract text from the uploaded resume
    let resumeText;
    try {
      resumeText = await extractPdfText(file.buffer);
    } catch (pdfError) {
       // Catch specific PDF parsing errors
       console.error("Error during PDF text extraction:", pdfError);
       return res.status(400).json({ message: `Error processing PDF: ${pdfError.message}. Please try a different file.` });
    }

    if (!resumeText || resumeText.trim().length === 0) {
        console.warn("Extracted PDF text is empty or whitespace only.");
        return res.status(400).json({ message: 'Could not extract readable text from the PDF or the PDF is empty.' });
    }

    // Get job description from req.body (as it's not part of multipart file upload anymore)
    const { jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      console.log("Analysis request failed: No job description provided.");
      return res.status(400).json({ message: 'No job description provided.' });
    }


    // 2. Construct a smart prompt for Gemini
    // Ensure this template EXACTLY matches the structure your frontend expects
    const prompt = `
You are an expert HR analyst specializing in resume evaluation against job descriptions. Analyze the resume text below in the context of the provided Job Description (JD). Evaluate how well the resume aligns with the JD and return structured feedback STRICTLY in the specified JSON format below. Populate ALL fields; use "" for empty strings and [] for empty arrays if information is not found.

🔍 Compare the resume with this Job Description (JD):
"""
${jobDescription}
"""

Resume Text to Analyze:
"""
${resumeText}
"""

🧩 JSON Structure Template (use exactly this structure):

{
  "score": 0, /* Overall match ATS score (0-100) based on skills, experience relevance to JD */
  "summaryFeedback": "", /* Concise feedback on resume summary quality and JD alignment */
  "skillsFeedback": "", /* Evaluation of skills relevance to JD requirements */
  "experienceFeedback": "", /* Evaluation of experience relevance and impact related to JD */
  "keywordMatches": { /* Keywords from JD found/missing in resume */
    "found": [],
    "missing": []
  },
  "suggestions": [], /* Actionable suggestions to improve resume alignment with THIS JD */
  "userInfo": { /* Extracted contact details */
    "name": "",
    "email": "",
    "phone": "",
    "address": "" /* Extract if present, otherwise "" */
  },
  "summary": "", /* Extracted summary section, or generate a summary if missing */
  "skills": [], /* Array of all skills mentioned in the resume */
  "experienceDetails": [ /* Array of distinct job experiences */
    {
      "jobTitle": "", /* e.g., "Software Engineer" */
      "duration": "", /* e.g., "Jan 2021 – Present" or "2019 - 2020" */
      "description": "" /* Combined bullet points or text for the role */
    }
  ],
  "sectionAnalysis": { /* Subjective score (0-100) per section's quality/completeness */
    "workExperience": 0,
    "skills": 0,
    "education": 0, /* Score education if present */
    "summary": 0,
    "projects": 0 /* Score for projects section */
  },
  "projects": [ 
    { // Example structure for one project
      "projectName": "",
      "projectDescription": "",
      "toolsUsed": [],
      "date": "",
      "links": [] // Array for project-specific links
    }
    /* AI should add more objects here */
  ],
   "links": [ /* ... top level links ... */ ]
}


IMPORTANT INSTRUCTIONS:
- Return ONLY the raw JSON object.
- Do NOT include any introductory text, explanations, apologies, or markdown formatting (like \`\`\`json or \`\`\`).
- The entire response MUST start directly with '{' and end perfectly with '}'. Ensure it's valid JSON.
- Populate ALL fields in the template. Use "" or [] for missing data. Do not omit keys.
- **Extract ALL distinct projects mentioned in the resume into the "projects" array.**
- Extract the summary form the resume uploaded or generate a summary if not present.
- ATS Score and sectionAnalysis should be scored on the basis of JD provided.
`;


    // 3. Send to Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // --- START: CRITICAL CLEANING STEP ---
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.substring(7);
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
    } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3);
        if (cleanedText.endsWith('```')) {
           cleanedText = cleanedText.slice(0, -3);
       }
    }
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    } else {
      console.error('Could not find valid JSON structure ({...}) in Gemini response.');
      console.error('Original response text:', responseText); // Log for debugging
      return res.status(500).json({ message: 'AI response did not contain valid JSON structure.' });
    }
    // --- END: CRITICAL CLEANING STEP ---


    // 4. Attempt to parse the CLEANED Gemini response as JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse cleaned Gemini response:', parseError);
      console.error('Original response text:', responseText);
      console.error('Cleaned response text attempted to parse:', cleanedText);
      return res.status(500).json({ message: 'Invalid JSON format received from AI after cleaning. Please try again.' });
    }

    // 5. Send analysis to frontend
    console.log("Successfully generated analysis for:", file.originalname);
    res.status(200).json(analysis); // Use 200 OK status

  } catch (error) {
    // Catch errors from PDF parsing, Gemini API call, file handling etc.
    console.error('Unhandled Resume analysis error:', error);
    // Send a generic error message, but log the specific error server-side
    res.status(500).json({ message: 'An unexpected error occurred while analyzing the resume.', type: error.name, details: error.message });
  }
};
// --- END OF FILE resumeAnalyzerController.js ---