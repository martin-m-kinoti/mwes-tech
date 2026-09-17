import React from "react";
import Card from "./card";
import "./views.css";

function Placeholder({ title, description }) {
  return (
    <div className="view">
      <div className="view-head">
        <h2 className="view-title">{title}</h2>
        {description && <p className="view-subtitle">{description}</p>}
      </div>
      <Card>
        <div className="chat-hint" style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          The {title.toLowerCase()} section is under construction and will be available soon.
        </div>
      </Card>
    </div>
  );
}

export default Placeholder;