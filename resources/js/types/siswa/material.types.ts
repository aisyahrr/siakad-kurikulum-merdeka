import type { ComponentType } from "react";

export type MaterialType = "Modul" | "Kuis" | "Video" | "Dokumen";
export type MaterialSubjectFilter = "Semua Mata Pelajaran" | "MIPA / Peminatan" | "Bahasa" | "Sosial";

export type Material = {
  id: string;
  subject: string;
  teacher: string;
  modules: string;
  quizzes: string;
  progress: string;
  type: MaterialType;
  semester: "Semester Ganjil" | "Semester Genap";
  category: Exclude<MaterialSubjectFilter, "Semua Mata Pelajaran">;
  Icon: ComponentType<{ size?: number }>;
};

export type MaterialFilters = {
  type: "Semua Materi" | MaterialType;
  semester: Material["semester"];
  subject: MaterialSubjectFilter;
};
