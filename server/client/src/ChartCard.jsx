export default function ChartCard({ title, children }) {
  return (
    <section className="panel chart-panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="chart-body">{children}</div>
    </section>
  );
}
