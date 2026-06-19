import { ExternalLink, GitBranch, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import api from "./api/axios.js";
import EmptyState from "./EmptyState.jsx";
import KanbanBoard from "./KanbanBoard.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import ProgressBar from "./ProgressBar.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { formatDate, splitList } from "./utils/formatters.js";

const tabs = ["Overview", "Tasks", "Upgrades", "Maintenance", "Activity"];

export default function ProjectDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [active, setActive] = useState("Overview");
  const [task, setTask] = useState({ title: "", description: "", priority: "Medium", status: "Todo" });
  const [upgrade, setUpgrade] = useState({ version: "", changes: "" });
  const [issue, setIssue] = useState({ title: "", description: "", severity: "Medium", status: "Open" });

  const load = () => api.get(`/projects/${id}`).then(({ data }) => setData(data));

  useEffect(() => {
    load();
  }, [id]);

  if (!data) return <LoadingSpinner />;
  const { project } = data;
  const setTasks = (tasks) => setData((current) => ({ ...current, tasks }));

  const addTask = async (event) => {
    event.preventDefault();
    const { data: created } = await api.post("/tasks", { ...task, project: id });
    setData((current) => ({ ...current, tasks: [...current.tasks, created] }));
    setTask({ title: "", description: "", priority: "Medium", status: "Todo" });
    toast.success("Task added");
  };

  const addUpgrade = async (event) => {
    event.preventDefault();
    await api.post("/upgrades", { ...upgrade, project: id, changes: splitList(upgrade.changes) });
    setUpgrade({ version: "", changes: "" });
    toast.success("Upgrade added");
    load();
  };

  const addIssue = async (event) => {
    event.preventDefault();
    await api.post("/issues", { ...issue, project: id });
    setIssue({ title: "", description: "", severity: "Medium", status: "Open" });
    toast.success("Issue added");
    load();
  };

  return (
    <div className="page-grid">
      <section className="project-hero">
        <div>
          <div className="hero-meta"><StatusBadge value={project.status} /><span>{project.priority}</span></div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <div className="project-progress-row wide"><ProgressBar value={project.progress} /><span>{project.progress}%</span></div>
        </div>
        <div className="project-links">
          {project.githubUrl && <a className="secondary-button" href={project.githubUrl} target="_blank" rel="noreferrer"><GitBranch size={18} />Repo</a>}
          {project.liveUrl && <a className="secondary-button" href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink size={18} />Live</a>}
          <Link className="primary-button" to={`/projects/${project._id}/edit`}>Edit</Link>
        </div>
      </section>

      <div className="tabs">{tabs.map((tab) => <button className={active === tab ? "active" : ""} onClick={() => setActive(tab)} key={tab}>{tab}</button>)}</div>

      {active === "Overview" && (
        <section className="two-column">
          <div className="panel">
            <div className="panel-header"><h2>Overview</h2></div>
            <dl className="detail-list">
              <div><dt>Started</dt><dd>{formatDate(project.startDate)}</dd></div>
              <div><dt>Completion</dt><dd>{formatDate(project.completionDate)}</dd></div>
              <div><dt>Local Path</dt><dd>{project.localPath || "Not set"}</dd></div>
              <div><dt>Notes</dt><dd>{project.notes || "No notes"}</dd></div>
            </dl>
          </div>
          <div className="panel">
            <div className="panel-header"><h2>Technology Stack</h2></div>
            <div className="chip-row">{project.techStack?.map((tech) => <span className="chip" key={tech}>{tech}</span>)}</div>
            <div className="panel-header compact"><h2>Tags</h2></div>
            <div className="chip-row">{project.tags?.map((tag) => <span className="chip muted" key={tag}>{tag}</span>)}</div>
          </div>
        </section>
      )}

      {active === "Tasks" && (
        <section className="page-grid">
          <form className="inline-form" onSubmit={addTask}>
            <input required placeholder="Task title" value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} />
            <input placeholder="Description" value={task.description} onChange={(event) => setTask({ ...task, description: event.target.value })} />
            <select value={task.priority} onChange={(event) => setTask({ ...task, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
            <button className="primary-button"><Plus size={18} />Task</button>
          </form>
          <KanbanBoard tasks={data.tasks} setTasks={setTasks} />
        </section>
      )}

      {active === "Upgrades" && (
        <section className="two-column">
          <form className="panel small-form" onSubmit={addUpgrade}>
            <div className="panel-header"><h2>Add Upgrade</h2></div>
            <input required placeholder="Version, e.g. v1.2" value={upgrade.version} onChange={(event) => setUpgrade({ ...upgrade, version: event.target.value })} />
            <textarea placeholder="Changes, comma separated" value={upgrade.changes} onChange={(event) => setUpgrade({ ...upgrade, changes: event.target.value })} />
            <button className="primary-button"><Plus size={18} />Upgrade</button>
          </form>
          <div className="panel"><div className="panel-header"><h2>Timeline</h2></div><div className="timeline">{data.upgrades.length ? data.upgrades.map((item) => <article key={item._id}><span /><div><strong>{item.version}</strong><p>{item.changes.join(", ")}</p><small>{formatDate(item.date)}</small></div></article>) : <EmptyState title="No upgrades yet" />}</div></div>
        </section>
      )}

      {active === "Maintenance" && (
        <section className="two-column">
          <form className="panel small-form" onSubmit={addIssue}>
            <div className="panel-header"><h2>Report Issue</h2></div>
            <input required placeholder="Issue title" value={issue.title} onChange={(event) => setIssue({ ...issue, title: event.target.value })} />
            <textarea placeholder="Description" value={issue.description} onChange={(event) => setIssue({ ...issue, description: event.target.value })} />
            <select value={issue.severity} onChange={(event) => setIssue({ ...issue, severity: event.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
            <button className="primary-button"><Plus size={18} />Issue</button>
          </form>
          <div className="activity-list">{data.issues.length ? data.issues.map((item) => <article key={item._id}><strong>{item.title}</strong><p>{item.description}</p><div className="hero-meta"><StatusBadge value={item.status} /><span>{item.severity}</span></div></article>) : <EmptyState title="No maintenance issues" />}</div>
        </section>
      )}

      {active === "Activity" && (
        <section className="panel"><div className="panel-header"><h2>History</h2></div><div className="activity-list">{data.activities.length ? data.activities.map((item) => <article key={item._id}><strong>{item.title}</strong><p>{item.description}</p><small>{formatDate(item.createdAt)}</small></article>) : <EmptyState title="No activity yet" />}</div></section>
      )}
    </div>
  );
}
