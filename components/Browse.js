"use client";

import { useState } from "react";
import { initials } from "@/lib/helpers";

export default function Browse({ profiles, onOpenProfile }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const withSkills = profiles.filter((p) => (p.skills || []).length > 0);

  const list = q
    ? withSkills.filter((p) =>
        (p.skills || []).some((s) => s.skill_name.toLowerCase().includes(q))
      )
    : withSkills;

  const meta = q
    ? `${list.length} ${list.length === 1 ? "persona" : "personas"} buenas en "${query.trim()}"`
    : `${withSkills.length} ${withSkills.length === 1 ? "persona" : "personas"} en el tablero`;

  return (
    <section>
      <div className="browse-head">
        <h2 className="section-title">Tablero</h2>
        <div className="search-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Busca una habilidad — ej. plomería, jardinería, diseño…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="results-meta">{meta}</div>

      <div className="card-grid">
        {list.length === 0 ? (
          <p className="empty-state">
            {q
              ? "Nadie ha listado esa habilidad aún — ¡sé el primero!"
              : "El tablero está vacío. ¡Regístrate y agrega la primera habilidad!"}
          </p>
        ) : (
          list.map((p) => (
            <article key={p.id} className="profile-card" onClick={() => onOpenProfile(p.id)}>
              <div className="card-top">
                <div className="avatar">{initials(p.name)}</div>
                <div>
                  <div className="card-name">{p.name}</div>
                  {p.location && <div className="card-location">{p.location}</div>}
                </div>
              </div>
              <div className="skill-tags">
                {(p.skills || []).length === 0 ? (
                  <span className="card-location">Sin habilidades listadas aún</span>
                ) : (
                  p.skills.map((s) => {
                    const isMatch = q && s.skill_name.toLowerCase().includes(q);
                    return (
                      <span key={s.id} className={`skill-tag ${isMatch ? "match" : ""}`}>
                        {s.skill_name}
                      </span>
                    );
                  })
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
