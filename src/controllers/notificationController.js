import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildMeta, getPagination } from "../utils/pagination.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const query = { owner: req.user._id };
  if (req.query.read !== undefined) query.read = req.query.read === "true";
  const [notifications, total, unread] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(query),
    Notification.countDocuments({ owner: req.user._id, read: false })
  ]);
  res.json({ data: notifications, unread, meta: buildMeta(page, limit, total) });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { read: true },
    { new: true }
  );
  res.json(notification);
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ owner: req.user._id, read: false }, { read: true });
  res.json({ message: "Notifications marked as read" });
});
