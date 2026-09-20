import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { api } from "../../api";
import { useAuth } from "../../AuthContext";
import "./chat.css";

function contactName(conversationId) {
  const id = String(conversationId);
  if (id === "admin") return "";
  if (id === "client") return "Client";
  const [, name] = id.split(":");
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  if (id.includes("@")) return id.split("@")[0].charAt(0).toUpperCase() + id.split("@")[0].slice(1);
  return id;
}

function conversationDisplayName(conv, meId) {
  const peers = (conv?.participants || []).filter((p) => p.id !== meId);
  if (peers.length > 0) {
    const peer = peers[0];
    return peer.name || contactName(peer.id) || contactName(conv?._id);
  }
  if (conv?.lastSenderName) return conv.lastSenderName;
  return contactName(conv?._id);
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
  const { user } = useAuth();
  const me = {
    id: user?.email || "",
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin",
  };

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
      const data = await api.get("/api/chat/conversations");
      const convs = data.conversations || [];
      setConversations(convs);
      if (convs.length > 0) setActiveId((prev) => prev || convs[0]._id);
    } catch {
      setConversations([]);
      setError("Could not load conversations. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    try {
      const data = await api.get(`/api/chat/messages/${encodeURIComponent(conversationId)}`);
      setMessages(data.messages || []);
      api.patch(`/api/chat/conversations/${encodeURIComponent(conversationId)}/read`).catch(() => {});
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

  const activeName = useMemo(() => {
    const conv = conversations.find((c) => c._id === activeId);
    return conv ? conversationDisplayName(conv, me.id) : "";
  }, [activeId, conversations, me.id]);

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
        senderId: me.id,
        senderName: "You",
        body,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setDraft("");
      setSending(true);
      setError("");

      try {
        const data = await api.post("/api/chat/messages", {
          conversationId: activeId,
          body,
        });
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
    [draft, activeId, sending, loadConversations, me.id]
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
          {!loading && error && conversations.length === 0 && (
            <p className="chat-hint chat-hint-error">{error}</p>
          )}
          {!loading && !error && conversations.length === 0 && (
            <p className="chat-hint">No conversations yet.</p>
          )}
          {conversations.map((conv) => {
            const name = conversationDisplayName(conv, me.id);
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
            const outgoing = msg.senderId === me.id || msg.senderName === "You";
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