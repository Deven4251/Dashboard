import mongoose from "mongoose";

export const PROJECT_STATUSES = [
  "Planning",
  "In Progress",
  "Testing",
  "Completed",
  "Maintenance",
  "Archived"
];

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: 120
    },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: "Planning",
      index: true
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    techStack: [{ type: String, trim: true, index: true }],
    githubUrl: String,
    liveUrl: String,
    localPath: String,
    startDate: Date,
    completionDate: Date,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true
    },
    tags: [{ type: String, trim: true, index: true }],
    notes: String
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, name: "text", description: "text", techStack: "text", tags: "text" });
projectSchema.index({ owner: 1, status: 1, updatedAt: -1 });

export const Project = mongoose.model("Project", projectSchema);
