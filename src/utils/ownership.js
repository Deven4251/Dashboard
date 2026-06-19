import { Project } from "../models/Project.js";
import { HttpError } from "./httpError.js";

export const getOwnedProject = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new HttpError("Project not found", 404);
  }
  return project;
};
