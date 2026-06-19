import mongoose from "mongoose";

export const ISSUE_STATUSES = ["Open", "In Progress", "Fixed", "Closed"];

const issueSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 1500 },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium", index: true },
    status: { type: String, enum: ISSUE_STATUSES, default: "Open", index: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

issueSchema.index({ owner: 1, project: 1, status: 1, severity: 1 });

export const Issue = mongoose.model("Issue", issueSchema);
