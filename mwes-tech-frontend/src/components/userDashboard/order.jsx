import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import "./order.css";

const SERVICE_OPTIONS = [
  "Web Design & Development",
  "Data Analytics",
  "AI & Automations",
  "Cyber Security",
  "IT Consultation",
];

const DURATION_OPTIONS = ["1 Week", "2 Weeks", "1 Month", "2 Months"];

function Order() {
  const [service, setService] = useState("");
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [placing, setPlacing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!service || !deliveryDuration) {
      setError("Please select a service and a delivery duration.");
      return;
    }

    setPlacing(true);
    try {
      const data = await api.post("/api/orders", {
        service,
        deliveryDuration,
        comments,
      });
      const placed = data.order;
      setSuccess(
        `Order placed successfully. Estimated delivery: ${new Date(
          placed.deliveryDate
        ).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}.`
      );
      setService("");
      setDeliveryDuration("");
      setComments("");
    } catch (err) {
      setError(err.message || "Could not place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="order-view">
      <div className="order-head">
        <h2 className="order-title">Order a Service</h2>
        <p className="order-subtitle">
          Tell us what you need and we will get back to you with a plan.
        </p>
      </div>

      {success && (
        <div className="order-success">
          <p>{success}</p>
          <Link to="/dashboard/my-services" className="order-success-link">
            View My Services
          </Link>
        </div>
      )}

      {error && <div className="order-error">{error}</div>}

      <form className="order-form" onSubmit={handleSubmit}>
        <div className="order-field">
          <label htmlFor="order-service" className="order-label">
            Service
          </label>
          <select
            id="order-service"
            className="order-input"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="order-field">
          <label htmlFor="order-duration" className="order-label">
            Delivery Duration
          </label>
          <select
            id="order-duration"
            className="order-input"
            value={deliveryDuration}
            onChange={(e) => setDeliveryDuration(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a delivery duration
            </option>
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="order-field">
          <label htmlFor="order-comments" className="order-label">
            Comments <span className="order-optional">(optional)</span>
          </label>
          <textarea
            id="order-comments"
            className="order-textarea"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any details, goals or deadlines for this service..."
            rows="5"
          />
        </div>

        <button
          type="submit"
          className="order-submit"
          disabled={placing}
        >
          {placing ? "Placing order..." : "Order"}
        </button>
      </form>
    </div>
  );
}

export default Order;