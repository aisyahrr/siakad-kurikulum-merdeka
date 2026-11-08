export type UserRole = "admin" | "guru" | "wali-kelas" | "orang-tua" | "siswa";

export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
      role: UserRole;
};

export type Auth = {
    user: User;
};

export interface LoginPayload {
  email: string;
  password: string;
}

export type SharedData = {
    auth: Auth;
};

