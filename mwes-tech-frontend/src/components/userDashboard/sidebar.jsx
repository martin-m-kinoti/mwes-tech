import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  ShoppingCart,
  MessageCircle,
  Settings,
  CreditCard,
  LogOut,
  X,
} from "lucide-react";
import { BRAND } from "../../config";
import "./sidebar.css";

const MENU_ITEMS = [
  { key: "home", label: "Dashboard", to: "/dashboard", end: true, icon: LayoutDashboard },
  { key: "order", label: "Order", to: "/dashboard/order", icon: ShoppingCart },
  { key: "my-services", label: "My Services", to: "/dashboard/my-services", icon: Briefcase },
  { key: "chat", label: "Chat", to: "/dashboard/chat", icon: MessageCircle },
];

const OTHER_ITEMS = [
  { key: "settings", label: "Settings", to: "/dashboard/settings", icon: Settings },
  { key: "payments", label: "Payments", to: "/dashboard/payments", icon: CreditCard },
];

function Sidebar({ onLogout, open, onClose }) {
  const renderItems = (items) =>
    items.map(({ key, label, to, end, icon: Icon }) => (
      <NavLink
        key={key}
        to={to}
        end={end}
        className={({ isActive }) =>
          `u-nav-item${isActive ? " active" : ""}`
        }
      >
        <span className="u-nav-icon" aria-hidden="true">
          <Icon size={17} />
        </span>
        <span className="u-nav-pill">{label}</span>
      </NavLink>
    ));

  return (
    <aside className={`u-sidebar${open ? " u-sidebar-open" : ""}`}>
      <div className="u-sidebar-head">
        <Link to="/" className="u-brand" title="Back to landing page" aria-label="Go to landing page">
          <img className="u-logo" src="/mwes_logo.png" alt="logo" />
          <span className="u-brand-name">{BRAND}</span>
        </Link>
        <button
          type="button"
          className="u-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <div className="u-sidebar-divider" />

      <nav className="u-nav" aria-label="Main navigation">
        <p className="u-nav-label">Menu</p>
        {renderItems(MENU_ITEMS)}

        <div className="u-sidebar-divider" />

        <p className="u-nav-label">Others</p>
        {renderItems(OTHER_ITEMS)}
      </nav>

      <div className="u-sidebar-footer">
        <button type="button" className="u-logout" onClick={onLogout}>
          <span className="u-nav-icon" aria-hidden="true">
            <LogOut size={17} />
          </span>
          <span className="u-nav-pill">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
