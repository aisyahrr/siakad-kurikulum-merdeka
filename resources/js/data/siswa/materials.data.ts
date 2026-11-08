import { Calculator, FileText, FlaskConical, Languages, Leaf, Layers3, Users } from "lucide-react";
import type { Material } from "@/Types/siswa/material.types";

export const materials: Material[] = [
  { id: "math-1", subject: "Matematika Peminatan", teacher: "Bu Siti Nurhaliza, S.Pd", modules: "5 Modul", quizzes: "3 Kuis", progress: "8/10 materi", type: "Modul", semester: "Semester Ganjil", category: "MIPA / Peminatan", Icon: Calculator },
  { id: "physics-1", subject: "Fisika Lanjutan", teacher: "Pak Andi Pratama, M.Pd", modules: "4 Modul", quizzes: "2 Kuis", progress: "6/9 materi", type: "Video", semester: "Semester Ganjil", category: "MIPA / Peminatan", Icon: FlaskConical },
  { id: "chemistry-1", subject: "Kimia", teacher: "Bu Rina Agustine, S.Pd", modules: "5 Modul", quizzes: "3 Kuis", progress: "7/10 materi", type: "Kuis", semester: "Semester Ganjil", category: "MIPA / Peminatan", Icon: FlaskConical },
  { id: "biology-1", subject: "Biologi Sel", teacher: "Pak Budi Santoso, M.Pd", modules: "4 Modul", quizzes: "1 Kuis", progress: "5/8 materi", type: "Dokumen", semester: "Semester Ganjil", category: "MIPA / Peminatan", Icon: Leaf },
  { id: "indonesia-1", subject: "Bahasa Indonesia", teacher: "Bu Dian Lestari, S.Pd", modules: "5 Modul", quizzes: "3 Kuis", progress: "6/10 materi", type: "Modul", semester: "Semester Ganjil", category: "Bahasa", Icon: FileText },
  { id: "english-1", subject: "Bahasa Inggris", teacher: "Ms. Sarah Wijaya, S.Pd", modules: "6 Modul", quizzes: "4 Kuis", progress: "8/12 materi", type: "Video", semester: "Semester Ganjil", category: "Bahasa", Icon: Languages },
  { id: "civic-1", subject: "Pendidikan Pancasila", teacher: "Pak Hendra, S.H.", modules: "3 Modul", quizzes: "2 Kuis", progress: "4/7 materi", type: "Dokumen", semester: "Semester Ganjil", category: "Sosial", Icon: Users },
  { id: "history-1", subject: "Sejarah Indonesia", teacher: "Bu Maya Sari, S.Pd", modules: "4 Modul", quizzes: "2 Kuis", progress: "5/9 materi", type: "Modul", semester: "Semester Ganjil", category: "Sosial", Icon: Layers3 },
];
