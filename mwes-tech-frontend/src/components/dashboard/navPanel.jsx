import React, { useCallback, useState } from "react";
import { Search, User } from "lucide-react";
import "./navPanel.css";

const NAV_SECTIONS = [
    {
        label: "Overview",
        items: [{ key: "overview", label: "Overview" }],
    },
    {
        label: "Workspace",
        items: [
            { key: "clients", label: "Clients" },
            { key: "services", label: "Services" },
            { key: "billing", label: "Billing" },
            { key: "chat", label: "Chat" },
        ],
    },
];

function Logo({ src, companyName }) {
    return (
        <>
            <div className="logo">
                <img className="logo-img" src={src} alt={`${companyName} logo`} />
            </div>
            <div className="company-name">
                <p className="c-name">{companyName}</p>
            </div>
        </>
    );
}

function ProfileBadge({ name }) {
    return (
        <div className="profile">
            <User size={24} aria-hidden="true" />
            <p className="profile-name">{name}</p>
        </div>
    );
}

function SearchBar({ onSearch }) {
    const [value, setValue] = useState("");

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            onSearch(value);
        },
        [onSearch, value]
    );

    return (
        <div className="search-bar-component">
            <form className="search-bar" onSubmit={handleSubmit} role="search">
                <input
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button type="submit" aria-label="Submit search">
                    <Search size={20} className="search-icon" />
                </button>
            </form>
        </div>
    );
}

function NavSection({ section, activeKey, onSelect }) {
    return (
        <div className="nav-section">
            <p className="section-label">{section.label.toUpperCase()}</p>
            {section.items.map((item) => {
                const isActive = activeKey === item.key;
                return (
                    <button
                        key={item.key}
                        type="button"
                        className={`views-group${isActive ? " active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => onSelect(item.key)}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}

function SideBar({
    activeKey: controlledKey,
    defaultActiveKey = "overview",
    onNavigate,
    onSearch,
    onLogout,
    companyName = "Techy",
    logoSrc = "./mwes_logo.png",
    userName = "Admin",
}) {
    const [internalKey, setInternalKey] = useState(defaultActiveKey);
    const isControlled = controlledKey !== undefined;
    const activeKey = isControlled ? controlledKey : internalKey;

    const handleSelect = useCallback(
        (key) => {
            if (!isControlled) setInternalKey(key);
            onNavigate?.(key);
        },
        [isControlled, onNavigate]
    );

    const handleSearch = useCallback(
        (query) => {
            onSearch?.(query);
        },
        [onSearch]
    );

    const handleLogout = useCallback(() => {
        onLogout?.();
    }, [onLogout]);

    return (
        <section className="nav">
            <div className="nav-components">
                <Logo src={logoSrc} companyName={companyName} />
                <hr />
                <ProfileBadge name={userName} />
                <hr />
                <SearchBar onSearch={handleSearch} />

                <nav className="dashboard-views" aria-label="Main">
                    {NAV_SECTIONS.map((section) => (
                        <NavSection
                            key={section.label}
                            section={section}
                            activeKey={activeKey}
                            onSelect={handleSelect}
                        />
                    ))}

                    <div className="nav-section session-section">
                        <button type="button" className="views-group logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default SideBar;