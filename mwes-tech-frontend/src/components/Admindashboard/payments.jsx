import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import "./payments.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/payments`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setPayments(Array.isArray(data) ? data : []);
        } else {
          setError("Failed to load payments");
        }
      } catch (e) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

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
    <div className="adm-pay">
      <div className="adm-pay-head">
        <h2>Payments</h2>
        <span className="adm-pay-count">{payments.length} total</span>
      </div>
      {loading && <div className="adm-pay-msg">Loading payments...</div>}
      {error && <div className="adm-pay-err">{error}</div>}
      {!loading && !error && (
        <div className="adm-pay-table-wrap">
          <table className="adm-pay-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Phone</th>
                <th>Service ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id || p.checkoutRequestId}>
                  <td>{formatDt(p.transactionDate || p.createdAt)}</td>
                  <td>{p.userId || "-"}</td>
                  <td>{p.payerPhone || p.phone}</td>
                  <td>{p.serviceId}</td>
                  <td>KES {p.amountPaid || p.amount}</td>
                  <td className={`adm-pay-st adm-pay-st-${(p.status || "").toLowerCase()}`}>{p.status}</td>
                  <td>{p.mpesaReceipt || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}