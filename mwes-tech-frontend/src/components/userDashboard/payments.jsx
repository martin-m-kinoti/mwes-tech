import React, { useEffect, useRef, useState } from "react";
import "./payments.css";
import { useAuth } from "../../AuthContext";
import { auth } from "../../firebase";
import { track } from "../../analytics";

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
  // "sending" = initiate request in flight, "awaiting" = polling for the PIN entry.
  const [phase, setPhase] = useState(null);
  const [events, setEvents] = useState([]);
  const [result, setResult] = useState(null);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const pollRef = useRef(null);

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

  const orderId = (s) => String(s.id ?? s._id ?? s.orderId ?? "");

  const serviceLabel = (id) => {
    const match = services.find((s) => orderId(s) === String(id));
    return match?.service || match?.name || match?.title || match?.serviceName || id;
  };

  const authHeader = async () => {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: {
            ...(await authHeader()),
          },
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.orders || [];
          setServices(list);
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
          headers: {
            ...(await authHeader()),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (e) {}
    };
    fetchMine();
  }, [user, result]);

  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

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
    let failures = 0;
    const maxTries = 50;
    const maxFailures = 4;

    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      tries++;
      try {
        const res = await fetch(`${API_BASE}/api/payments/status/${id}`, {
          headers: {
            ...(await authHeader()),
          },
        });
        if (!res.ok) throw new Error("status error");
        failures = 0;

        const data = await res.json();
        setEvents(data.events || []);
        if (data.final) {
          clearInterval(pollRef.current);
          setPhase(null);
          setResult({
            status: data.status,
            mpesaReceipt: data.mpesaReceipt,
            amountPaid: data.amountPaid,
          });
          if (data.status === "SUCCESS") {
            track("service_secured", {
              service_id: form.serviceId,
              order_id: form.serviceId,
              mpesa_receipt: data.mpesaReceipt || null,
            });
          } else {
            track("payment_failed", {
              service_id: form.serviceId,
              order_id: form.serviceId,
              reason: data.status || "unknown",
            });
          }
        } else if (tries >= maxTries) {
          clearInterval(pollRef.current);
          setPhase(null);
          setNote(
            "This is taking longer than expected. Check Recent Payments below in a moment — if money was deducted it will show there."
          );
        }
      } catch (e) {
        if (++failures >= maxFailures) {
          clearInterval(pollRef.current);
          setPhase(null);
          setNote(
            "We lost connection while checking your payment. If money was deducted it will appear in Recent Payments shortly; otherwise please try again."
          );
        }
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phase || !validate()) return;
    setPhase("sending");
    setResult(null);
    setEvents([]);
    setNote("");
    try {
      const res = await fetch(`${API_BASE}/api/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeader()),
        },
        body: JSON.stringify({
          phone: form.phone,
          amount: Number(form.amount),
          serviceId: form.serviceId,
          description: services.find((s) => orderId(s) === String(form.serviceId))?.service || "mwesTech Payment",
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutRequestId) {
        setEvents(data.events || []);
        setPhase("awaiting");
        pollStatus(data.checkoutRequestId);
      } else {
        setErrors({ submit: data.error || "Failed to initiate payment" });
        setPhase(null);
        track("payment_failed", {
          service_id: form.serviceId,
          order_id: form.serviceId,
          reason: data.error || "initiate_failed",
        });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Try again." });
      setPhase(null);
      track("payment_failed", {
        service_id: form.serviceId,
        order_id: form.serviceId,
        reason: "network_error",
      });
    }
  };

  const formatTime = (t) => {
    try {
      return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
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
            <option value="">
              {services.length ? "Select a service" : "No services ordered"}
            </option>
            {services.map((s) => {
              const id = orderId(s);
              const label = s.service || s.name || s.title || s.serviceName || "Service";
              const value = id || label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
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
          <button className="pay-btn" type="submit" disabled={!!phase || !services.length}>
            {phase === "sending" && (
              <>
                <span className="pay-spin" aria-hidden="true" />
                Sending M-Pesa prompt…
              </>
            )}
            {phase === "awaiting" && (
              <>
                <span className="pay-spin" aria-hidden="true" />
                Waiting for your PIN…
              </>
            )}
            {!phase && "Pay"}
          </button>
        </div>
      </form>

      <div className="pay-status-wrap">
        <label className="pay-label pay-status-label">Payment Progress</label>

        {phase === "sending" && (
          <div className="pay-status-text">Sending the payment request to Safaricom…</div>
        )}

        {events.length > 0 && (
          <ul className="pay-timeline">
            {events.map((ev, i) => (
              <li key={i} className={`pay-ev pay-ev-${ev.eventCode}`}>
                <span className="pay-ev-dot" aria-hidden="true" />
                <div className="pay-ev-body">
                  <div className="pay-ev-msg">{ev.message}</div>
                  {ev.createdAt && <div className="pay-ev-time">{formatTime(ev.createdAt)}</div>}
                </div>
              </li>
            ))}
            {phase === "awaiting" && (
              <li className="pay-ev pay-ev-live">
                <span className="pay-ev-dot" aria-hidden="true" />
                <div className="pay-ev-body">
                  <div className="pay-ev-msg">Waiting for you to enter your M-Pesa PIN…</div>
                </div>
              </li>
            )}
          </ul>
        )}

        {note && <div className="pay-note">{note}</div>}

        {result && (
          <div className={result.status === "SUCCESS" ? "pay-result pay-result-ok" : "pay-result pay-result-fail"}>
            {result.status === "SUCCESS"
              ? `Payment successful${result.amountPaid ? ` — KES ${result.amountPaid}` : ""}${
                  result.mpesaReceipt ? ` · Receipt: ${result.mpesaReceipt}` : ""
                }.`
              : "Payment not completed. No money was deducted — you can try again."}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="pay-history">
          <div className="pay-history-title">Recent Payments</div>
          {history.map((h) => (
            <div className="pay-history-row" key={h.id || h.checkoutRequestId}>
              <div className="pay-h-col">
                <div className="pay-h-main">{serviceLabel(h.serviceId)}</div>
                <div className="pay-h-sub">
                  {h.mpesaReceipt ? `Receipt ${h.mpesaReceipt} · ` : ""}
                  {formatDt(h.transactionDate || h.updatedAt || h.createdAt)}
                </div>
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