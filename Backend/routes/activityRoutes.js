import express from "express";
import { listActivity } from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listActivity);

export default router;
