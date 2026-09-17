import React from "react";
import "./card.css";

function Card({ title, subtitle, accent, className = "", children }) {
  return (
    <section className={`card ${className}`}>
      {(title || subtitle) && (
        <header className="card-header">
          {title && (
            <h3 className={`card-title${accent ? ` accent-${accent}` : ""}`}>
              {title}
            </h3>
          )}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export default Card;