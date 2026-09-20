import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../api";
import { formatDate } from "../../utils";
import "./myServices.css";

function MyServices() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/orders");
      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load your services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const rows = orders.map((o) => ({
    id: o.id,
    service: o.service,
    requestedAt: o.createdAt,
    deliveryDate: o.deliveryDate,
    status: o.status,
  }));

  return (
    <div className="u-services">
      <h2 className="u-services-title">My Services</h2>

      {loading && <p className="u-services-empty">Loading services…</p>}
      {!loading && error && <p className="u-services-empty">{error}</p>}
      {!loading && !error && rows.length === 0 && (
        <p className="u-services-empty">No services requested yet.</p>
      )}

      {rows.length > 0 && (
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
            {rows.map((row) => (
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