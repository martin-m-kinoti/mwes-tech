import React from "react";
import { Trash2 } from "lucide-react";
import "./dataTable.css";

function DataTable({ columns, rows, onDelete, emptyMessage = "No data available yet." }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="dt-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="dt-wrap">
      <table className="dt-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`dt-th${col.accent ? ` accent-${col.accent}` : ""}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.id ?? rowIdx}>
              {columns.map((col) => {
                if (col.type === "delete") {
                  return (
                    <td key={col.key} className="dt-cell dt-cell-action">
                      <button
                        type="button"
                        className="dt-delete"
                        aria-label={`Delete ${row[col.labelKey] || "row"}`}
                        onClick={() => onDelete?.(row)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  );
                }
                if (col.type === "progress") {
                  const value = Number(row[col.key]) || 0;
                  return (
                    <td key={col.key} className="dt-cell">
                      <div className="dt-progress" aria-label={`${value}% complete`}>
                        <div className="dt-progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
                      </div>
                      <span className="dt-progress-label">{value}%</span>
                    </td>
                  );
                }
                if (col.type === "select") {
                  return (
                    <td key={col.key} className="dt-cell">
                      <select
                        className="dt-select"
                        value={row[col.key] ?? ""}
                        onChange={(e) => col.onChange?.(row, e.target.value)}
                        aria-label={col.label}
                      >
                        {(col.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                }
                const display = row[col.key];
                return (
                  <td key={col.key} className="dt-cell">
                    {col.format ? col.format(display) : display ?? "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;