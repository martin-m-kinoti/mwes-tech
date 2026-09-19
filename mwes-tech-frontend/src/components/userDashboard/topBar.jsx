import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import "./topBar.css";

const PLACEHOLDERS = [
  { match: "/dashboard", placeholder: "Search...", exact: true },
  { match: "/dashboard/my-services", placeholder: "Search by service..." },
  { match: "/dashboard/chat", placeholder: "Search by username..." },
];

function TopBar({ userName = "user_name" }) {
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

  return (
    <header className="u-topbar">
      <div className="u-search">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <Search size={16} className="u-search-icon" aria-hidden="true" />
      </div>

      <div className="u-actions">
        <span className="u-user-name">{userName}</span>
        <span className="u-avatar" aria-hidden="true">
          U
        </span>
        <button type="button" className="u-notif" aria-label="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;