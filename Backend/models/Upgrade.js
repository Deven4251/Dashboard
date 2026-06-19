import mongoose from "mongoose";

const upgradeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    version: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now, index: true },
    changes: [{ type: String, trim: true }],
    notes: String
  },
  { timestamps: true }
);

upgradeSchema.index({ owner: 1, project: 1, date: -1 });

export const Upgrade = mongoose.model("Upgrade", upgradeSchema);
