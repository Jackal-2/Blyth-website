import { Children, type ReactNode } from "react";

const STEP_MS = 90;

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
