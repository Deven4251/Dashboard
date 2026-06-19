import express from "express";
import { createProject, deleteProject, getProject, listProjects, updateProject } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listProjects).post(createProject);
router.route("/:id").get(validateObjectId(), getProject).put(validateObjectId(), updateProject).delete(validateObjectId(), deleteProject);

export default router;
