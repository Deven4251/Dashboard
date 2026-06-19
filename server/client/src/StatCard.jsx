export default function StatCard({ icon: Icon, label, value, tone = "primary" }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-icon">{Icon && <Icon size={20} />}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
