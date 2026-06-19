const classMap = {
  Planning: "badge badge-info",
  "In Progress": "badge badge-primary",
  Testing: "badge badge-warning",
  Completed: "badge badge-success",
  Maintenance: "badge badge-warning",
  Archived: "badge badge-muted",
  Open: "badge badge-danger",
  Fixed: "badge badge-success",
  Closed: "badge badge-muted",
  Todo: "badge badge-muted",
  Review: "badge badge-info"
};

export default function StatusBadge({ value }) {
  return <span className={classMap[value] || "badge"}>{value}</span>;
}
