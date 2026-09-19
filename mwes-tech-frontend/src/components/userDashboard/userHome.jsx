import React from "react";
import { Link } from "react-router-dom";
import "./userHome.css";

const RECENT_SERVICES = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  value: `Value ${i + 1}`,
}));

function UserHome() {
  return (
    <div className="u-home">
      <div className="u-cards">
        <div className="u-card">
          <Link to="/signup" className="u-card-btn">
            Browse Requests / Services
          </Link>
        </div>

        <div className="u-card">
          <button type="button" className="u-card-btn">
            My Ratings
          </button>
        </div>
      </div>

      <h2 className="u-section-title">Recent Services</h2>

      <div className="u-recent-grid">
        {RECENT_SERVICES.map((item) => (
          <div className="u-recent-cell" key={item.id}>
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserHome;