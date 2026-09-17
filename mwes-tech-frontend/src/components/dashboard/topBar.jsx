import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import "./topBar.css";

const PLACEHOLDERS = [
  { match: "/dashboard", placeholder: "Search...", exact: true },
  { match: "/dashboard/users", placeholder: "Search user using username/email..." },
  { match: "/dashboard/services", placeholder: "Search by service (e.g. Cyber Security)..." },
  { match: "/dashboard/chat", placeholder: "Search by user..." },
];

function TopBar({ userName = "John Admin" }) {
  const location = useLocation();
  const [query, setQuery] = useState("");

  const placeholder = useMemo(() => {
    const view = PLACEHOLDERS.find(
      (p) =>
        (p.exact && location.pathname === p.match) ||
        (!p.exact && location.pathname.startsWith(p.match))
    );
    return view?.placeholder || "Search...";
  }, [location.pathname]);

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="topbar-notif"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <div className="topbar-user">
          <span className="topbar-user-name">{userName}</span>
          <span className="topbar-avatar" aria-hidden="true">
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;