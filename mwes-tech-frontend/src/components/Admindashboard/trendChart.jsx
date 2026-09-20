import React from "react";
import "./trendChart.css";

const DATA = [34, 41, 38, 52, 48, 63, 58, 72, 68, 78, 84, 79];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthSpan() {
  const arr = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(MONTH_NAMES[d.getMonth()]);
  }
  return arr;
}

const WIDTH = 720;
const HEIGHT = 240;
const PAD = { top: 18, right: 18, bottom: 30, left: 40 };

function TrendChart({ data = DATA, months = monthSpan() }) {
  const max = Math.max(...data) * 1.1 || 1;
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const pts = data.map((value, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + innerH - (value / max) * innerH,
    value,
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${PAD.top + innerH} L${pts[0].x},${PAD.top + innerH} Z`;

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: PAD.top + innerH - f * innerH,
    label: Math.round(max * f),
  }));

  const xLabels = months.filter((_, i) => i % 2 === 0);

  return (
    <div className="trend-chart" role="img" aria-label="Services trend area chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a8fc0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#5a8fc0" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridValues.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={g.y}
              y2={g.y}
              stroke="#e3ebf5"
              strokeWidth="1"
            />
            <text x={PAD.left - 8} y={g.y + 4} textAnchor="end" className="trend-axis-label">
              {g.label}
            </text>
          </g>
        ))}

        {xLabels.map((month, i) => {
          const idx = (i * 2);
          const x = PAD.left + (idx / (data.length - 1)) * innerW;
          return (
            <text key={month} x={x} y={HEIGHT - 8} textAnchor="middle" className="trend-axis-label">
              {month}
            </text>
          );
        })}

        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" stroke="#3a6ea5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#3a6ea5" strokeWidth="2">
            <title>{`${p.value}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

export default TrendChart;