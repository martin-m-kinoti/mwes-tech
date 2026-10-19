import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import TopBar from "./topBar";
import { useAuth } from "../../AuthContext";
import "./userDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigating from the drawer menu should close it again.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // While the drawer is open the page behind it must not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="user-shell">
      <Sidebar
        onLogout={handleLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      {menuOpen && (
        <div
          className="user-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="user-main">
        <TopBar onMenuClick={() => setMenuOpen(true)} />
        <main className="user-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
