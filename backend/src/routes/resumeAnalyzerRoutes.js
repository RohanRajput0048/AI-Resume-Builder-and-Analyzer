// --- START OF FILE resumeAnalyzerRoutes.js ---

// routes/resumeAnalyzerRoutes.js
import { Router } from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeAnalyzerController.js';

const router = Router();

// Use memory storage for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit file size (e.g., 5MB)
    fileFilter: (req, file, cb) => { // Optional: Filter for PDF only
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"), false);
        }
    }
});

// Route to handle resume analysis
// CHANGED: Use upload.single('resume') as jobDescription comes from req.body
router.post(
    '/',
    upload.single('resume'), // Expects a single file field named 'resume'
    analyzeResume
);


export default router;
// --- END OF FILE resumeAnalyzerRoutes.js ---