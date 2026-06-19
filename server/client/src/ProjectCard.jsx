import { ExternalLink, FolderGit2, GitBranch, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "./utils/formatters.js";
import ProgressBar from "./ProgressBar.jsx";
import StatusBadge from "./StatusBadge.jsx";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <div>
          <Link to={`/projects/${project._id}`} className="project-title">
            {project.name}
          </Link>
          <p>{project.description || "No description added."}</p>
        </div>
        <StatusBadge value={project.status} />
      </div>
      <div className="project-progress-row">
        <ProgressBar value={project.progress} />
        <span>{project.progress}%</span>
      </div>
      <div className="chip-row">
        {project.techStack?.slice(0, 5).map((tech) => (
          <span className="chip" key={tech}>
            {tech}
          </span>
        ))}
      </div>
      <div className="project-meta">
        <span>{project.priority}</span>
        <span>{formatDate(project.startDate)}</span>
      </div>
      <div className="icon-actions">
        <Link aria-label="Open project" title="Open project" to={`/projects/${project._id}`}>
          <FolderGit2 size={17} />
        </Link>
        {project.githubUrl && (
          <a aria-label="Open repository" title="Open repository" href={project.githubUrl} target="_blank" rel="noreferrer">
            <GitBranch size={17} />
          </a>
        )}
        {project.liveUrl && (
          <a aria-label="Open deployment" title="Open deployment" href={project.liveUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={17} />
          </a>
        )}
        <Link aria-label="Edit project" title="Edit project" to={`/projects/${project._id}/edit`}>
          <Pencil size={17} />
        </Link>
      </div>
    </article>
  );
}
