import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config";
import { useAuth } from "../AuthContext";
import "./landingPage.css";

const NAV_LINKS = [
  { label: "About", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Contacts", href: "#contacts" },
];

const SERVICES = [
  {
    key: "web",
    position: "hero-left",
    title: "Web Design & Development",
    lines: [
      "Responsive business sites",
      "Custom web applications",
      "Hosting and maintenance",
    ],
  },
  {
    key: "data",
    position: "hero-right",
    title: "Data Analytics",
    lines: [
      "Dashboards and reporting",
      "Business intelligence",
      "Data pipeline setup",
    ],
  },
  {
    key: "ai",
    position: "hero-center",
    title: "AI & Automations",
    lines: [
      "Process automation",
      "LLM-powered assistants",
      "Workflow integrations",
    ],
  },
  {
    key: "cyber",
    position: "lower-left",
    title: "Cyber Security",
    lines: [
      "Security audits",
      "Threat monitoring",
      "Incident response",
    ],
  },
  {
    key: "it",
    position: "lower-right",
    title: "IT Consultation",
    lines: [
      "Technology strategy",
      "Infrastructure planning",
      "Team training",
    ],
  },
];

function ServiceBlock({ service }) {
  return (
    <div className="lp-service">
      <h3 className="lp-service-title">{service.title}</h3>
      {service.lines.map((line) => (
        <p key={line} className="lp-service-line">
          {line}
        </p>
      ))}
    </div>
  );
}

function LandingPage() {
  const { user } = useAuth();
  const sessionName = user?.firstName || user?.email?.split("@")[0] || "";

  return (
    <div className="lp-page" id="top">
      <header className="lp-header">
        <div className="lp-brand">
          <img className="lp-logo" src="/mwes_logo.png" alt="logo" />
          <span className="lp-brand-name">{BRAND}</span>
        </div>

        <nav className="lp-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="lp-nav-btn">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="lp-cta-group">
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              className="lp-session"
              title="Go to dashboard"
            >
              <span className="lp-session-avatar" aria-hidden="true">
                {(sessionName || "?").charAt(0).toUpperCase()}
              </span>
              <span className="lp-session-name">{sessionName}</span>
            </Link>
          ) : (
            <Link to="/signin" className="lp-signin">
              Sign In
            </Link>
          )}
          <Link to="/signup" className="lp-cta">
            Request Service
          </Link>
        </div>
      </header>

      <section className="lp-hero" id="services">
        <div className="lp-hero-copy">
          <h2 className="lp-hero-headline">
            Modern tech services for growing businesses
          </h2>
          <p className="lp-hero-sub">
            Design, data, AI and security — one trusted partner.
          </p>
        </div>

        <h1 className="lp-hero-title">Services</h1>

        <div className="lp-services-column">
          {SERVICES.map((service) => (
            <ServiceBlock key={service.key} service={service} />
          ))}
        </div>
      </section>

      <footer className="lp-footer" id="contacts">
        <h2 className="lp-footer-title">Contacts</h2>
        <div className="lp-footer-cols">
          <div className="lp-footer-col">
            <p>Zuhura Plaza, Thika</p>
            <p>4th Floor, Thika</p>
            <p>Kenya</p>
          </div>
          <div className="lp-footer-col">
            <p>+254 793 002 282</p>
            <p>admin@mwestech.co.ke</p>
            <p>Mon - Fri, 8am - 5pm</p>
          </div>
          <div className="lp-footer-col">
            <a>X / Twitter</a>
            <a>LinkedIn</a>
            <a>GitHub</a>
          </div>
        </div>
        <p className="lp-footer-strip">
          Get in touch for a consultation on your next project.
        </p>
        <p className="lp-copyright">© 2026 mwesTech. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;