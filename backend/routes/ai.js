import express from "express";

import { classify, summarize } from "../controllers/ai.js";

const router = express.Router();


router.post("/classify", classify);
router.post("/summarize", summarize);


export { router as aiRoute };