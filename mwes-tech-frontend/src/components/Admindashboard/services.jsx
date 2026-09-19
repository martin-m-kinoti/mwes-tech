import React from "react";
import DataTable from "./dataTable";
import { formatDate } from "../../utils";
import "./views.css";

const SERVICES = [
  {
    id: 1,
    service: "Cyber Security",
    email: "user1@gmail.com",
    requestedAt: "2026-09-16T10:24:00",
    deadline: "2026-10-30T16:00:00",
    progress: 35,
  },
  {
    id: 2,
    service: "Web Development",
    email: "user2@gmail.com",
    requestedAt: "2026-09-15T14:02:00",
    deadline: "2026-12-15T16:00:00",
    progress: 60,
  },
  {
    id: 3,
    service: "Data Analytics",
    email: "user3@gmail.com",
    requestedAt: "2026-09-14T09:45:00",
    deadline: "2026-11-05T16:00:00",
    progress: 12,
  },
  {
    id: 4,
    service: "Cyber Security",
    email: "user4@gmail.com",
    requestedAt: "2026-09-13T16:30:00",
    deadline: "2026-10-12T16:00:00",
    progress: 80,
  },
  {
    id: 5,
    service: "Web Development",
    email: "user5@gmail.com",
    requestedAt: "2026-09-11T11:10:00",
    deadline: "2027-01-20T16:00:00",
    progress: 0,
  },
];

function Services() {
  const rows = SERVICES.map((s) => ({
    id: s.id,
    service: s.service,
    email: s.email,
    requestedAt: s.requestedAt,
    deadline: s.deadline,
    progress: s.progress,
  }));

  return (
    <div className="view">
      <div className="view-head">
        <h2 className="view-title">Services</h2>
        <p className="view-subtitle">Track client service requests and delivery progress.</p>
      </div>

      <DataTable
        columns={[
          { key: "service", label: "Service Name", accent: "teal" },
          { key: "email", label: "Client Username/email", accent: "orange" },
          { key: "requestedAt", label: "Request Timestamp", accent: "teal", format: formatDate },
          { key: "deadline", label: "Deadline", accent: "orange", format: formatDate },
          { key: "progress", label: "Progress Status", type: "progress" },
        ]}
        rows={rows}
        emptyMessage="No services yet."
      />
    </div>
  );
}

export default Services;