"use client";
 
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLang, SUPABASE_ERROR_KEYS } from "@/lib/i18n";

export default function AuthForm({ mode, setMode, onLoggedIn, onSignedUp }) {
  const { t } = useLang();
  // Translate Supabase (English) error messages into the active language.
  const traducirError = (msg) => {
    const key = SUPABASE_ERROR_KEYS[msg];
    return key ? t(key) : msg;
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
 
    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError(t("auth.enterName"));
          return;
        }
        const { data, error: signErr } = await supabase.auth.signUp({ email, password });
        if (signErr) { setError(traducirError(signErr.message)); return; }
 
        const { error: pErr } = await supabase
          .from("profiles")
          .insert({ id: data.user.id, name: name.trim() });
        if (pErr) { setError(traducirError(pErr.message)); return; }
 
        await onSignedUp();
      } else {
        const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) { setError(traducirError(loginErr.message)); return; }
        await onLoggedIn();
      }
    } finally {
      setBusy(false);
    }
  }
 
  return (
    <section className="auth-card">
      <div className="auth-tabs">
        <button
          className={`auth-tab ${mode === "login" ? "active" : ""}`}
          onClick={() => { setMode("login"); setError(""); }}
        >
          {t("auth.tab.login")}
        </button>
        <button
          className={`auth-tab ${mode === "signup" ? "active" : ""}`}
          onClick={() => { setMode("signup"); setError(""); }}
        >
          {t("auth.tab.signup")}
        </button>
      </div>
 
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div className="field">
            <label htmlFor="authName">{t("auth.name")}</label>
            <input
              id="authName"
              type="text"
              placeholder={t("auth.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="authEmail">{t("auth.email")}</label>
          <input
            id="authEmail"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="authPassword">{t("auth.password")}</label>
          <input
            id="authPassword"
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="auth-error">{error}</p>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? t("auth.wait") : mode === "signup" ? t("auth.createAccount") : t("auth.login")}
        </button>
      </form>
    </section>
  );
}
 