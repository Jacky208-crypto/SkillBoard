"use client";
 
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
 
// Traduce los mensajes de error de Supabase al español.
function traducirError(msg) {
  const traducciones = {
    "User already registered": "Este correo ya está registrado. Intenta iniciar sesión.",
    "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
    "Unable to validate email address: invalid format": "El formato del correo no es válido.",
    "Signup requires a valid password": "Ingresa una contraseña válida.",
    "Invalid login credentials": "Correo o contraseña incorrectos.",
    "Email not confirmed": "Debes confirmar tu correo antes de iniciar sesión.",
    "Too many requests": "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  };
  return traducciones[msg] || msg;
}
 
export default function AuthForm({ mode, setMode, onLoggedIn, onSignedUp }) {
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
          setError("Por favor ingresa tu nombre.");
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
          Iniciar sesión
        </button>
        <button
          className={`auth-tab ${mode === "signup" ? "active" : ""}`}
          onClick={() => { setMode("signup"); setError(""); }}
        >
          Registrarse
        </button>
      </div>
 
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div className="field">
            <label htmlFor="authName">Tu nombre</label>
            <input
              id="authName"
              type="text"
              placeholder="ej. Jackie Mensah"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="authEmail">Correo electrónico</label>
          <input
            id="authEmail"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="authPassword">Contraseña</label>
          <input
            id="authPassword"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="auth-error">{error}</p>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Por favor espera…" : mode === "signup" ? "Crear cuenta" : "Iniciar sesión"}
        </button>
      </form>
    </section>
  );
}
 