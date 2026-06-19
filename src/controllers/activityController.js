import { Activity } from "../models/Activity.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildMeta, getPagination } from "../utils/pagination.js";

export const listActivity = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const query = { owner: req.user._id };
  if (req.query.project) query.project = req.query.project;
  const [activity, total] = await Promise.all([
    Activity.find(query).populate("project", "name").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Activity.countDocuments(query)
  ]);
  res.json({ data: activity, meta: buildMeta(page, limit, total) });
});
