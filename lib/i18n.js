"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// All user-facing copy lives here. Add a key to BOTH "es" and "en" and use it
// via the t() function returned by useLang(). Use {placeholders} for variables.
// ---------------------------------------------------------------------------
export const translations = {
  es: {
    // Document / metadata
    "meta.title": "SkillBoard — encuentra personas buenas en algo",
    "meta.description": "Un directorio de personas y en qué son mejores.",

    // Header
    "header.greeting": "Hola, {name}",
    "header.greetingFallback": "allí",
    "header.messages": "Mensajes",
    "header.myProfile": "Mi perfil",
    "header.logout": "Cerrar sesión",
    "header.login": "Iniciar sesión",
    "header.signup": "Registrarse",
    "lang.toggle": "EN",
    "lang.toggleAria": "Cambiar a inglés",

    // App-level
    "app.loading": "Cargando…",

    // Auth
    "auth.tab.login": "Iniciar sesión",
    "auth.tab.signup": "Registrarse",
    "auth.name": "Tu nombre",
    "auth.namePlaceholder": "ej. Jackie Mensah",
    "auth.email": "Correo electrónico",
    "auth.emailPlaceholder": "tu@correo.com",
    "auth.password": "Contraseña",
    "auth.passwordPlaceholder": "Mínimo 6 caracteres",
    "auth.wait": "Por favor espera…",
    "auth.createAccount": "Crear cuenta",
    "auth.login": "Iniciar sesión",
    "auth.enterName": "Por favor ingresa tu nombre.",
    // Supabase error messages
    "auth.err.userExists": "Este correo ya está registrado. Intenta iniciar sesión.",
    "auth.err.passwordShort": "La contraseña debe tener al menos 6 caracteres.",
    "auth.err.invalidEmail": "El formato del correo no es válido.",
    "auth.err.needPassword": "Ingresa una contraseña válida.",
    "auth.err.invalidLogin": "Correo o contraseña incorrectos.",
    "auth.err.notConfirmed": "Debes confirmar tu correo antes de iniciar sesión.",
    "auth.err.tooMany": "Demasiados intentos. Espera un momento e inténtalo de nuevo.",

    // Browse
    "browse.title": "El tablero",
    "browse.searchPlaceholder": "Busca una habilidad o nombre — ej. plomería, jardinería…",
    "browse.locationPlaceholder": "Filtrar por ubicación — ej. Ciudad de Panamá",
    "browse.sortRecent": "Más recientes",
    "browse.sortRating": "Mejor calificados",
    "browse.resultsOne": "{count} resultado",
    "browse.resultsMany": "{count} resultados",
    "browse.peopleOne": "{count} persona en el tablero",
    "browse.peopleMany": "{count} personas en el tablero",
    "browse.noMatch": "Nadie coincide con tu búsqueda — intenta con otras palabras.",
    "browse.empty": "El tablero está vacío. ¡Regístrate y agrega la primera habilidad!",

    // MyProfile
    "profile.title": "Mi perfil",
    "profile.back": "← Volver al tablero",
    "profile.aboutYou": "Sobre ti",
    "profile.changePhoto": "Cambiar foto",
    "profile.uploading": "Subiendo…",
    "profile.photoUpdated": "Foto actualizada ✓",
    "profile.name": "Nombre",
    "profile.location": "Ubicación",
    "profile.locationPlaceholder": "Ciudad, País",
    "profile.bio": "Biografía",
    "profile.optional": "(opcional)",
    "profile.bioPlaceholder": "Una oración sobre ti",
    "profile.save": "Guardar perfil",
    "profile.saved": "Guardado ✓",
    "profile.mySkills": "Mis habilidades",
    "profile.noSkills": "Sin habilidades aún — agrega la primera abajo.",
    "profile.experienceOf": "{exp} de experiencia",
    "profile.remove": "Eliminar",
    "profile.addSkill": "Agregar una habilidad",
    "profile.skill": "Habilidad",
    "profile.skillPlaceholder": "ej. Plomería",
    "profile.experience": "Experiencia",
    "profile.experiencePlaceholder": "ej. 5 años",
    "profile.yourLevel": "Tu nivel",
    "profile.yourLevelPlaceholder": "¿Qué te hace bueno en esto?",
    "profile.addSkillBtn": "Agregar habilidad",
    "profile.enterSkillName": "Ingresa el nombre de la habilidad.",
    "profile.added": "Agregado ✓",

    // ViewProfile
    "view.back": "← Volver al tablero",
    "view.ratingOne": "{count} calificación",
    "view.ratingMany": "{count} calificaciones",
    "view.sendMessage": "Enviar mensaje",
    "view.noSkills": "Sin habilidades listadas aún.",
    "view.experienceOf": "{exp} de experiencia",
    "view.reviews": "Reseñas",

    // Messages
    "messages.userFallback": "Usuario",
    "messages.title": "Mensajes",
    "messages.back": "← Volver al tablero",
    "messages.noConversations": "Sin conversaciones aún.",
    "messages.choosePrompt": "Elige una conversación para empezar.",
    "messages.noMessages": "Aún no hay mensajes. ¡Escribe el primero!",
    "messages.composePlaceholder": "Escribe un mensaje…",
    "messages.send": "Enviar",

    // RatingForm
    "rating.yours": "Tu calificación",
    "rating.ratePerson": "Calificar a esta persona",
    "rating.starsAria": "{n} estrellas",
    "rating.commentPlaceholder": "Comentario (opcional)",
    "rating.saving": "Guardando…",
    "rating.update": "Actualizar",
    "rating.submit": "Enviar calificación",
    "rating.pickStar": "Elige al menos una estrella.",
    "rating.thanks": "¡Gracias por tu calificación! ✓",
  },

  en: {
    // Document / metadata
    "meta.title": "SkillBoard — find people who are good at something",
    "meta.description": "A directory of people and what they're best at.",

    // Header
    "header.greeting": "Hi, {name}",
    "header.greetingFallback": "there",
    "header.messages": "Messages",
    "header.myProfile": "My profile",
    "header.logout": "Log out",
    "header.login": "Log in",
    "header.signup": "Sign up",
    "lang.toggle": "ES",
    "lang.toggleAria": "Switch to Spanish",

    // App-level
    "app.loading": "Loading…",

    // Auth
    "auth.tab.login": "Log in",
    "auth.tab.signup": "Sign up",
    "auth.name": "Your name",
    "auth.namePlaceholder": "e.g. Jackie Mensah",
    "auth.email": "Email",
    "auth.emailPlaceholder": "you@email.com",
    "auth.password": "Password",
    "auth.passwordPlaceholder": "At least 6 characters",
    "auth.wait": "Please wait…",
    "auth.createAccount": "Create account",
    "auth.login": "Log in",
    "auth.enterName": "Please enter your name.",
    // Supabase error messages
    "auth.err.userExists": "This email is already registered. Try logging in.",
    "auth.err.passwordShort": "The password must be at least 6 characters.",
    "auth.err.invalidEmail": "The email format is not valid.",
    "auth.err.needPassword": "Enter a valid password.",
    "auth.err.invalidLogin": "Incorrect email or password.",
    "auth.err.notConfirmed": "You must confirm your email before logging in.",
    "auth.err.tooMany": "Too many attempts. Wait a moment and try again.",

    // Browse
    "browse.title": "The board",
    "browse.searchPlaceholder": "Search a skill or name — e.g. plumbing, gardening…",
    "browse.locationPlaceholder": "Filter by location — e.g. Panama City",
    "browse.sortRecent": "Most recent",
    "browse.sortRating": "Top rated",
    "browse.resultsOne": "{count} result",
    "browse.resultsMany": "{count} results",
    "browse.peopleOne": "{count} person on the board",
    "browse.peopleMany": "{count} people on the board",
    "browse.noMatch": "Nobody matches your search — try other words.",
    "browse.empty": "The board is empty. Sign up and add the first skill!",

    // MyProfile
    "profile.title": "My profile",
    "profile.back": "← Back to the board",
    "profile.aboutYou": "About you",
    "profile.changePhoto": "Change photo",
    "profile.uploading": "Uploading…",
    "profile.photoUpdated": "Photo updated ✓",
    "profile.name": "Name",
    "profile.location": "Location",
    "profile.locationPlaceholder": "City, Country",
    "profile.bio": "Bio",
    "profile.optional": "(optional)",
    "profile.bioPlaceholder": "One sentence about you",
    "profile.save": "Save profile",
    "profile.saved": "Saved ✓",
    "profile.mySkills": "My skills",
    "profile.noSkills": "No skills yet — add the first one below.",
    "profile.experienceOf": "{exp} of experience",
    "profile.remove": "Remove",
    "profile.addSkill": "Add a skill",
    "profile.skill": "Skill",
    "profile.skillPlaceholder": "e.g. Plumbing",
    "profile.experience": "Experience",
    "profile.experiencePlaceholder": "e.g. 5 years",
    "profile.yourLevel": "Your level",
    "profile.yourLevelPlaceholder": "What makes you good at this?",
    "profile.addSkillBtn": "Add skill",
    "profile.enterSkillName": "Enter the skill name.",
    "profile.added": "Added ✓",

    // ViewProfile
    "view.back": "← Back to the board",
    "view.ratingOne": "{count} rating",
    "view.ratingMany": "{count} ratings",
    "view.sendMessage": "Send message",
    "view.noSkills": "No skills listed yet.",
    "view.experienceOf": "{exp} of experience",
    "view.reviews": "Reviews",

    // Messages
    "messages.userFallback": "User",
    "messages.title": "Messages",
    "messages.back": "← Back to the board",
    "messages.noConversations": "No conversations yet.",
    "messages.choosePrompt": "Choose a conversation to start.",
    "messages.noMessages": "No messages yet. Write the first one!",
    "messages.composePlaceholder": "Type a message…",
    "messages.send": "Send",

    // RatingForm
    "rating.yours": "Your rating",
    "rating.ratePerson": "Rate this person",
    "rating.starsAria": "{n} stars",
    "rating.commentPlaceholder": "Comment (optional)",
    "rating.saving": "Saving…",
    "rating.update": "Update",
    "rating.submit": "Submit rating",
    "rating.pickStar": "Choose at least one star.",
    "rating.thanks": "Thanks for your rating! ✓",
  },
};

// Maps raw Supabase (English) error messages to a translation key so they can
// be shown in the active language.
export const SUPABASE_ERROR_KEYS = {
  "User already registered": "auth.err.userExists",
  "Password should be at least 6 characters": "auth.err.passwordShort",
  "Unable to validate email address: invalid format": "auth.err.invalidEmail",
  "Signup requires a valid password": "auth.err.needPassword",
  "Invalid login credentials": "auth.err.invalidLogin",
  "Email not confirmed": "auth.err.notConfirmed",
  "Too many requests": "auth.err.tooMany",
};

export const LANGUAGES = ["es", "en"];
const STORAGE_KEY = "skillboard.lang";
const DEFAULT_LANG = "es";

const LanguageContext = createContext(null);

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
}

export function LanguageProvider({ children }) {
  // Always start at the default so server and first client render match
  // (avoids hydration mismatch); the stored choice is applied after mount.
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES.includes(saved)) setLangState(saved);
    } catch (_) {}
  }, []);

  // Keep <html lang> and the document title in sync with the language.
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.title = translations[lang]["meta.title"];
    } catch (_) {}
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

  const t = useCallback(
    (key, vars) => {
      const table = translations[lang] || translations[DEFAULT_LANG];
      const str = table[key] != null ? table[key] : key;
      return interpolate(str, vars);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback so components don't crash if used outside the provider.
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      toggleLang: () => {},
      t: (key, vars) => interpolate(translations[DEFAULT_LANG][key] ?? key, vars),
    };
  }
  return ctx;
}
