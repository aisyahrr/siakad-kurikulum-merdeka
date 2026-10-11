import { useState, type ReactNode } from "react";
import type { LoginPayload, User } from "@/Types/auth";
import { AuthContext } from "@/providers/AuthContext";
import { login } from "@/Services/auth.service";
import { DEMO_USERS } from "../constants";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("siakad-auth");
    if (!raw) return null;
    try {
      const stored = JSON.parse(raw) as User;
      const current = DEMO_USERS.find((item) => item.id === stored.id);
      if (!current) return null;
       return {
         id: current.id,
         name: current.name,
         email: current.email,
         role: current.role,
       };
    } catch {
      localStorage.removeItem("siakad-auth");
      return null;
    }
  });
  const signIn = async (payload: LoginPayload) => {
    const next = await login(payload);
    setUser(next);
    localStorage.setItem("siakad-auth", JSON.stringify(next));
    return next;
  };
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("siakad-auth");
  };
  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
