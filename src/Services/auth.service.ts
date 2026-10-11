import { DEMO_USERS } from "../constants";
import type { LoginPayload, User } from "@/Types/auth";
export async function login(payload: LoginPayload): Promise<User> {
  const found =
    DEMO_USERS.find(
      (user) =>
        user.email === payload.email && user.password === payload.password,
    ) ?? DEMO_USERS.find((user) => user.email === payload.email);
  if (!found) throw new Error("Email atau password salah");
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user: User = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
  };
  return user;
}
