import React, { useState } from "react";
import Sidebar from "./navPanel";
import "./dashboard.css";

function Dashboard() {
  const [activeKey, setActiveKey] = useState("overview");

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <Sidebar
          activeKey={activeKey}
          onNavigate={setActiveKey}
          onSearch={(query) => console.log("Searching for:", query)}
          onLogout={() => console.log("logout")}
        />
      </aside>

      <main className="dashboard-content">
        <div className="tab-header">
          <h1 className="tab-title">Dashboard</h1>
        </div>
        <div className="clients-stats-card">
          <p className="card-title">Clients</p>
        </div>
        <div className="services-stats-card">
          <p className="card-title">Services Rendered</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;