import { Archive, CheckCircle2, FolderKanban, Gauge, Hammer } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "./api/axios.js";
import ChartCard from "./ChartCard.jsx";
import EmptyState from "./EmptyState.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import StatCard from "./StatCard.jsx";
import { formatDate } from "./utils/formatters.js";

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#64748B"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics").then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <EmptyState title="Analytics unavailable" />;

  return (
    <div className="page-grid">
      <section className="stats-grid">
        <StatCard icon={FolderKanban} label="Total Projects" value={data.summary.total} />
        <StatCard icon={Gauge} label="Active" value={data.summary.active} />
        <StatCard icon={CheckCircle2} label="Completed" value={data.summary.completed} tone="success" />
        <StatCard icon={Hammer} label="Maintenance" value={data.summary.maintenance} tone="warning" />
        <StatCard icon={Archive} label="Archived" value={data.summary.archived} tone="muted" />
      </section>
      <section className="dashboard-grid">
        <ChartCard title="Status Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.statusCounts} dataKey="value" nameKey="name" innerRadius={64} outerRadius={96} paddingAngle={4}>
                {data.statusCounts.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(148,163,184,.2)" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monthly Upgrades">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyUpgrades}>
              <CartesianGrid stroke="rgba(148,163,184,.14)" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(148,163,184,.2)" }} />
              <Area type="monotone" dataKey="upgrades" stroke="#3B82F6" fill="#1D4ED855" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
      <section className="two-column">
        <div className="panel">
          <div className="panel-header"><h2>Recent Upgrades</h2></div>
          <div className="timeline">
            {data.recentUpgrades.length ? data.recentUpgrades.map((upgrade) => (
              <article key={upgrade._id}><span /><div><strong>{upgrade.project?.name} {upgrade.version}</strong><p>{upgrade.changes?.join(", ") || "No changes listed"}</p><small>{formatDate(upgrade.date)}</small></div></article>
            )) : <EmptyState title="No upgrades yet" />}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><h2>Activity Feed</h2></div>
          <div className="activity-list">
            {data.recentActivity.length ? data.recentActivity.map((item) => (
              <article key={item._id}><strong>{item.title}</strong><p>{item.description}</p><small>{formatDate(item.createdAt)}</small></article>
            )) : <EmptyState title="No activity yet" />}
          </div>
        </div>
      </section>
    </div>
  );
}
