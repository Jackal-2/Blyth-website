import { Children, type ReactNode } from "react";

const STEP_MS = 90;

// Fades content in on mount (CSS animation); respects prefers-reduced-motion via globals.css.
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
