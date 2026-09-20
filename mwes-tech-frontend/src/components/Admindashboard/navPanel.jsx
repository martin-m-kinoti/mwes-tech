import React from "react";
import { NavLink, Link } from "react-router-dom";
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
import { BRAND } from "../../config";
import "./navPanel.css";

const MENU_ITEMS = [
  { key: "overview", label: "Dashboard", to: "/admin", end: true, icon: LayoutDashboard },
  { key: "users", label: "Users", to: "/admin/users", icon: Users },
  { key: "services", label: "Services", to: "/admin/services", icon: Briefcase },
  { key: "chat", label: "Chat", to: "/admin/chat", icon: MessageCircle },
];

const OTHER_ITEMS = [
  { key: "settings", label: "Settings", to: "/admin/settings", icon: Settings },
  { key: "payments", label: "Payments", to: "/admin/payments", icon: CreditCard },
  { key: "help", label: "Help", to: "/admin/help", icon: HelpCircle },
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
      <Link to="/" className="sidebar-brand" title="Back to landing page" aria-label="Go to landing page">
        <img
          className="sidebar-logo"
          src="/mwes_logo.png"
          alt="mwesTech logo"
        />
        <span className="sidebar-brand-name">{BRAND}</span>
      </Link>

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
          <span className="sidebar-item-icon" aria-hidden="true">
          <LogOut size={18} />
        </span>
        <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;