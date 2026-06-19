import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api/axios.js";
import EmptyState from "./EmptyState.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import ProjectCard from "./ProjectCard.jsx";

const filters = ["All", "Active", "Completed", "Maintenance", "Archived"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ search: "", filter: "All", priority: "" });

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.filter !== "All") params.set("filter", query.filter);
    if (query.priority) params.set("priority", query.priority);
    params.set("limit", "60");
    setLoading(true);
    api.get(`/projects?${params.toString()}`).then(({ data }) => setProjects(data.data)).finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="page-grid">
      <section className="toolbar">
        <div className="search-box"><Search size={18} /><input placeholder="Search projects, tech, tags" value={query.search} onChange={(event) => setQuery({ ...query, search: event.target.value })} /></div>
        <select value={query.filter} onChange={(event) => setQuery({ ...query, filter: event.target.value })}>{filters.map((filter) => <option key={filter}>{filter}</option>)}</select>
        <select value={query.priority} onChange={(event) => setQuery({ ...query, priority: event.target.value })}><option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
        <Link className="primary-button" to="/projects/new"><Plus size={18} />New Project</Link>
      </section>
      {loading ? <LoadingSpinner /> : projects.length ? (
        <section className="project-grid">{projects.map((project) => <ProjectCard project={project} key={project._id} />)}</section>
      ) : (
        <EmptyState title="No projects found" action={<Link className="primary-button" to="/projects/new">Create Project</Link>} />
      )}
    </div>
  );
}
