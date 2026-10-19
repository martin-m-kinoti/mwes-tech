import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./dataTable";
import { formatDate } from "../../utils";
import { api } from "../../api";
import "./payments.css";

const STATUS_LABELS = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
};

// M-Pesa stores transactionDate as yyyyMMddHHmmss; normalise before formatting.
function formatPaymentDate(value) {
  if (!value) return "—";
  const s = String(value);
  if (/^\d{14}$/.test(s)) {
    return formatDate(
      `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}`
    );
  }
  return formatDate(value);
}

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/payments");
      setPayments(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const rows = payments.map((p) => ({
    id: p.id || p.checkoutRequestId,
    service: p.serviceName || p.serviceId,
    client: p.userEmail || p.userId || "—",
    phone: p.payerPhone || p.phone || "—",
    amount: p.amountPaid ?? p.amount,
    status: p.status,
    receipt: p.mpesaReceipt || "—",
    requestedAt: p.transactionDate || p.createdAt,
  }));

  return (
    <div className="view">
      <div className="view-head">
        <h2 className="view-title">Payments</h2>
        <p className="view-subtitle">
          M-Pesa transactions made through the system.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button type="button" onClick={loadPayments}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="view-loading">Loading payments…</div>
      ) : (
        <DataTable
          columns={[
            { key: "service", label: "Service", accent: "teal" },
            { key: "client", label: "Client", accent: "orange" },
            { key: "phone", label: "Phone", accent: "teal" },
            {
              key: "amount",
              label: "Amount",
              accent: "orange",
              format: (n) => `KES ${Number(n ?? 0).toLocaleString()}`,
            },
            {
              key: "status",
              label: "Status",
              accent: "teal",
              format: (s) => (
                <span className={`adm-pay-st adm-pay-st-${String(s || "").toLowerCase()}`}>
                  {STATUS_LABELS[s] || s || "—"}
                </span>
              ),
            },
            { key: "receipt", label: "Receipt", accent: "orange" },
            {
              key: "requestedAt",
              label: "Paid At",
              accent: "teal",
              format: formatPaymentDate,
            },
          ]}
          rows={rows}
          emptyMessage="No payments yet."
        />
      )}
    </div>
  );
}

export default Payments;
