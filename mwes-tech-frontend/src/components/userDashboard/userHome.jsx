import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import "./userHome.css";

function UserHome() {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/orders");
      setRecent(data.orders || []);
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

  return (
    <div className="u-home">
      <div className="u-cards">
        <div className="u-card">
          <Link to="/dashboard/order" className="u-card-btn">
            Request a Service
          </Link>
        </div>

        <div className="u-card">
          <Link to="/dashboard/my-services" className="u-card-btn">
            My Services
          </Link>
        </div>
      </div>

      <h2 className="u-section-title">Recent Services</h2>

      {loading && <p className="u-recent-hint">Loading your services…</p>}
      {!loading && error && (
        <p className="u-recent-hint">
          {error} <button type="button" className="u-recent-retry" onClick={loadOrders}>Retry</button>
        </p>
      )}
      {!loading && !error && recent.length === 0 && (
        <p className="u-recent-hint">
          You haven’t requested any services yet.{" "}
          <Link to="/dashboard/order" className="u-recent-link">
            Place your first order
          </Link>
        </p>
      )}

      {recent.length > 0 && (
        <div className="u-recent-list">
          {recent.slice(0, 9).map((item) => (
            <div className="u-recent-row" key={item.id}>
              <span className="u-recent-service">{item.service}</span>
              <span className={`u-recent-status status-${item.status.toLowerCase().replace(" ", "-")}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserHome;