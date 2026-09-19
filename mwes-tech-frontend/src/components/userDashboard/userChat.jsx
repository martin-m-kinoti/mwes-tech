import React, { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import "./userChat.css";

const CONVERSATION_ID = "admin";
const ME = { id: "client", name: "You" };
const API = "http://localhost:5000/api/chat";

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function UserChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/messages/${encodeURIComponent(CONVERSATION_ID)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not load messages.");
      setMessages(data.messages || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load messages. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

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
      if (!body || sending) return;

      const optimistic = {
        conversationId: CONVERSATION_ID,
        senderId: ME.id,
        senderName: "You",
        body,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setDraft("");
      setSending(true);

      try {
        const res = await fetch(`${API}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: CONVERSATION_ID,
            senderId: ME.id,
            senderName: ME.name,
            body,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Send failed.");
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
    [draft, sending]
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
          const outgoing = msg.senderId === ME.id;
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