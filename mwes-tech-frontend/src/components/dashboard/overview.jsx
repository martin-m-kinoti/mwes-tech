import React from "react";
import { Users, Star, TrendingUp, Briefcase } from "lucide-react";
import Card from "./card";
import TrendChart from "./trendChart";
import DataTable from "./dataTable";
import { formatDate } from "../../utils";
import "./overview.css";

const STATS = [
  { label: "Total Users", value: "128", delta: "+12 this month", icon: Users },
  { label: "Active Services", value: "46", delta: "+5 this month", icon: Briefcase },
  { label: "Growth", value: "18%", delta: "vs last quarter", icon: TrendingUp },
];

const RECENT_REQUESTS = [
  {
    id: 1,
    service: "Cyber Security",
    client: "User1",
    email: "user1@gmail.com",
    requestedAt: "2026-09-16T10:24:00",
    status: "In progress",
  },
  {
    id: 2,
    service: "Web Development",
    client: "User2",
    email: "user2@gmail.com",
    requestedAt: "2026-09-15T14:02:00",
    status: "Pending",
  },
  {
    id: 3,
    service: "Data Analytics",
    client: "User3",
    email: "user3@gmail.com",
    requestedAt: "2026-09-14T09:45:00",
    status: "Completed",
  },
  {
    id: 4,
    service: "Cyber Security",
    client: "User4",
    email: "user4@gmail.com",
    requestedAt: "2026-09-13T16:30:00",
    status: "In progress",
  },
];

function Overview() {
  return (
    <div className="overview">
      <div className="overview-grid">
        <div className="overview-left">
          <Card title="User stats">
            <div className="stats-list">
              {STATS.map(({ label, value, delta, icon: Icon }) => (
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

          <Card title="Overall Ratings" accent="gold" className="ratings-card">
            <div className="ratings-body">
              <div className="ratings-stars" aria-label="4.2 out of 5 stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={22}
                    className={n <= 4 ? "star filled" : "star"}
                  />
                ))}
              </div>
              <p className="ratings-score">4.2 / 5</p>
              <p className="ratings-note">Based on 38 client reviews</p>
            </div>
          </Card>
        </div>

        <div className="overview-right">
          <h2 className="section-title accent-orange">Services Trend</h2>
          <Card className="chart-card">
            <TrendChart />
          </Card>
        </div>
      </div>

      <div className="overview-full">
        <h2 className="section-title">Recent Service Requests</h2>
        <DataTable
          columns={[
            { key: "service", label: "Service" },
            { key: "email", label: "Client email" },
            { key: "requestedAt", label: "Requested", format: formatDate },
            { key: "status", label: "Status", accent: "orange" },
          ]}
          rows={RECENT_REQUESTS.map((r) => ({
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