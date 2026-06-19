import { Bell, Bot, ChartSpline, FolderKanban, Gauge, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

const links = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/analytics", label: "Analytics", icon: ChartSpline },
  { to: "/assistant", label: "Assistant", icon: Bot },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = links.find((link) => link.to === location.pathname)?.label || "DevTrack";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">D</span>
          <strong>DevTrack</strong>
          <button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="icon-button menu-button" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <span>{title}</span>
            <h1>{title}</h1>
          </div>
          <div className="user-pill">
            <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
            <strong>{user?.name}</strong>
          </div>
        </header>
        <Outlet />
      </main>
      {open && <button className="sidebar-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
    </div>
  );
}
