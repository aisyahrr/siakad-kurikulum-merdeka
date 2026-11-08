import { AuthLayout } from "./AuthLayout";
import type { ReactNode } from "react";

export const SiswaLayout = ({ children }: { children?: ReactNode }) => (
    <AuthLayout>{children}</AuthLayout>
);
