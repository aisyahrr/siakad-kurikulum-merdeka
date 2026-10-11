import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mb-[18px] rounded-[27px] border-0 bg-[#edf2f4] p-[25px] shadow-[8px_8px_17px_#cbd3db,-8px_-8px_17px_#fff] ${className ?? ""}`}>
      {children}
    </section>
  );
}
