import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "inline-flex items-center justify-center gap-2 rounded-full bg-[#17345b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102743]",
  secondary: "inline-flex items-center justify-center gap-2 rounded-full bg-[#e9eef3] px-5 py-3 text-sm font-semibold text-[#17345b] shadow-[5px_5px_12px_#cad2da,-5px_-5px_12px_#fff]",
  ghost: "inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-bold",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({ children, variant = "primary", size = "md", icon, iconPosition = "left", className, ...props }: ButtonProps) {
  const content = <>{iconPosition === "left" && icon}{children}{iconPosition === "right" && icon}</>;
  return <button className={`${variants[variant]} ${sizes[size]} ${className ?? ""}`} {...props}>{content}</button>;
}
