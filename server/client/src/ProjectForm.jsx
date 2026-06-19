import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "./api/axios.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { joinList, splitList, toInputDate } from "./utils/formatters.js";

const initial = {
  name: "",
  description: "",
  status: "Planning",
  progress: 0,
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  localPath: "",
  startDate: "",
  completionDate: "",
  priority: "Medium",
  tags: "",
  notes: ""
};

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(Boolean(id));
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!id) return;
    api.get(`/projects/${id}`).then(({ data }) => {
      const project = data.project;
      setForm({
        ...project,
        techStack: joinList(project.techStack),
        tags: joinList(project.tags),
        startDate: toInputDate(project.startDate),
        completionDate: toInputDate(project.completionDate)
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      progress: Number(form.progress),
      techStack: splitList(form.techStack),
      tags: splitList(form.tags),
      startDate: form.startDate || undefined,
      completionDate: form.completionDate || undefined
    };
    try {
      const { data } = isEditing ? await api.put(`/projects/${id}`, payload) : await api.post("/projects", payload);
      toast.success(isEditing ? "Project updated" : "Project created");
      navigate(`/projects/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save project");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form className="panel form-panel" onSubmit={submit}>
      <div className="panel-header">
        <h2>{isEditing ? "Edit Project" : "New Project"}</h2>
        <button className="primary-button"><Save size={18} />Save</button>
      </div>
      <div className="form-grid">
        <label className="span-2">Project Name<input required value={form.name} onChange={(event) => setField("name", event.target.value)} /></label>
        <label>Status<select value={form.status} onChange={(event) => setField("status", event.target.value)}><option>Planning</option><option>In Progress</option><option>Testing</option><option>Completed</option><option>Maintenance</option><option>Archived</option></select></label>
        <label>Priority<select value={form.priority} onChange={(event) => setField("priority", event.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
        <label className="span-2">Description<textarea value={form.description} onChange={(event) => setField("description", event.target.value)} /></label>
        <label>Progress<input type="number" min="0" max="100" value={form.progress} onChange={(event) => setField("progress", event.target.value)} /></label>
        <label>Tech Stack<input value={form.techStack} onChange={(event) => setField("techStack", event.target.value)} /></label>
        <label>GitHub URL<input value={form.githubUrl} onChange={(event) => setField("githubUrl", event.target.value)} /></label>
        <label>Live URL<input value={form.liveUrl} onChange={(event) => setField("liveUrl", event.target.value)} /></label>
        <label className="span-2">Local Folder Path<input value={form.localPath} onChange={(event) => setField("localPath", event.target.value)} /></label>
        <label>Start Date<input type="date" value={form.startDate} onChange={(event) => setField("startDate", event.target.value)} /></label>
        <label>Completion Date<input type="date" value={form.completionDate} onChange={(event) => setField("completionDate", event.target.value)} /></label>
        <label className="span-2">Tags<input value={form.tags} onChange={(event) => setField("tags", event.target.value)} /></label>
        <label className="span-2">Notes<textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} /></label>
      </div>
    </form>
  );
}
