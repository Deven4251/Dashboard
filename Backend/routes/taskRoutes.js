import express from "express";
import { createTask, deleteTask, listTasks, reorderTasks, updateTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect);
router.get("/", listTasks);
router.post("/", createTask);
router.patch("/reorder", reorderTasks);
router.route("/:id").put(validateObjectId(), updateTask).delete(validateObjectId(), deleteTask);

export default router;
