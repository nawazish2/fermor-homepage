import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 md:py-20 ${className}`}
    >
      {children}
    </section>
  );
}
