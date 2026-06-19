import { Task } from "../models/Task.js";
import { recordActivity } from "../services/activityService.js";
import { createNotification } from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { getOwnedProject } from "../utils/ownership.js";

export const listTasks = asyncHandler(async (req, res) => {
  const query = { owner: req.user._id };
  if (req.query.project) query.project = req.query.project;
  if (req.query.status) query.status = req.query.status;
  const tasks = await Task.find(query).populate("project", "name").sort({ status: 1, order: 1, createdAt: 1 });
  res.json(tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.body.project, req.user._id);
  const task = await Task.create({ ...req.body, owner: req.user._id, project: project._id });
  await recordActivity({ owner: req.user._id, project: project._id, type: "task", title: "Task created", description: task.title });
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) throw new HttpError("Task not found", 404);

  const oldStatus = task.status;
  Object.assign(task, req.body);
  await task.save();
  await recordActivity({ owner: req.user._id, project: task.project, type: "task", title: "Task updated", description: task.title });

  if (oldStatus !== "Completed" && task.status === "Completed") {
    await createNotification({
      owner: req.user._id,
      project: task.project,
      type: "task",
      title: "Task completed",
      message: `${task.title} was completed.`
    });
  }

  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) throw new HttpError("Task not found", 404);
  res.json({ message: "Task deleted" });
});

export const reorderTasks = asyncHandler(async (req, res) => {
  const { tasks = [] } = req.body;
  await Promise.all(
    tasks.map((item) =>
      Task.updateOne(
        { _id: item._id, owner: req.user._id },
        { $set: { status: item.status, order: item.order } }
      )
    )
  );
  res.json({ message: "Tasks reordered" });
});
