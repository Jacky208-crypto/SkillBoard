"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { initials } from "@/lib/helpers";

export default function Messages({ currentUser, profiles, initialPartnerId, onBack, onUnreadChange }) {
  const [partnerId, setPartnerId] = useState(initialPartnerId || null);
  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  // Look up a person's name/details from the profiles we already loaded.
  const profileOf = useCallback(
    (id) => profiles.find((p) => p.id === id) || { id, name: "Usuario" },
    [profiles]
  );

  // ---------- Build the inbox (list of people you've talked to) ----------
  const loadConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order("sent_at", { ascending: false });
    if (error || !data) return;

    // Group by the OTHER person, keeping the most recent message.
    const seen = new Map();
    for (const m of data) {
      const other = m.sender_id === currentUser.id ? m.receiver_id : m.sender_id;
      if (!seen.has(other)) {
        seen.set(other, {
          partnerId: other,
          last: m,
          unread: 0,
        });
      }
      const entry = seen.get(other);
      if (m.receiver_id === currentUser.id && !m.is_read) entry.unread += 1;
    }
    setConversations(Array.from(seen.values()));
  }, [currentUser.id]);

  // ---------- Load one conversation thread ----------
  const loadThread = useCallback(
    async (otherId) => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherId}),` +
            `and(sender_id.eq.${otherId},receiver_id.eq.${currentUser.id})`
        )
        .order("sent_at", { ascending: true });
      if (error || !data) return;
      setThread(data);

      // Mark the messages they sent me as read.
      const unreadIds = data
        .filter((m) => m.receiver_id === currentUser.id && !m.is_read)
        .map((m) => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("messages").update({ is_read: true }).in("id", unreadIds);
        if (onUnreadChange) onUnreadChange();
        loadConversations();
      }
    },
    [currentUser.id, onUnreadChange, loadConversations]
  );

  // First load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // When a partner is selected, load the thread
  useEffect(() => {
    if (partnerId) loadThread(partnerId);
  }, [partnerId, loadThread]);

  // ---------- Realtime: listen for new messages ----------
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new;
          // Only react to messages involving me.
          if (m.sender_id !== currentUser.id && m.receiver_id !== currentUser.id) return;

          const other = m.sender_id === currentUser.id ? m.receiver_id : m.sender_id;
          // If it belongs to the open thread, append it.
          if (other === partnerId) {
            setThread((prev) =>
              prev.some((x) => x.id === m.id) ? prev : [...prev, m]
            );
          }
          loadConversations();
          if (onUnreadChange) onUnreadChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, partnerId, loadConversations, onUnreadChange]);

  // Auto-scroll to the newest message
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  async function send() {
    const content = draft.trim();
    if (!content || !partnerId) return;
    setDraft("");
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: currentUser.id, receiver_id: partnerId, content })
      .select()
      .single();
    if (!error && data) {
      setThread((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data]));
      loadConversations();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ---------- RENDER ----------
  return (
    <section>
      <div className="profile-head">
        <h2 className="section-title">Mensajes</h2>
        <button className="btn btn-ghost" onClick={onBack}>← Volver al tablero</button>
      </div>

      <div className="messages-layout">
        {/* Inbox / conversation list */}
        <aside className="inbox">
          {conversations.length === 0 ? (
            <p className="card-location" style={{ padding: "12px" }}>
              Sin conversaciones aún.
            </p>
          ) : (
            conversations.map((c) => {
              const person = profileOf(c.partnerId);
              return (
                <button
                  key={c.partnerId}
                  className={`inbox-item ${c.partnerId === partnerId ? "active" : ""}`}
                  onClick={() => setPartnerId(c.partnerId)}
                >
                  <span className="avatar avatar-sm">{initials(person.name)}</span>
                  <span className="inbox-text">
                    <span className="inbox-name">{person.name}</span>
                    <span className="inbox-preview">{c.last.content}</span>
                  </span>
                  {c.unread > 0 && <span className="unread-dot">{c.unread}</span>}
                </button>
              );
            })
          )}
        </aside>

        {/* Conversation thread */}
        <div className="thread">
          {!partnerId ? (
            <p className="empty-state">Elige una conversación para empezar.</p>
          ) : (
            <>
              <div className="thread-head">
                <span className="avatar avatar-sm">{initials(profileOf(partnerId).name)}</span>
                <strong>{profileOf(partnerId).name}</strong>
              </div>

              <div className="thread-body">
                {thread.length === 0 ? (
                  <p className="card-location" style={{ textAlign: "center", marginTop: "20px" }}>
                    Aún no hay mensajes. ¡Escribe el primero!
                  </p>
                ) : (
                  thread.map((m) => (
                    <div
                      key={m.id}
                      className={`bubble ${m.sender_id === currentUser.id ? "mine" : "theirs"}`}
                    >
                      {m.content}
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <div className="thread-compose">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Escribe un mensaje…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="btn btn-primary" onClick={send}>Enviar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
