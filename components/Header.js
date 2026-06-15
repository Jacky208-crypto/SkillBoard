"use client";

import { useLang } from "@/lib/i18n";

export default function Header({
  currentUser,
  unreadCount,
  onBrand,
  onLogin,
  onSignup,
  onProfile,
  onMessages,
  onLogout,
}) {
  const { t, toggleLang } = useLang();

  return (
    <header className="site-header">
      <div className="brand" onClick={onBrand}>
        <span className="brand-mark">✦</span>
        <span className="brand-name">SkillBoard</span>
      </div>
      <nav className="header-actions">
        <button
          className="btn btn-ghost btn-small lang-toggle"
          onClick={toggleLang}
          aria-label={t("lang.toggleAria")}
          title={t("lang.toggleAria")}
        >
          🌐 {t("lang.toggle")}
        </button>
        {currentUser ? (
          <>
            <span className="header-greeting">
              {t("header.greeting", { name: currentUser.name || t("header.greetingFallback") })}
            </span>
            <button className="btn btn-ghost btn-small inbox-btn" onClick={onMessages}>
              {t("header.messages")}
              {unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}
            </button>
            <button className="btn btn-ghost btn-small" onClick={onProfile}>{t("header.myProfile")}</button>
            <button className="btn btn-ghost btn-small" onClick={onLogout}>{t("header.logout")}</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-small" onClick={onLogin}>{t("header.login")}</button>
            <button className="btn btn-primary btn-small" onClick={onSignup}>{t("header.signup")}</button>
          </>
        )}
      </nav>
    </header>
  );
}
