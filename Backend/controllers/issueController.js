import { Issue } from "../models/Issue.js";
import { recordActivity } from "../services/activityService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { getOwnedProject } from "../utils/ownership.js";

export const listIssues = asyncHandler(async (req, res) => {
  const query = { owner: req.user._id };
  if (req.query.project) query.project = req.query.project;
  if (req.query.status) query.status = req.query.status;
  const issues = await Issue.find(query).populate("project", "name").sort({ date: -1 });
  res.json(issues);
});

export const createIssue = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.body.project, req.user._id);
  const issue = await Issue.create({ ...req.body, owner: req.user._id, project: project._id });
  await recordActivity({ owner: req.user._id, project: project._id, type: "issue", title: "Maintenance issue reported", description: issue.title });
  res.status(201).json(issue);
});

export const updateIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findOne({ _id: req.params.id, owner: req.user._id });
  if (!issue) throw new HttpError("Issue not found", 404);
  Object.assign(issue, req.body);
  await issue.save();
  await recordActivity({ owner: req.user._id, project: issue.project, type: "issue", title: "Issue updated", description: issue.title });
  res.json(issue);
});

export const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!issue) throw new HttpError("Issue not found", 404);
  res.json({ message: "Issue deleted" });
});
