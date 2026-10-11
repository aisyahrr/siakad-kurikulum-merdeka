import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "success" | "info" | "neutral";

const variants: Record<BadgeVariant, string> = {
  success: "inline-flex items-center gap-1 rounded-full bg-[#edf2f5] px-3 py-1.5 text-[10px] font-medium text-[#53636d]",
  info: "inline-flex items-center gap-1 rounded-full bg-[#dce5f4] px-3 py-1.5 text-[10px] font-semibold text-[#17345b]",
  neutral: "inline-flex items-center gap-1 rounded-full bg-[#edf1f3] px-3 py-1.5 text-[10px] font-medium text-[#65747b]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "neutral", className, ...props }: BadgeProps) {
  return <span className={`${variants[variant]} ${className ?? ""}`} {...props}>{children}</span>;
}
