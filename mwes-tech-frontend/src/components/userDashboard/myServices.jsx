import React from "react";
import { formatDate } from "../../utils";
import "./myServices.css";

const MY_SERVICES = [
  {
    id: 1,
    service: "Web Design & Development",
    requestedAt: "2026-09-10T09:30:00",
    deliveryDate: "2026-12-15T16:00:00",
    status: "In progress",
  },
  {
    id: 2,
    service: "Data Analytics",
    requestedAt: "2026-08-28T14:12:00",
    deliveryDate: "2026-11-05T16:00:00",
    status: "In progress",
  },
  {
    id: 3,
    service: "AI & Automations",
    requestedAt: "2026-09-02T11:00:00",
    deliveryDate: "2026-10-30T16:00:00",
    status: "Pending",
  },
  {
    id: 4,
    service: "Cyber Security",
    requestedAt: "2026-06-20T10:05:00",
    deliveryDate: "2026-09-28T16:00:00",
    status: "Completed",
  },
];

function MyServices() {
  return (
    <div className="u-services">
      <h2 className="u-services-title">My Services</h2>

      {MY_SERVICES.length === 0 ? (
        <p className="u-services-empty">No services requested yet.</p>
      ) : (
        <table className="u-services-table">
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">Request Timestamp</th>
              <th scope="col">Delivery Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {MY_SERVICES.map((row) => (
              <tr key={row.id}>
                <td>{row.service}</td>
                <td>{formatDate(row.requestedAt)}</td>
                <td>{formatDate(row.deliveryDate)}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyServices;