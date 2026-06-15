"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLang } from "@/lib/i18n";

export default function RatingForm({ currentUser, revieweeId, existing, onSaved }) {
  const { t } = useLang();
  const [score, setScore] = useState(existing ? existing.score : 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existing ? existing.comment || "" : "");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    if (score < 1) { setNote(t("rating.pickStar")); return; }
    setBusy(true);
    try {
      // upsert so a second rating updates the first (unique reviewer+reviewee).
      const { error } = await supabase
        .from("ratings")
        .upsert(
          {
            reviewer_id: currentUser.id,
            reviewee_id: revieweeId,
            score,
            comment: comment.trim(),
          },
          { onConflict: "reviewer_id,reviewee_id" }
        );
      if (error) { setNote(error.message); return; }
      setNote(t("rating.thanks"));
      if (onSaved) onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rating-form">
      <h4>{existing ? t("rating.yours") : t("rating.ratePerson")}</h4>
      <div className="stars-input">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${(hover || score) >= n ? "on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setScore(n)}
            aria-label={t("rating.starsAria", { n })}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="rating-comment"
        rows={2}
        placeholder={t("rating.commentPlaceholder")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div>
        <button className="btn btn-primary btn-small" onClick={save} disabled={busy}>
          {busy ? t("rating.saving") : existing ? t("rating.update") : t("rating.submit")}
        </button>
        <span className="save-note">{note}</span>
      </div>
    </div>
  );
}
