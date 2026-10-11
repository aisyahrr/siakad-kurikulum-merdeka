import { useState, useMemo, useCallback } from "react";

export interface GradeItem {
  id: number | string;
  subject: string;
  category: "MIPA / Peminatan" | "Wajib Nasional" | "Muatan Lokal";
  teacher: string;
  score: number;
  letter: string;
  classAverage: number;
  completion: number;
  assignment: number;
  midterm: number;
  final: number;
  icon: "calculator" | "physics" | "chemistry" | "biology" | "english" | "indonesia" | "book";
}

export const CATEGORIES = [
  "Semua Mapel",
  "MIPA / Peminatan",
  "Wajib Nasional",
  "Muatan Lokal",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

const INITIAL_GRADES: GradeItem[] = [
  {
    id: 1,
    subject: "Matematika Peminatan",
    category: "MIPA / Peminatan",
    teacher: "Dr. Hendra Wijaya",
    score: 92,
    letter: "A",
    classAverage: 81,
    completion: 92,
    assignment: 95,
    midterm: 90,
    final: 92,
    icon: "calculator",
  },
  {
    id: 2,
    subject: "Fisika Lanjutan",
    category: "MIPA / Peminatan",
    teacher: "Dra. Sri Wahyuni",
    score: 96,
    letter: "A+",
    classAverage: 78,
    completion: 96,
    assignment: 98,
    midterm: 94,
    final: 96,
    icon: "physics",
  },
  {
    id: 3,
    subject: "Kimia",
    category: "MIPA / Peminatan",
    teacher: "Rina Marlina, M.Si",
    score: 88,
    letter: "B+",
    classAverage: 80,
    completion: 88,
    assignment: 86,
    midterm: 88,
    final: 90,
    icon: "chemistry",
  },
  {
    id: 4,
    subject: "Biologi Sel",
    category: "MIPA / Peminatan",
    teacher: "Ahmad Fauzi, S.Si",
    score: 90,
    letter: "A",
    classAverage: 83,
    completion: 90,
    assignment: 92,
    midterm: 88,
    final: 91,
    icon: "biology",
  },
  {
    id: 5,
    subject: "Bahasa Inggris",
    category: "Wajib Nasional",
    teacher: "Sarah Jenkins, M.Ed",
    score: 94,
    letter: "A",
    classAverage: 82,
    completion: 94,
    assignment: 95,
    midterm: 92,
    final: 95,
    icon: "english",
  },
  {
    id: 6,
    subject: "Bahasa Indonesia",
    category: "Wajib Nasional",
    teacher: "Budi Santoso, S.Pd",
    score: 86,
    letter: "B+",
    classAverage: 79,
    completion: 86,
    assignment: 88,
    midterm: 84,
    final: 86,
    icon: "indonesia",
  },
];

export function useGrades() {
  const [semester, setSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Semua Mapel");
  const [grades] = useState<GradeItem[]>(INITIAL_GRADES);

  // Filter berdasarkan kategori tab
  const filteredGrades = useMemo(() => {
    if (selectedCategory === "Semua Mapel") return grades;
    return grades.filter((g) => g.category === selectedCategory);
  }, [grades, selectedCategory]);

  // Statistik agregat
  const stats = useMemo(() => {
    if (grades.length === 0) {
      return {
        gpa: 0,
        highest: { score: 0, subject: "-" },
        lowest: { score: 0, subject: "-" },
        totalSubjects: 0,
        cumlaudeProgress: 0,
      };
    }

    const totalScore = grades.reduce((acc, curr) => acc + curr.score, 0);
    const gpa = Math.round((totalScore / grades.length) * 10) / 10;

    let highest = grades[0];
    let lowest = grades[0];

    grades.forEach((g) => {
      if (g.score > highest.score) highest = g;
      if (g.score < lowest.score) lowest = g;
    });

    const cumlaudeTarget = 90.0;
    const cumlaudeProgress = Math.min(Math.round((gpa / cumlaudeTarget) * 1000) / 10, 100);

    return {
      gpa,
      highest: { score: highest.score, subject: highest.subject },
      lowest: { score: lowest.score, subject: lowest.subject },
      totalSubjects: grades.length,
      cumlaudeProgress,
    };
  }, [grades]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    semester,
    setSemester,
    selectedCategory,
    setSelectedCategory,
    categories: CATEGORIES,
    filteredGrades,
    stats,
    handlePrint,
  };
}