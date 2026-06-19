import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import api from "./api/axios.js";
import EmptyState from "./EmptyState.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { formatDate } from "./utils/formatters.js";

export default function Notifications() {
  const [data, setData] = useState(null);
  const load = () => api.get("/notifications?limit=60").then(({ data }) => setData(data));

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    await api.patch("/notifications/read-all");
    load();
  };

  if (!data) return <LoadingSpinner />;

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Notifications</h2>
        <button className="secondary-button" onClick={markAll}><CheckCheck size={18} />Mark Read</button>
      </div>
      <div className="activity-list">
        {data.data.length ? data.data.map((item) => (
          <article className={item.read ? "" : "unread"} key={item._id}>
            <strong>{item.title}</strong>
            <p>{item.message}</p>
            <small>{formatDate(item.createdAt)}</small>
          </article>
        )) : <EmptyState title="No notifications" />}
      </div>
    </section>
  );
}
