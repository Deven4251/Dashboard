import express from "express";
import { listNotifications, markAllRead, markNotificationRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect);
router.get("/", listNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", validateObjectId(), markNotificationRead);

export default router;
