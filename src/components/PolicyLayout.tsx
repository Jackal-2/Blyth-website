import type { ReactNode } from "react";

export default function PolicyLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="policy-page">
      <div className="container">
        <div className="policy-header">
          <h1 className="policy-title">{title}</h1>
          <p className="policy-updated">Last update: {updated}</p>
        </div>
        <div className="policy-content">{children}</div>
      </div>
    </main>
  );
}
