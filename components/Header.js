"use client";

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
  return (
    <header className="site-header">
      <div className="brand" onClick={onBrand}>
        <span className="brand-mark">✦</span>
        <span className="brand-name">SkillBoard</span>
      </div>
      <nav className="header-actions">
        {currentUser ? (
          <>
            <span className="header-greeting">Hola, {currentUser.name || "allí"}</span>
            <button className="btn btn-ghost btn-small inbox-btn" onClick={onMessages}>
              Mensajes
              {unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}
            </button>
            <button className="btn btn-ghost btn-small" onClick={onProfile}>Mi perfil</button>
            <button className="btn btn-ghost btn-small" onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-small" onClick={onLogin}>Iniciar sesión</button>
            <button className="btn btn-primary btn-small" onClick={onSignup}>Registrarse</button>
          </>
        )}
      </nav>
    </header>
  );
}
