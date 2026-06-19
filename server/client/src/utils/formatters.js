export const formatDate = (date) => {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
};

export const toInputDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
};

export const splitList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const joinList = (value) => (Array.isArray(value) ? value.join(", ") : "");
