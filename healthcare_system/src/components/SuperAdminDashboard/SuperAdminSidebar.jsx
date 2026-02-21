import React from "react";
import {
  Home,
  Settings,
  CheckSquare,
  Building2,
} from "lucide-react";
import "../SuperAdminDashboard/css/super-admin-sidebar.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
  {
    id: "approvalsWorkflow",
    label: "Pending Approvals",
    icon: <CheckSquare size={18} />,
  },
  {
    id: "hospitalManagement",
    label: "Approved List",
    icon: <Building2 size={18} />,
  },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function SuperAdminSidebar({
  open,
  active,
  onSelect,
}) {
  return (
    <aside className={open ? "super-sidebar expanded" : "super-sidebar collapsed"}>
      <nav className="menu-list">
        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`menu-item ${active === id ? "active" : ""}`}
            onClick={() => onSelect(id)}
            title={label}
          >
            <span className="menu-icon">{icon}</span>
            <span className="menu-label">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
