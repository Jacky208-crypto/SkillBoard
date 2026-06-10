"use client";
 
import { initials } from "@/lib/helpers";
 
export default function Avatar({ name, photoUrl, className = "" }) {
  if (photoUrl) {
    return (
      <span className={`avatar avatar-photo ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name || "avatar"} />
      </span>
    );
  }
  return <span className={`avatar ${className}`}>{initials(name)}</span>;
}
 