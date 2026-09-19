import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./navPanel";
import TopBar from "./topBar";
import "./dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/signin");
  };

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} />
      <div className="app-main">
        <TopBar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;