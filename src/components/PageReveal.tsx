import { Children, type ReactNode } from "react";

const STEP_MS = 90;

/**
 * Fades content up as soon as the page mounts — a plain CSS animation, not
 * gated by scroll position. Used on document-style pages (Privacy Policy,
 * Terms of Service, Support) where everything should appear together when the
 * page opens, unlike the scroll-triggered react-awesome-reveal `Fade` used on
 * the homepage's Features and Testimonials sections, which only plays each
 * part in as it's scrolled into view.
 *
 * Respects prefers-reduced-motion via the `.page-reveal` rule in globals.css,
 * so no client-side hook/JS branching is needed here.
 */
export default function PageReveal({
  children,
  cascade = false,
  delay = 0,
}: {
  children: ReactNode;
  cascade?: boolean;
  delay?: number;
}) {
  if (!cascade) {
    return (
      <div className="page-reveal" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </div>
    );
  }

  return (
    <>
      {Children.map(children, (child, i) => (
        <div className="page-reveal" style={{ animationDelay: `${delay + i * STEP_MS}ms` }}>
          {child}
        </div>
      ))}
    </>
  );
}
