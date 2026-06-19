import express from "express";
import { createIssue, deleteIssue, listIssues, updateIssue } from "../controllers/issueController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listIssues).post(createIssue);
router.route("/:id").put(validateObjectId(), updateIssue).delete(validateObjectId(), deleteIssue);

export default router;
