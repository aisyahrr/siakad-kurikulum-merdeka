import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export function IconButton({ icon, "aria-label": ariaLabel, ...props }: IconButtonProps) {
  return <Button {...props} aria-label={ariaLabel} className={`h-10 w-10 p-0 ${props.className ?? ""}`} variant="ghost">{icon}</Button>;
}
