import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", index: true },
    type: {
      type: String,
      enum: ["status", "upgrade", "task", "issue", "system"],
      default: "system"
    },
    title: { type: String, required: true },
    message: String,
    read: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

notificationSchema.index({ owner: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
