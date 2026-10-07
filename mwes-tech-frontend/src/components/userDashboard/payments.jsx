import React, { useEffect, useState } from "react";
import "./payments.css";
import { useAuth } from "../../AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Payments() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    serviceId: "",
    phone: "",
    amount: "",
  });
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);
  const [history, setHistory] = useState([]);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "User"
    : "Guest";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/api/orders`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("mwes_token") || ""}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.orders || [];
          setServices(list);
            if (list.length && !form.serviceId) {
              const first = list[0];
              setForm((f) => ({
                ...f,
                serviceId: String(first.id || first._id || first.orderId || first.service || first.name || ""),
              }));
            } else if (list.length) {
              // ensure current value still valid
              const current = form.serviceId;
              const valid = list.some((x) =>
                String(x.id || x._id || x.orderId || x.service || x.name || "") === current
              );
              if (!valid) {
                const first = list[0];
                setForm((f) => ({
                  ...f,
                  serviceId: String(first.id || first._id || first.orderId || first.service || first.name || ""),
                }));
              }
            }
        }
      } catch (e) {
        // ignore
      }
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchMine = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/api/payments/mine`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (e) {}
    };
    fetchMine();
  }, [user, status]);

  const normalizePhone = (p) => {
    let v = String(p).replace(/\s+/g, "").replace(/-/g, "");
    if (v.startsWith("+")) v = v.slice(1);
    if (v.startsWith("0")) v = "254" + v.slice(1);
    if (/^7\d{8}$/.test(v) || /^1\d{8}$/.test(v)) v = "254" + v;
    return v;
  };

  const validate = () => {
    const e = {};
    if (!form.serviceId) e.serviceId = "Select a service";
    if (!form.phone) e.phone = "Mpesa number is required";
    else {
      const n = normalizePhone(form.phone);
      if (!/^(2547|2541)\d{8}$/.test(n)) e.phone = "Enter a valid Kenyan number";
    }
    if (!form.amount) e.amount = "Amount is required";
    else {
      const amt = Number(form.amount);
      if (!Number.isFinite(amt) || amt <= 0) e.amount = "Amount must be greater than 0";
      if (!Number.isInteger(amt)) e.amount = "Amount must be a whole number (KES)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pollStatus = (id) => {
    let tries = 0;
    const max = 40;
    const iv = setInterval(async () => {
      tries++;
      try {
        const res = await fetch(`${API_BASE}/api/payments/status/${id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStatus({
            status: data.status,
            mpesaReceipt: data.mpesaReceipt,
            amountPaid: data.amountPaid,
            transactionDate: data.transactionDate,
            failReason: data.failReason,
          });
          if (data.status !== "PENDING" || tries >= max) {
            clearInterval(iv);
            setLoading(false);
          }
        } else {
          if (tries >= max) {
            clearInterval(iv);
            setLoading(false);
          }
        }
      } catch (e) {
        if (tries >= max) {
          clearInterval(iv);
          setLoading(false);
        }
      }
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);
    setStatus(null);
    setCheckoutId(null);
    try {
      const res = await fetch(`${API_BASE}/api/payments/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: form.phone,
          amount: Number(form.amount),
          serviceId: form.serviceId,
          description: services.find((s) => String(s.id || s._id || s.orderId || s.service) === String(form.serviceId))?.service || "mwesTech Payment",
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutRequestId) {
        setCheckoutId(data.checkoutRequestId);
        setStatus({ status: "PENDING" });
        pollStatus(data.checkoutRequestId);
      } else {
        setErrors({ submit: data.error || "Failed to initiate payment" });
        setLoading(false);
      }
    } catch (err) {
      setErrors({ submit: "Network error. Try again." });
      setLoading(false);
    }
  };

  const getStatusText = () => {
    if (!status) return null;
    if (status.status === "PENDING") return "Awaiting confirmation… (Check your phone for the M-Pesa prompt)";
    if (status.status === "SUCCESS") return `Payment successful${status.mpesaReceipt ? ` — Receipt: ${status.mpesaReceipt}` : ""}`;
    if (status.status === "FAILED") return `Payment failed${status.failReason ? ` — ${status.failReason}` : ""}`;
    return status.status;
  };

  const formatDt = (d) => {
    if (!d) return "";
    const s = String(d);
    if (s.length === 14) {
      return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)} ${s.slice(8,10)}:${s.slice(10,12)}:${s.slice(12,14)}`;
    }
    try {
      return new Date(d).toLocaleString();
    } catch {
      return s;
    }
  };

  return (
    <div className="pay-wrap">
      <h1 className="pay-title">Make Payment</h1>

      <form className="pay-form" onSubmit={handleSubmit}>
        <div className="pay-field">
          <label className="pay-label">My Service</label>
          <select
            className="pay-input pay-select"
            value={form.serviceId}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
          >
            {services.map((s) => {
              const id = s.id || s._id || s.orderId || s.service;
              const label = s.service || s.name || s.title || s.serviceName || "Service";
              const value = String(id || s.service || label || "");
              return (
                <option key={id || label || value} value={value}>
                  {label}
                </option>
              );
            })}
            {!services.length && <option value="">No services</option>}
          </select>
          {errors.serviceId && <span className="pay-error">{errors.serviceId}</span>}
        </div>

        <div className="pay-field">
          <label className="pay-label">Mpesa Number</label>
          <input
            type="tel"
            inputMode="numeric"
            className="pay-input"
            placeholder="07XXXXXXXX or 2547XXXXXXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <span className="pay-error">{errors.phone}</span>}
        </div>

        <div className="pay-field">
          <label className="pay-label">Amount</label>
          <input
            type="number"
            min="1"
            step="1"
            className="pay-input"
            placeholder="KES"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          {errors.amount && <span className="pay-error">{errors.amount}</span>}
        </div>

        {errors.submit && <div className="pay-submit-error">{errors.submit}</div>}

        <div className="pay-btn-wrap">
          <button className="pay-btn" type="submit" disabled={loading || !services.length}>
            {loading ? "Processing…" : "Pay"}
          </button>
        </div>
      </form>

      <div className="pay-status-wrap">
        <label className="pay-label pay-status-label">Payment Status</label>
        {status && (
          <div className="pay-status-text">{getStatusText()}</div>
        )}
        <div className={`pay-bar pay-bar-1 ${status ? "pay-bar-active" : ""}`} />
        <div className={`pay-bar pay-bar-2 ${status ? "pay-bar-active" : ""}`} />
        <div className={`pay-bar pay-bar-3 ${status ? "pay-bar-active" : ""}`} />
      </div>

      {history.length > 0 && (
        <div className="pay-history">
          <div className="pay-history-title">Recent Payments</div>
          {history.map((h) => (
            <div className="pay-history-row" key={h.id || h.checkoutRequestId}>
              <div className="pay-h-col">
                <div className="pay-h-main">{h.serviceId}</div>
                <div className="pay-h-sub">{formatDt(h.transactionDate || h.updatedAt || h.createdAt)}</div>
              </div>
              <div className="pay-h-col pay-h-right">
                <div className="pay-h-amt">KES {h.amountPaid || h.amount}</div>
                <div className={`pay-h-status pay-h-${(h.status || "").toLowerCase()}`}>{h.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}