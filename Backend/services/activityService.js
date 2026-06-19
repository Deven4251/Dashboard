import { Activity } from "../models/Activity.js";

export const recordActivity = async ({ owner, project, type, title, description, metadata }) => {
  return Activity.create({ owner, project, type, title, description, metadata });
};
