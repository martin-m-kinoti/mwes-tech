import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import "./chat.css";

const ME = { id: "admin", name: "You" };
const API = "http://localhost:5000/api/chat";

const FALLBACK_CONVERSATIONS = [
  {
    _id: "client:user1",
    lastMessage: "Great, will do. Thanks!",
    lastMessageAt: "2026-09-17T09:00:00.000Z",
    unread: 1,
    totalMessages: 3,
  },
  {
    _id: "client:user2",
    lastMessage: "Hi User2, the starter plan covers a baseline security review.",
    lastMessageAt: "2026-09-15T14:02:00.000Z",
    unread: 0,
    totalMessages: 2,
  },
  {
    _id: "client:user3",
    lastMessage: "When is my website redesign deadline again?",
    lastMessageAt: "2026-09-14T09:45:00.000Z",
    unread: 2,
    totalMessages: 1,
  },
  {
    _id: "client:user4",
    lastMessage: "Can we switch the progress reports to weekly?",
    lastMessageAt: "2026-09-13T16:30:00.000Z",
    unread: 0,
    totalMessages: 1,
  },
  {
    _id: "client:user5",
    lastMessage: "Payment went through — please confirm receipt.",
    lastMessageAt: "2026-09-12T11:10:00.000Z",
    unread: 0,
    totalMessages: 1,
  },
  {
    _id: "client:user6",
    lastMessage: "Just checking in on the billing dashboard access.",
    lastMessageAt: "2026-09-11T10:00:00.000Z",
    unread: 0,
    totalMessages: 1,
  },
  {
    _id: "client:user7",
    lastMessage: "Do you offer ongoing maintenance after launch?",
    lastMessageAt: "2026-09-10T08:20:00.000Z",
    unread: 0,
    totalMessages: 1,
  },
];

function contactName(conversationId) {
  const [, name] = String(conversationId).split(":");
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : conversationId;
}

function initials(name) {
  return name.slice(0, 2).toUpperCase();
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatListTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API}/conversations`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load conversations.");
      const convs = data.conversations || [];
      setConversations(convs);
      if (convs.length > 0) setActiveId((prev) => prev || convs[0]._id);
    } catch {
      setConversations(FALLBACK_CONVERSATIONS);
      setActiveId((prev) => prev || FALLBACK_CONVERSATIONS[0]._id);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    try {
      const res = await fetch(`${API}/messages/${encodeURIComponent(conversationId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error();
      setMessages(data.messages || []);
      fetch(`${API}/conversations/${encodeURIComponent(conversationId)}/read`, {
        method: "PATCH",
      }).catch(() => {});
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
  }, [activeId, loadMessages]);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const activeName = useMemo(
    () => (activeId ? contactName(activeId) : ""),
    [activeId]
  );

  const handleSelect = (conversationId) => {
    if (conversationId === activeId) return;
    setActiveId(conversationId);
    setMessages([]);
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId ? { ...c, unread: 0 } : c
      )
    );
  };

  const handleSend = useCallback(
    async (e) => {
      e?.preventDefault();
      const body = draft.trim();
      if (!body || !activeId || sending) return;

      const optimistic = {
        conversationId: activeId,
        senderId: ME.id,
        senderName: "You",
        body,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setDraft("");
      setSending(true);
      setError("");

      try {
        const res = await fetch(`${API}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...optimistic, senderName: ME.name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Send failed.");
        setMessages((prev) =>
          prev.map((m) => (m === optimistic ? data.message : m))
        );
        loadConversations();
      } catch {
        setMessages((prev) => prev.filter((m) => m !== optimistic));
        setError("Message could not be sent. Check your connection and try again.");
      } finally {
        setSending(false);
      }
    },
    [draft, activeId, sending, loadConversations]
  );

  return (
    <div className="chat">
      <aside className="chat-list">
        <header className="chat-list-head">
          <h2 className="chat-list-title">Chats</h2>
          {conversations.length > 0 && (
            <span className="chat-list-count">{conversations.length}</span>
          )}
        </header>

        <div className="chat-contacts">
          {loading && <p className="chat-hint">Loading conversations…</p>}
          {!loading && conversations.length === 0 && (
            <p className="chat-hint">No conversations yet.</p>
          )}
          {conversations.map((conv) => {
            const name = contactName(conv._id);
            const isActive = conv._id === activeId;
            return (
              <button
                key={conv._id}
                type="button"
                className={`contact${isActive ? " active" : ""}`}
                onClick={() => handleSelect(conv._id)}
              >
                <span className="contact-avatar" aria-hidden="true">
                  {initials(name)}
                </span>
                <span className="contact-main">
                  <span className="contact-row">
                    <span className="contact-name">{name}</span>
                    {conv.unread > 0 && (
                      <span className="contact-unread">{conv.unread}</span>
                    )}
                  </span>
                  <span className="contact-preview">{conv.lastMessage || "New conversation"}</span>
                </span>
                <span className="contact-time">{formatListTime(conv.lastMessageAt)}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="chat-window">
        <header className="chat-window-head">
          <h3 className="chat-window-name">{activeName || "Select a chat"}</h3>
        </header>

        <div className="chat-thread" ref={threadRef}>
          {messages.length === 0 && (
            <p className="chat-hint chat-thread-hint">
              {activeName ? "No messages yet. Say hello!" : "Choose a conversation on the left."}
            </p>
          )}
          {messages.map((msg, i) => {
            const outgoing = msg.senderId === ME.id || msg.senderName === "You";
            return (
              <div
                key={msg._id ?? `${msg.createdAt}-${i}`}
                className={`message${outgoing ? " outgoing" : ""}`}
              >
                <span className="message-sender">{outgoing ? "You" : msg.senderName}</span>
                <span className="message-bubble">{msg.body}</span>
                <span className="message-time">{formatTime(msg.createdAt || msg.updatedAt)}</span>
              </div>
            );
          })}
        </div>

        {error && <div className="chat-error">{error}</div>}

        <form className="chat-composer" onSubmit={handleSend}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={activeName ? `Message ${activeName}...` : "Select a chat to start messaging"}
            disabled={!activeName}
            aria-label="Message"
          />
          <button
            type="submit"
            className="chat-send"
            disabled={!draft.trim() || !activeName || sending}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}

export default Chat;