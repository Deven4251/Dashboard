import { Activity } from "../models/Activity.js";
import { Project, PROJECT_STATUSES } from "../models/Project.js";
import { Upgrade } from "../models/Upgrade.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const [projects, upgrades, recentActivity] = await Promise.all([
    Project.find({ owner }).lean(),
    Upgrade.find({ owner }).sort({ date: -1 }).limit(100).populate("project", "name").lean(),
    Activity.find({ owner }).sort({ createdAt: -1 }).limit(10).lean()
  ]);

  const statusCounts = PROJECT_STATUSES.map((status) => ({
    name: status,
    value: projects.filter((project) => project.status === status).length
  }));

  const summary = {
    total: projects.length,
    active: projects.filter((project) => ["Planning", "In Progress", "Testing"].includes(project.status)).length,
    completed: projects.filter((project) => project.status === "Completed").length,
    maintenance: projects.filter((project) => project.status === "Maintenance").length,
    archived: projects.filter((project) => project.status === "Archived").length
  };

  const monthlyUpgrades = Object.values(
    upgrades.reduce((acc, upgrade) => {
      const key = new Date(upgrade.date).toISOString().slice(0, 7);
      acc[key] ||= { month: key, upgrades: 0 };
      acc[key].upgrades += 1;
      return acc;
    }, {})
  ).reverse();

  const completionTrends = projects
    .filter((project) => project.completionDate)
    .sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate))
    .map((project) => ({
      name: project.name,
      date: project.completionDate,
      progress: project.progress
    }));

  const technologyUsage = Object.values(
    projects.flatMap((project) => project.techStack).reduce((acc, tech) => {
      const key = tech.trim();
      if (!key) return acc;
      acc[key] ||= { name: key, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  res.json({
    summary,
    statusCounts,
    monthlyUpgrades,
    completionTrends,
    technologyUsage,
    recentUpgrades: upgrades.slice(0, 8),
    recentActivity
  });
});
