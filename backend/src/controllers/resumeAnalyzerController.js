// resumeAnalyzerController.js
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ safer pdf parsing wrapper
const extractPdfText = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    console.error("PDF Parsing failed:", err);
    throw err; // Re-throw to be caught by the main handler
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 1. Extract text from the uploaded resume (PDF only for now)
    const resumeText = await extractPdfText(file.buffer);
    if (!resumeText || resumeText.trim().length === 0) {
        console.warn("Extracted PDF text is empty or whitespace only.");
        // Decide how to handle: maybe return an error or a default message
        return res.status(400).json({ message: 'Could not extract text from PDF or PDF is empty.' });
    }


    // 2. Construct a smart prompt for Gemini (Refined Prompt)
    const prompt = `
You are a professional resume analyst. Analyze the resume text below and provide structured feedback STRICTLY in the specified JSON format.

✅ JSON Fields Required:

- score (integer out of 100)
- summaryFeedback (string: short summary of the resume quality)
- skillsFeedback (string: evaluation of technical skills)
- experienceFeedback (string: evaluation of work experience section)
- keywordMatches (object with keys: found: string[], missing: string[])
- suggestions (string[]: specific improvements)

➕ Additional Required Sections:

- userInfo (object with fields: name, email, phone, address)
- skills (array of strings: list of technical and soft skills mentioned in the resume)
- experienceDetails (array of objects with jobTitle and duration like "Software Engineer", "Jan 2021 – Present")
- summary (provide the summary form the resume if not exist generate the summary of the resume)
- projects (object with fields: projectName, projectDescription, toolsUsed(array of strings), date)


🧩 JSON Structure Template (use exactly this structure):

{
  "score": 0,
  "summaryFeedback": "",
  "skillsFeedback": "",
  "experienceFeedback": "",
  "keywordMatches": {
    "found": [],
    "missing": []
  },
  "suggestions": [],
  "userInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "address": ""
  },
  "summary": "",
  "skills": [],
  "experienceDetails": [
    {
      "jobTitle": "",
      "duration": "",
      "description ": ""
    }
  ],
  "sectionAnalysis": {
    "workExperience": 0,
    "skills": 0,
    "education": 0,
    "summary": 0
  },
  "projects": {
    "projectName": "",
    "projectDescription": "",
    "toolsUsed": [],
    "date": ""
  }
}

Resume Text to Analyze:
"""
${resumeText}
"""

IMPORTANT INSTRUCTIONS:
- Return ONLY the raw JSON object.
- Do NOT include any introductory text, explanations, apologies, or markdown formatting (like \`\`\`json or \`\`\`).
- The response MUST start directly with '{' and end with '}'.
- Ensure the output is valid JSON that can be parsed directly.
- Do NOT add or remove any keys from the template.
`;

    


    // 3. Send to Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or your preferred model
    const result = await model.generateContent(prompt);
    const response = await result.response; // Get the full response object
    const responseText = response.text(); // Extract the text

    // --- START: CRITICAL CLEANING STEP ---
    let cleanedText = responseText.trim();

    // Remove ```json markdown fences if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.substring(7); // Remove ```json
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3); // Remove trailing ```
      }
    }
    // Remove ``` markdown fences if present (without language specifier)
    else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3); // Remove ```
        if (cleanedText.endsWith('```')) {
           cleanedText = cleanedText.slice(0, -3); // Remove trailing ```
       }
    }

    // Attempt to extract JSON even if there's leading/trailing garbage text
    // Find the first '{' and the last '}'
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    } else {
      // If we couldn't find braces, the response is likely not JSON
      console.error('Could not find valid JSON structure ({...}) in Gemini response.');
      console.error('Original response text:', responseText);
      return res.status(500).json({ message: 'AI response did not contain valid JSON structure.' });
    }
    // --- END: CRITICAL CLEANING STEP ---


    // 4. Attempt to parse the CLEANED Gemini response as JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse cleaned Gemini response:', parseError);
      console.error('Original response text:', responseText); // Log original for debugging
      console.error('Cleaned response text attempted to parse:', cleanedText); // Log cleaned text
      return res.status(500).json({ message: 'Invalid JSON format received from AI after cleaning. Try again.' });
    }

    // 5. Send analysis to frontend
    res.json(analysis);

  } catch (error) {
    // Catch errors from PDF parsing or Gemini API call itself
    console.error('Resume analysis error:', error);
     // Check if it's a specific Gemini error type if needed, otherwise send generic
    res.status(500).json({ message: 'Something went wrong analyzing the resume.', error: error.message });
  }
};

