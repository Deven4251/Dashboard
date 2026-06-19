import mongoose from "mongoose";

export const TASK_STATUSES = ["Todo", "In Progress", "Review", "Completed"];

const taskSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 1200 },
    status: { type: String, enum: TASK_STATUSES, default: "Todo", index: true },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    dueDate: Date,
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, project: 1, status: 1, order: 1 });

export const Task = mongoose.model("Task", taskSchema);
