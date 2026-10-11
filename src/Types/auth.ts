export type UserRole = "admin" | "guru" | "wali-kelas" | "orang-tua" | "siswa";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}
