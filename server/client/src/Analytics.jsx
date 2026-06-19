import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "./api/axios.js";
import ChartCard from "./ChartCard.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#64748B"];

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics").then(({ data }) => setData(data));
  }, []);

  if (!data) return <LoadingSpinner />;

  return (
    <section className="dashboard-grid">
      <ChartCard title="Projects by Status">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart><Pie data={data.statusCounts} dataKey="value" nameKey="name" outerRadius={105}>{data.statusCounts.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(148,163,184,.2)" }} /></PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Technology Usage">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.technologyUsage}><CartesianGrid stroke="rgba(148,163,184,.14)" /><XAxis dataKey="name" stroke="#94A3B8" /><YAxis stroke="#94A3B8" allowDecimals={false} /><Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(148,163,184,.2)" }} /><Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Monthly Upgrades">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyUpgrades}><CartesianGrid stroke="rgba(148,163,184,.14)" /><XAxis dataKey="month" stroke="#94A3B8" /><YAxis stroke="#94A3B8" allowDecimals={false} /><Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(148,163,184,.2)" }} /><Line type="monotone" dataKey="upgrades" stroke="#3B82F6" strokeWidth={3} /></LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Completion Trends">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.completionTrends}><CartesianGrid stroke="rgba(148,163,184,.14)" /><XAxis dataKey="name" stroke="#94A3B8" /><YAxis stroke="#94A3B8" /><Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(148,163,184,.2)" }} /><Line type="monotone" dataKey="progress" stroke="#F59E0B" strokeWidth={3} /></LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}
