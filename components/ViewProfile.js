"use client";
 
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Avatar from "@/components/Avatar";
import RatingForm from "@/components/RatingForm";
 
export default function ViewProfile({ profile, currentUser, onBack, onMessage }) {
  const [ratings, setRatings] = useState([]);
 
  const loadRatings = useCallback(async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("reviewee_id", profile.id)
      .order("created_at", { ascending: false });
    if (!error) setRatings(data || []);
  }, [profile]);
 
  useEffect(() => {
    loadRatings();
  }, [loadRatings]);
 
  if (!profile) return null;
 
  const count = ratings.length;
  const average = count
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / count).toFixed(1)
    : null;
 
  // The current user's own rating of this person (if any).
  const myRating = currentUser
    ? ratings.find((r) => r.reviewer_id === currentUser.id)
    : null;
 
  const isOwnProfile = currentUser && currentUser.id === profile.id;
  const reviewsWithComment = ratings.filter((r) => r.comment && r.comment.trim());
 
  function stars(score) {
    return "★★★★★".slice(0, score) + "☆☆☆☆☆".slice(0, 5 - score);
  }
 
  return (
    <section>
      <button className="btn btn-ghost" onClick={onBack}>← Volver al tablero</button>
      <div className="view-profile-card">
        <div className="view-head">
          <Avatar name={profile.name} photoUrl={profile.photo_url} />
          <div>
            <div className="view-name">{profile.name}</div>
            {profile.location && <div className="view-location">{profile.location}</div>}
            {average && (
              <div className="rating-summary">
                <span className="stars-display">{stars(Math.round(average))}</span>
                {average} · {count} {count === 1 ? "calificación" : "calificaciones"}
              </div>
            )}
          </div>
        </div>
 
        {/* Message button — only when logged in and not your own profile */}
        {currentUser && !isOwnProfile && (
          <button className="btn btn-primary" onClick={() => onMessage(profile.id)}>
            Enviar mensaje
          </button>
        )}
 
        {profile.bio && <p className="view-bio">&ldquo;{profile.bio}&rdquo;</p>}
 
        {(profile.skills || []).length === 0 ? (
          <p className="view-location">Sin habilidades listadas aún.</p>
        ) : (
          profile.skills.map((s) => (
            <div key={s.id} className="view-skill">
              <h4>{s.skill_name}</h4>
              {s.experience && <div className="exp">{s.experience} de experiencia</div>}
              {s.description && <p>{s.description}</p>}
            </div>
          ))
        )}
 
        {/* Rating form — only when logged in and not your own profile */}
        {currentUser && !isOwnProfile && (
          <RatingForm
            currentUser={currentUser}
            revieweeId={profile.id}
            existing={myRating}
            onSaved={loadRatings}
          />
        )}
 
        {/* Reviews list */}
        {reviewsWithComment.length > 0 && (
          <div className="reviews">
            <h4>Reseñas</h4>
            {reviewsWithComment.map((r) => (
              <div key={r.id} className="review">
                <span className="stars-display">{stars(r.score)}</span>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
 