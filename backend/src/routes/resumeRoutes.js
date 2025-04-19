import {Router} from "express";
import{generateResume} from "../controllers/resumeControllers.js";


const router = Router()

router.post('/generate', generateResume);

export default router
