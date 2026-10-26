"use client";

import Image from "next/image";

type StoreButtonProps = { href: string; icon: string; label: string; tone?: "light" | "dark" };

// Links to the store page once it exists (NEXT_PUBLIC_APP_STORE_URL /
// NEXT_PUBLIC_PLAY_STORE_URL); until then it says "Soon" instead of sending
// people to the store's home page.
export function StoreButton({ href, icon, label, tone = "light" }: StoreButtonProps) {
  const content = (
    <>
      <Image src={icon} alt="" width={20} height={20} className="store-pill-icon" aria-hidden="true" />
      <span className="store-pill-text">{label}</span>
      {href ? null : <span className="store-soon">Soon</span>}
    </>
  );
  return href ? (
    <a className={`btn btn-${tone} cursor-target`} href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <span className={`btn btn-${tone} store-pill-soon`} aria-label={`${label}, coming soon`}>
      {content}
    </span>
  );
}
