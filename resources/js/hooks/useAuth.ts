import { useContext } from "react";
import { AuthContext } from "@/providers/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is missing");
  return context;
}
