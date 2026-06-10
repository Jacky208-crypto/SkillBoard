"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MyProfile({ currentUser, setCurrentUser, onBack }) {
  const [name, setName] = useState(currentUser.name || "");
  const [location, setLocation] = useState(currentUser.location || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [profileNote, setProfileNote] = useState("");

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [skillExp, setSkillExp] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillNote, setSkillNote] = useState("");

  useEffect(() => {
    loadSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSkills() {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: true });
    if (!error) setSkills(data || []);
  }

  async function saveProfile() {
    const updates = { name: name.trim(), location: location.trim(), bio: bio.trim() };
    const { error } = await supabase.from("profiles").update(updates).eq("id", currentUser.id);
    if (error) { setProfileNote(error.message); return; }
    setCurrentUser({ ...currentUser, ...updates });
    setProfileNote("Guardado ✓");
    setTimeout(() => setProfileNote(""), 2000);
  }

  async function addSkill() {
    if (!skillName.trim()) { setSkillNote("Ingresa el nombre de la habilidad."); return; }
    const { error } = await supabase.from("skills").insert({
      user_id: currentUser.id,
      skill_name: skillName.trim(),
      experience: skillExp.trim(),
      description: skillDesc.trim(),
    });
    if (error) { setSkillNote(error.message); return; }
    setSkillName(""); setSkillExp(""); setSkillDesc("");
    setSkillNote("Agregado ✓");
    setTimeout(() => setSkillNote(""), 2000);
    loadSkills();
  }

  async function removeSkill(id) {
    await supabase.from("skills").delete().eq("id", id);
    loadSkills();
  }

  return (
    <section>
      <div className="profile-head">
        <h2 className="section-title">Mi perfil</h2>
        <button className="btn btn-ghost" onClick={onBack}>← Volver al tablero</button>
      </div>

      <div className="profile-edit-card">
        <h3>Sobre ti</h3>
        <div className="field-row">
          <div className="field">
            <label>Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>Ubicación</label>
            <input value={location} placeholder="Ciudad, País" onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Biografía <span className="optional">(opcional)</span></label>
          <textarea rows={2} value={bio} placeholder="Una oración sobre ti" onChange={(e) => setBio(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={saveProfile}>Guardar perfil</button>
        <span className="save-note">{profileNote}</span>
      </div>

      <div className="profile-edit-card">
        <h3>Mis habilidades</h3>
        <div className="my-skills-list">
          {skills.length === 0 ? (
            <p className="card-location">Sin habilidades aún — agrega la primera abajo.</p>
          ) : (
            skills.map((s) => (
              <div key={s.id} className="my-skill-row">
                <div className="my-skill-info">
                  <strong>{s.skill_name}</strong>
                  {s.experience && <div className="meta">{s.experience} de experiencia</div>}
                  {s.description && <div className="desc">{s.description}</div>}
                </div>
                <button className="btn btn-danger btn-small" onClick={() => removeSkill(s.id)}>Eliminar</button>
              </div>
            ))
          )}
        </div>

        <div className="add-skill-box">
          <h4>Agregar una habilidad</h4>
          <div className="field-row">
            <div className="field">
              <label>Habilidad</label>
              <input value={skillName} placeholder="ej. Plomería" onChange={(e) => setSkillName(e.target.value)} />
            </div>
            <div className="field">
              <label>Experiencia</label>
              <input value={skillExp} placeholder="ej. 5 años" onChange={(e) => setSkillExp(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Tu nivel <span className="optional">(opcional)</span></label>
            <textarea rows={2} value={skillDesc} placeholder="¿Qué te hace bueno en esto?" onChange={(e) => setSkillDesc(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={addSkill}>Agregar habilidad</button>
          <span className="save-note">{skillNote}</span>
        </div>
      </div>
    </section>
  );
}
