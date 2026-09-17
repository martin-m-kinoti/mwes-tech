import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageCircle,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import "./navPanel.css";

const MENU_ITEMS = [
  { key: "overview", label: "Dashboard", to: "/dashboard", end: true, icon: LayoutDashboard },
  { key: "users", label: "Users", to: "/dashboard/users", icon: Users },
  { key: "services", label: "Services", to: "/dashboard/services", icon: Briefcase },
  { key: "chat", label: "Chat", to: "/dashboard/chat", icon: MessageCircle },
];

const OTHER_ITEMS = [
  { key: "settings", label: "Settings", to: "/dashboard/settings", icon: Settings },
  { key: "payments", label: "Payments", to: "/dashboard/payments", icon: CreditCard },
  { key: "help", label: "Help", to: "/dashboard/help", icon: HelpCircle },
];

function Sidebar({ onLogout }) {
  const renderItems = (items) =>
    items.map(({ key, label, to, end, icon: Icon }) => (
      <NavLink
        key={key}
        to={to}
        end={end}
        className={({ isActive }) =>
          `sidebar-item${isActive ? " active" : ""}`
        }
        aria-label={label}
      >
        <span className="sidebar-item-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <span className="sidebar-item-label">{label}</span>
      </NavLink>
    ));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          className="sidebar-logo"
          src="/mwes_logo.png"
          alt="meesTech logo"
        />
        <span className="sidebar-brand-name">meesTech</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="sidebar-label">Menu</p>
        {renderItems(MENU_ITEMS)}

        <p className="sidebar-label">Others</p>
        {renderItems(OTHER_ITEMS)}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;