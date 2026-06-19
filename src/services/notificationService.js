import { Notification } from "../models/Notification.js";

export const createNotification = async ({ owner, project, type, title, message }) => {
  return Notification.create({ owner, project, type, title, message });
};
