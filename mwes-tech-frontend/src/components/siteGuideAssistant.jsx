import { React, useState, useRef, useEffect } from "react";
import "./siteGuideAssistant.css";

export default function SiteGuideAssistant({
    apiEndpoint = "/api/assistant",
    siteName = "mwesTech",
    greeting = `Hi, I'm the mwesTech assistant. Tell me the service you need: 
                Web Design and Development, Data analytics, AI and Automations, Cybersecurity, 
                and IT Consultation services`,
    accent = "#3D4EA6",
}) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: greeting },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open, loading]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 250);
    }, [open]);

    async function sendMessage(e) {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        const nextMessages = [...messages, { role: "user", content: text }];
        setMessages(nextMessages);
        setInput("");
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages }),
            });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            const data = await res.json();
            setMessages((m) => [
                ...m,
                { role: "assistant", content: data.reply ?? "…" },
            ]);
        } catch (err) {
            setError(
                "I couldn't reach the assistant service. Please try again in a moment."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="sga-root" style={{ "--sga-accent": accent }}>
            <button
                type="button"
                className={`sga-launcher${open ? " sga-launcher-open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                title={siteName}
                aria-label="Open mwesTech assistant"
                aria-expanded={open}
            >
                {open ? (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            {open && (
                <div className="sga-panel" role="dialog" aria-label={`${siteName} assistant chat`}>
                    <header className="sga-head">
                        <span className="sga-avatar" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 1 1 2 2z" />
                            </svg>
                        </span>
                        <div className="sga-head-text">
                            <strong>{siteName} Assistant</strong>
                            <span className="sga-head-sub">Online — replies in seconds</span>
                        </div>
                    </header>

                    <div className="sga-thread" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`sga-msg ${m.role === "user" ? "sga-user" : "sga-bot"}`}
                            >
                                <span className="sga-bubble">{m.content}</span>
                            </div>
                        ))}
                        {loading && (
                            <div className="sga-msg sga-bot">
                                <span className="sga-bubble sga-typing" aria-label="Assistant is typing">…</span>
                            </div>
                        )}
                        {error && <p className="sga-error">{error}</p>}
                    </div>

                    <form className="sga-composer" onSubmit={sendMessage}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about our services…"
                            aria-label="Message the assistant"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="sga-send"
                            disabled={!input.trim() || loading}
                            aria-label="Send message"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m22 2-7 20-4-9-9-4z" />
                                <path d="M22 2 11 13" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}