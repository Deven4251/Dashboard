export default function ProgressBar({ value = 0 }) {
  return (
    <div className="progress">
      <span style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}
