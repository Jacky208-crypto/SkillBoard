"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import Browse from "@/components/Browse";
import MyProfile from "@/components/MyProfile";
import ViewProfile from "@/components/ViewProfile";
import Messages from "@/components/Messages";

export default function Home() {
  // Which screen: "browse" | "auth" | "profile" | "viewProfile" | "messages"
  const [view, setView] = useState("browse");
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [viewingId, setViewingId] = useState(null);
  const [messagePartnerId, setMessagePartnerId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Load the directory (all profiles + their skills) ---
  const loadDirectory = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, location, bio, photo_url, skills(id, skill_name, experience, description)")
      .order("created_at", { ascending: false });
    if (!error) setProfiles(data || []);
  }, []);

  // --- Count unread messages for the badge ---
  const loadUnread = useCallback(async (userId) => {
    const id = userId || (currentUser && currentUser.id);
    if (!id) { setUnreadCount(0); return; }
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", id)
      .eq("is_read", false);
    setUnreadCount(count || 0);
  }, [currentUser]);

  // --- Figure out who (if anyone) is logged in ---
  const loadSession = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      const u = { id: data.user.id, email: data.user.email, ...(profile || {}) };
      setCurrentUser(u);
      loadUnread(u.id);
    } else {
      setCurrentUser(null);
      setUnreadCount(0);
    }
  }, [loadUnread]);

  // --- On first load ---
  useEffect(() => {
    (async () => {
      await loadSession();
      await loadDirectory();
      setLoading(false);
    })();
  }, [loadSession, loadDirectory]);

  // --- Navigation handlers ---
  function goBrowse() {
    loadDirectory();
    setView("browse");
  }

  function openAuth(mode) {
    setAuthMode(mode);
    setView("auth");
  }

  async function handleLoggedIn() {
    await loadSession();
    goBrowse();
  }

  async function handleSignedUp() {
    await loadSession();
    setView("profile");
  }

  async function logout() {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUnreadCount(0);
    goBrowse();
  }

  function openMyProfile() {
    if (!currentUser) { openAuth("login"); return; }
    setView("profile");
  }

  function openViewProfile(id) {
    setViewingId(id);
    setView("viewProfile");
  }

  function openMessages(partnerId = null) {
    if (!currentUser) { openAuth("login"); return; }
    setMessagePartnerId(partnerId);
    setView("messages");
  }

  const viewingProfile = profiles.find((p) => p.id === viewingId);

  return (
    <>
      <Header
        currentUser={currentUser}
        unreadCount={unreadCount}
        onBrand={goBrowse}
        onLogin={() => openAuth("login")}
        onSignup={() => openAuth("signup")}
        onProfile={openMyProfile}
        onMessages={() => openMessages(null)}
        onLogout={logout}
      />

      <main className="container">
        {loading ? (
          <p className="empty-state">Cargando…</p>
        ) : view === "auth" ? (
          <AuthForm
            mode={authMode}
            setMode={setAuthMode}
            onLoggedIn={handleLoggedIn}
            onSignedUp={handleSignedUp}
          />
        ) : view === "profile" && currentUser ? (
          <MyProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onBack={goBrowse}
          />
        ) : view === "messages" && currentUser ? (
          <Messages
            currentUser={currentUser}
            profiles={profiles}
            initialPartnerId={messagePartnerId}
            onBack={goBrowse}
            onUnreadChange={() => loadUnread()}
          />
        ) : view === "viewProfile" ? (
          <ViewProfile
            profile={viewingProfile}
            currentUser={currentUser}
            onBack={goBrowse}
            onMessage={(id) => openMessages(id)}
          />
        ) : (
          <Browse profiles={profiles} onOpenProfile={openViewProfile} />
        )}
      </main>

      <footer className="site-footer">
        <p>SkillBoard — MVP Fase 2 · hecho con Next.js + Supabase</p>
      </footer>
    </>
  );
}
