import { Project } from "../models/Project.js";
import { Upgrade } from "../models/Upgrade.js";

const formatProject = (project) => `${project.name} (${project.status}, ${project.progress}% complete)`;

export const answerProjectQuestion = async (owner, question) => {
  const normalized = question.toLowerCase();
  const projects = await Project.find({ owner }).sort({ updatedAt: -1 }).lean();

  if (!projects.length) {
    return "You do not have any projects yet. Create a project and I can answer questions about it.";
  }

  if (normalized.includes("maintenance")) {
    const matches = projects.filter((project) => project.status === "Maintenance");
    return matches.length
      ? `Maintenance projects: ${matches.map(formatProject).join(", ")}.`
      : "No projects are currently in maintenance.";
  }

  if (normalized.includes("highest") || normalized.includes("most complete")) {
    const best = [...projects].sort((a, b) => b.progress - a.progress)[0];
    return `${best.name} has the highest completion percentage at ${best.progress}%.`;
  }

  if (normalized.includes("upgrade")) {
    const project = projects.find((item) => normalized.includes(item.name.toLowerCase()));
    const query = project ? { owner, project: project._id } : { owner };
    const upgrades = await Upgrade.find(query).populate("project", "name").sort({ date: -1 }).limit(8).lean();
    if (!upgrades.length) return "No upgrade logs match that question yet.";
    return upgrades
      .map((upgrade) => `${upgrade.project.name} ${upgrade.version}: ${upgrade.changes.join("; ") || "No changes listed"}`)
      .join("\n");
  }

  const techMatch = projects.filter((project) =>
    project.techStack.some((tech) => normalized.includes(tech.toLowerCase()))
  );
  if (techMatch.length) {
    return `Matching projects: ${techMatch.map(formatProject).join(", ")}.`;
  }

  if (normalized.includes("active")) {
    const matches = projects.filter((project) => ["Planning", "In Progress", "Testing"].includes(project.status));
    return matches.length ? `Active projects: ${matches.map(formatProject).join(", ")}.` : "No active projects found.";
  }

  return "I can answer questions about project status, technologies, upgrades, maintenance, and completion percentage. OpenAI integration can be connected here later for richer natural-language answers.";
};
