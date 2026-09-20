import React, { useCallback, useEffect, useState } from "react";
import { Users, Briefcase, Clock } from "lucide-react";
import Card from "./card";
import TrendChart from "./trendChart";
import DataTable from "./dataTable";
import { formatDate } from "../../utils";
import { api } from "../../api";
import "./overview.css";

function Overview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/admin/stats");
      setStats(data.stats);
      setRecent(data.recentOrders || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load dashboard stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statRows = stats
    ? [
        { label: "Total Users", value: String(stats.totalUsers), delta: "registered clients", icon: Users },
        { label: "Total Services", value: String(stats.totalOrders), delta: "all requested services", icon: Briefcase },
        { label: "Pending Requests", value: String(stats.pendingOrders + stats.inProgressOrders), delta: "awaiting completion", icon: Clock },
      ]
    : [];

  return (
    <div className="overview">
      {loading && <p className="view-loading">Loading dashboard…</p>}
      {!loading && error && (
        <div className="error-banner">
          <span>{error}</span>
          <button type="button" onClick={loadStats}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overview-grid">
          <div className="overview-left">
            <Card title="User stats">
              <div className="stats-list">
                {statRows.map(({ label, value, delta, icon: Icon }) => (
                  <div className="stat-row" key={label}>
                    <span className="stat-icon">
                      <Icon size={16} />
                    </span>
                    <div className="stat-info">
                      <p className="stat-value">{value}</p>
                      <p className="stat-label">{label}</p>
                      <p className="stat-delta">{delta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Request Pipeline" accent="gold" className="ratings-card">
              <div className="pipeline-body">
                <div className="pipeline-row">
                  <span className="pipeline-dot pending" />
                  <span className="pipeline-label">Pending</span>
                  <span className="pipeline-value">{stats.pendingOrders}</span>
                </div>
                <div className="pipeline-row">
                  <span className="pipeline-dot progress" />
                  <span className="pipeline-label">In progress</span>
                  <span className="pipeline-value">{stats.inProgressOrders}</span>
                </div>
                <div className="pipeline-row">
                  <span className="pipeline-dot completed" />
                  <span className="pipeline-label">Completed</span>
                  <span className="pipeline-value">{stats.completedOrders}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="overview-right">
            <h2 className="section-title accent-orange">Services Trend</h2>
            <Card className="chart-card">
              <TrendChart data={stats.monthlyOrders} />
            </Card>
          </div>
        </div>
      )}

      <div className="overview-full">
        <h2 className="section-title">Recent Service Requests</h2>
        <DataTable
          columns={[
            { key: "service", label: "Service" },
            { key: "email", label: "Client email" },
            { key: "requestedAt", label: "Requested", format: formatDate },
            { key: "status", label: "Status", accent: "orange" },
          ]}
          rows={recent.map((r) => ({
            ...r,
            service: (
              <span className="service-chip">{r.service}</span>
            ),
          }))}
          emptyMessage="No service requests yet."
        />
      </div>
    </div>
  );
}

export default Overview;