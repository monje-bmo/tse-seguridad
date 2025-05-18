import { Router } from "express";
import { report1Data, report2Data, report3Data, report4Data, report5Data } from "../controllers/reports.js";

const router = Router();

router.get("/report1", report1Data);
router.get("/report2", report2Data); 
router.get("/report3", report3Data);
router.get("/report4", report4Data);
router.get("/report5", report5Data);
export default router;
