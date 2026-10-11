import { createContext } from "react";
import type { LoginPayload, User } from "@/Types/auth";

export type AuthValue = {
  user: User | null;
  signIn: (payload: LoginPayload) => Promise<User>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthValue | null>(null);
