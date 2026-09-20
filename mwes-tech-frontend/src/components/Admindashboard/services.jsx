import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./dataTable";
import { formatDate } from "../../utils";
import { api } from "../../api";
import "./views.css";

const STATUS_OPTIONS = ["Pending", "In progress", "Completed"];

function Services() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/admin/orders");
      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = useCallback(
    async (row, status) => {
      try {
        await api.patch(`/api/admin/orders/${row.id}`, { status });
        setOrders((prev) =>
          prev.map((o) => (o.id === row.id ? { ...o, status } : o))
        );
      } catch (err) {
        setError(err.message || "Could not update the order.");
      }
    },
    []
  );

  const rows = orders.map((o) => ({
    id: o.id,
    service: o.service,
    email: o.User?.email || "—",
    requestedAt: o.createdAt,
    deadline: o.deliveryDate,
    status: o.status,
  }));

  return (
    <div className="view">
      <div className="view-head">
        <h2 className="view-title">Services</h2>
        <p className="view-subtitle">Track client service requests and delivery progress.</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button type="button" onClick={loadOrders}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="view-loading">Loading services…</div>
      ) : (
        <DataTable
          columns={[
            { key: "service", label: "Service Name", accent: "teal" },
            { key: "email", label: "Client Username/email", accent: "orange" },
            { key: "requestedAt", label: "Request Timestamp", accent: "teal", format: formatDate },
            { key: "deadline", label: "Deadline", accent: "orange", format: formatDate },
            {
              key: "status",
              label: "Progress Status",
              type: "select",
              accent: "teal",
              options: STATUS_OPTIONS,
              onChange: handleStatusChange,
            },
          ]}
          rows={rows}
          emptyMessage="No services yet."
        />
      )}
    </div>
  );
}

export default Services;