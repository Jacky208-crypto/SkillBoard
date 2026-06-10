"use client";
 
import { useState } from "react";
import Avatar from "@/components/Avatar";
 
export default function Browse({ profiles, onOpenProfile }) {
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "rating"
 
  const q = query.trim().toLowerCase();
  const loc = place.trim().toLowerCase();
 
  // Only people with at least one skill appear on the board.
  let list = profiles.filter((p) => (p.skills || []).length > 0);
 
  // Search matches a skill name OR the person's name.
  if (q) {
    list = list.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.skills || []).some((s) => s.skill_name.toLowerCase().includes(q))
    );
  }
 
  // Location filter.
  if (loc) {
    list = list.filter((p) => (p.location || "").toLowerCase().includes(loc));
  }
 
  // Sort: most recent (default order) or best rated.
  if (sortBy === "rating") {
    list = [...list].sort((a, b) => b.avgRating - a.avgRating);
  }
 
  const meta =
    q || loc
      ? `${list.length} ${list.length === 1 ? "resultado" : "resultados"}`
      : `${list.length} ${list.length === 1 ? "persona" : "personas"} en el tablero`;
 
  function stars(avg) {
    const rounded = Math.round(avg);
    return "★★★★★".slice(0, rounded) + "☆☆☆☆☆".slice(0, 5 - rounded);
  }
 
  return (
    <section>
      <div className="browse-head">
        <h2 className="section-title">El tablero</h2>
        <div className="search-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Busca una habilidad o nombre — ej. plomería, jardinería…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="filter-row">
            <input
              type="text"
              className="search-input"
              placeholder="Filtrar por ubicación — ej. Ciudad de Panamá"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <select
              className="search-input sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Más recientes</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>
        </div>
      </div>
 
      <div className="results-meta">{meta}</div>
 
      <div className="card-grid">
        {list.length === 0 ? (
          <p className="empty-state">
            {q || loc
              ? "Nadie coincide con tu búsqueda — intenta con otras palabras."
              : "El tablero está vacío. ¡Regístrate y agrega la primera habilidad!"}
          </p>
        ) : (
          list.map((p) => (
            <article key={p.id} className="profile-card" onClick={() => onOpenProfile(p.id)}>
              <div className="card-top">
                <Avatar name={p.name} photoUrl={p.photo_url} />
                <div>
                  <div className="card-name">{p.name}</div>
                  {p.location && <div className="card-location">{p.location}</div>}
                  {p.ratingCount > 0 && (
                    <div className="card-rating">
                      <span className="stars-display">{stars(p.avgRating)}</span>
                      <span className="card-rating-num">{p.avgRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="skill-tags">
                {p.skills.map((s) => {
                  const isMatch = q && s.skill_name.toLowerCase().includes(q);
                  return (
                    <span key={s.id} className={`skill-tag ${isMatch ? "match" : ""}`}>
                      {s.skill_name}
                    </span>
                  );
                })}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
 