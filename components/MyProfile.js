"use client";
 
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Avatar from "@/components/Avatar";
 
export default function MyProfile({ currentUser, setCurrentUser, onBack }) {
  const [name, setName] = useState(currentUser.name || "");
  const [location, setLocation] = useState(currentUser.location || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [photoUrl, setPhotoUrl] = useState(currentUser.photo_url || "");
  const [photoNote, setPhotoNote] = useState("");
  const fileRef = useRef(null);
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
 
  async function uploadPhoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPhotoNote("Subiendo…");
 
    // Save under the user's own folder so the storage policy allows it.
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${currentUser.id}/avatar.${ext}`;
 
    const { error: upErr } = await supabase
      .storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (upErr) { setPhotoNote(upErr.message); return; }
 
    // Build a public URL (with a cache-buster so the new image shows right away).
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
 
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ photo_url: publicUrl })
      .eq("id", currentUser.id);
    if (dbErr) { setPhotoNote(dbErr.message); return; }
 
    setPhotoUrl(publicUrl);
    setCurrentUser({ ...currentUser, photo_url: publicUrl });
    setPhotoNote("Foto actualizada ✓");
    setTimeout(() => setPhotoNote(""), 2000);
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
        <div className="photo-row">
          <Avatar name={name} photoUrl={photoUrl} className="avatar-lg" />
          <div>
            <button className="btn btn-ghost btn-small" onClick={() => fileRef.current && fileRef.current.click()}>
              Cambiar foto
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={uploadPhoto}
            />
            <span className="save-note">{photoNote}</span>
          </div>
        </div>
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