import express from "express";
import { createUpgrade, deleteUpgrade, listUpgrades, updateUpgrade } from "../controllers/upgradeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listUpgrades).post(createUpgrade);
router.route("/:id").put(validateObjectId(), updateUpgrade).delete(validateObjectId(), deleteUpgrade);

export default router;
