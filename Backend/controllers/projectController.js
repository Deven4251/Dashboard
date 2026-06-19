import { Activity } from "../models/Activity.js";
import { Issue } from "../models/Issue.js";
import { Notification } from "../models/Notification.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { Upgrade } from "../models/Upgrade.js";
import { recordActivity } from "../services/activityService.js";
import { createNotification } from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { buildMeta, getPagination } from "../utils/pagination.js";

const activeStatuses = ["Planning", "In Progress", "Testing"];

export const listProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, status, priority, filter, technology, tag, sortBy = "updatedAt", order = "desc" } = req.query;
  const query = { owner: req.user._id };

  if (search) query.$text = { $search: search };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (technology) query.techStack = { $regex: technology, $options: "i" };
  if (tag) query.tags = { $regex: tag, $options: "i" };
  if (filter === "Active") query.status = { $in: activeStatuses };
  if (filter === "Completed") query.status = "Completed";
  if (filter === "Maintenance") query.status = "Maintenance";
  if (filter === "Archived") query.status = "Archived";

  const sort = { [sortBy]: order === "asc" ? 1 : -1 };
  const [projects, total] = await Promise.all([
    Project.find(query).sort(sort).skip(skip).limit(limit),
    Project.countDocuments(query)
  ]);

  res.json({ data: projects, meta: buildMeta(page, limit, total) });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, owner: req.user._id });
  await recordActivity({
    owner: req.user._id,
    project: project._id,
    type: "project",
    title: "Project created",
    description: project.name
  });
  res.status(201).json(project);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) throw new HttpError("Project not found", 404);

  const [tasks, issues, upgrades, activities] = await Promise.all([
    Task.find({ owner: req.user._id, project: project._id }).sort({ status: 1, order: 1, createdAt: 1 }),
    Issue.find({ owner: req.user._id, project: project._id }).sort({ createdAt: -1 }),
    Upgrade.find({ owner: req.user._id, project: project._id }).sort({ date: -1 }),
    Activity.find({ owner: req.user._id, project: project._id }).sort({ createdAt: -1 }).limit(25)
  ]);

  res.json({ project, tasks, issues, upgrades, activities });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) throw new HttpError("Project not found", 404);

  const oldStatus = project.status;
  Object.assign(project, req.body);
  await project.save();

  await recordActivity({
    owner: req.user._id,
    project: project._id,
    type: oldStatus !== project.status ? "status" : "project",
    title: oldStatus !== project.status ? "Project status changed" : "Project updated",
    description: oldStatus !== project.status ? `${oldStatus} to ${project.status}` : project.name
  });

  if (oldStatus !== project.status) {
    await createNotification({
      owner: req.user._id,
      project: project._id,
      type: "status",
      title: "Project status changed",
      message: `${project.name} moved from ${oldStatus} to ${project.status}.`
    });
  }

  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) throw new HttpError("Project not found", 404);

  await Promise.all([
    Task.deleteMany({ owner: req.user._id, project: project._id }),
    Issue.deleteMany({ owner: req.user._id, project: project._id }),
    Upgrade.deleteMany({ owner: req.user._id, project: project._id }),
    Activity.deleteMany({ owner: req.user._id, project: project._id }),
    Notification.deleteMany({ owner: req.user._id, project: project._id }),
    project.deleteOne()
  ]);

  res.json({ message: "Project deleted" });
});
