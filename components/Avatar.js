"use client";

import { initials } from "@/lib/helpers";

export default function Avatar({ name, photoUrl, className = "" }) {
  if (photoUrl) {
    return (
      <span
        className={`avatar avatar-photo ${className}`}
        style={{ overflow: "hidden", padding: 0 }}
      >
        <img
          src={photoUrl}
          alt={name || "avatar"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: "50%",
          }}
        />
      </span>
    );
  }
  return <span className={`avatar ${className}`}>{initials(name)}</span>;
}
