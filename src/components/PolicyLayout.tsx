import { type ReactNode } from "react";
import PageReveal from "./PageReveal";

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
        <PageReveal>
          <div className="policy-header">
            <h1 className="policy-title">{title}</h1>
            <p className="policy-updated">Last update: {updated}</p>
          </div>
        </PageReveal>

        <div className="policy-content">
          <PageReveal cascade delay={90}>
            {children}
          </PageReveal>
        </div>
      </div>
    </main>
  );
}
