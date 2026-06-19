import { Upgrade } from "../models/Upgrade.js";
import { recordActivity } from "../services/activityService.js";
import { createNotification } from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { getOwnedProject } from "../utils/ownership.js";

export const listUpgrades = asyncHandler(async (req, res) => {
  const query = { owner: req.user._id };
  if (req.query.project) query.project = req.query.project;
  const upgrades = await Upgrade.find(query).populate("project", "name").sort({ date: -1 });
  res.json(upgrades);
});

export const createUpgrade = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.body.project, req.user._id);
  const upgrade = await Upgrade.create({ ...req.body, owner: req.user._id, project: project._id });
  await recordActivity({ owner: req.user._id, project: project._id, type: "upgrade", title: "Upgrade added", description: upgrade.version });
  await createNotification({
    owner: req.user._id,
    project: project._id,
    type: "upgrade",
    title: "New upgrade added",
    message: `${project.name} received ${upgrade.version}.`
  });
  res.status(201).json(upgrade);
});

export const updateUpgrade = asyncHandler(async (req, res) => {
  const upgrade = await Upgrade.findOne({ _id: req.params.id, owner: req.user._id });
  if (!upgrade) throw new HttpError("Upgrade not found", 404);
  Object.assign(upgrade, req.body);
  await upgrade.save();
  res.json(upgrade);
});

export const deleteUpgrade = asyncHandler(async (req, res) => {
  const upgrade = await Upgrade.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!upgrade) throw new HttpError("Upgrade not found", 404);
  res.json({ message: "Upgrade deleted" });
});
