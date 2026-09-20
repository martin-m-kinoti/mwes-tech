import React, { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { api } from "../../api";
import { useAuth } from "../../AuthContext";
import "./userChat.css";

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function UserChat() {
  const { user } = useAuth();
  const conversationId = user?.email || "";
  const me = {
    id: user?.email || "",
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "You",
  };

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await api.get(
        `/api/chat/messages/${encodeURIComponent(conversationId)}`
      );
      setMessages(data.messages || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load messages. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      const body = draft.trim();
      if (!body || !conversationId || sending) return;

      const optimistic = {
        conversationId,
        senderId: me.id,
        senderName: "You",
        body,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setDraft("");
      setSending(true);

      try {
        const data = await api.post("/api/chat/messages", {
          conversationId,
          body,
        });
        setMessages((prev) =>
          prev.map((m) => (m === optimistic ? data.message : m))
        );
        setError("");
      } catch {
        setMessages((prev) => prev.filter((m) => m !== optimistic));
        setError("Message could not be sent. Try again.");
      } finally {
        setSending(false);
      }
    },
    [draft, sending, conversationId, me.id]
  );

  return (
    <div className="u-chat">
      <header className="u-chat-head">
        <h3 className="u-chat-contact">Admin</h3>
      </header>

      {error && loading && (
        <div className="u-chat-error">
          <span>{error}</span>
          <button type="button" onClick={loadMessages}>
            Retry
          </button>
        </div>
      )}

      <div className="u-chat-thread" ref={threadRef}>
        {!loading && error && messages.length === 0 && (
          <div className="u-chat-error">
            <span>{error}</span>
            <button type="button" onClick={loadMessages}>
              Retry
            </button>
          </div>
        )}

        {loading && messages.length === 0 && (
          <p className="u-chat-hint">Loading messages…</p>
        )}

        {!loading && !error && messages.length === 0 && (
          <p className="u-chat-hint">No messages yet. Say hello!</p>
        )}

        {messages.map((msg, i) => {
          const outgoing = msg.senderId === me.id;
          return (
            <div
              key={msg._id ?? `${msg.createdAt}-${i}`}
              className={`u-msg${outgoing ? " outgoing" : " incoming"}`}
            >
              <span className="u-msg-sender">
                {outgoing ? "You" : msg.senderName || "Admin"}
              </span>
              <span className="u-msg-bubble">{msg.body}</span>
              <span className="u-msg-time">
                {formatTime(msg.createdAt || msg.updatedAt)}
              </span>
            </div>
          );
        })}
      </div>

      {error && !loading && messages.length > 0 && (
        <div className="u-chat-error">{error}</div>
      )}

      <form className="u-chat-composer" onSubmit={handleSend}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your message..."
          aria-label="Message"
        />
        <button
          type="submit"
          className="u-chat-send"
          disabled={!draft.trim() || sending}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default UserChat;