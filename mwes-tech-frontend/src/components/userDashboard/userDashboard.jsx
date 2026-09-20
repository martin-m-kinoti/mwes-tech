import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import TopBar from "./topBar";
import { useAuth } from "../../AuthContext";
import "./userDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="user-shell">
      <Sidebar onLogout={handleLogout} />
      <div className="user-main">
        <TopBar />
        <main className="user-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;