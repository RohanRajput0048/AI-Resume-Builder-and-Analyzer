// routes/resumeAnalyzerRoutes.js
import { Router } from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeAnalyzerController.js';

const router = Router();

// Use memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle resume analysis
router.post('/', upload.single("resume"), analyzeResume);

export default router;
