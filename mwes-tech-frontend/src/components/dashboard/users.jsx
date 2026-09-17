import React, { useCallback, useEffect, useState } from "react";
import DataTable from "./dataTable";
import { formatDate } from "../../utils";
import "./views.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users.");
      setUsers(data.users || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRetry = () => {
    setLoading(true);
    loadUsers();
  };

  const handleDelete = useCallback(
    async (row) => {
      setNotice("");
      const confirmed = window.confirm(
        `Delete user "${row.email}"? This cannot be undone.`
      );
      if (!confirmed) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/users/${row.id}`,
          { method: "DELETE" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Delete failed.");
        setUsers((prev) => prev.filter((u) => u.id !== row.id));
        setNotice("User deleted successfully.");
      } catch (err) {
        setError(err.message || "Could not delete user.");
      }
    },
    []
  );

  const rows = users.map((u) => ({
    id: u.id,
    email: `${u.email}`,
    regTimestamp: u.createdAt,
    lastSeen: u.updatedAt,
    rowId: `Delete ${u.email}`,
  }));

  return (
    <div className="view">
      <div className="view-head">
        <h2 className="view-title">Users</h2>
        <p className="view-subtitle">Manage registered clients and accounts.</p>
      </div>

      {notice && <div className="notice-banner">{notice}</div>}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button type="button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="view-loading">Loading users…</div>
      ) : (
        <DataTable
          columns={[
            { key: "email", label: "Username/email", accent: "teal" },
            { key: "regTimestamp", label: "Reg Timestamp", accent: "orange", format: formatDate },
            { key: "lastSeen", label: "Last Seen Timestamp", accent: "teal", format: formatDate },
            { key: "delete", label: "Delete", type: "delete", accent: "red", labelKey: "rowId" },
          ]}
          rows={rows}
          onDelete={handleDelete}
          emptyMessage="No users registered yet."
        />
      )}
    </div>
  );
}

export default Users;