import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", index: true },
    type: {
      type: String,
      enum: ["project", "status", "upgrade", "issue", "task", "profile", "system"],
      default: "system",
      index: true
    },
    title: { type: String, required: true },
    description: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

activitySchema.index({ owner: 1, createdAt: -1 });

export const Activity = mongoose.model("Activity", activitySchema);
