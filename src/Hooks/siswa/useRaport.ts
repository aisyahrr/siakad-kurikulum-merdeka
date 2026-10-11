import { useState, useMemo, useCallback } from "react";
import { student as defaultStudent } from "../../constants/dummy/student";

export interface ReportHistoryItem {
  code: string;
  semester: string;
  badge: string;
  detail: string;
  average: string;
  rank: string;
  rankTotal: string;
  attendance: string;
}

const INITIAL_HISTORY: ReportHistoryItem[] = [
  {
    code: "05",
    semester: "Semester 5 (Genap 2023/2024)",
    badge: "Tuntas",
    detail: "Kelas XI MIPA 1 • Wali Kelas: Drs. Bambang Supeno",
    average: "88.2",
    rank: "#3",
    rankTotal: "/ 36",
    attendance: "98%",
  },
  {
    code: "04",
    semester: "Semester 4 (Ganjil 2023/2024)",
    badge: "Tuntas",
    detail: "Kelas XI MIPA 1 • Wali Kelas: Drs. Bambang Supeno",
    average: "87.6",
    rank: "#4",
    rankTotal: "/ 36",
    attendance: "96%",
  },
  {
    code: "03",
    semester: "Semester 3 (Genap 2022/2023)",
    badge: "Tuntas",
    detail: "Kelas X MIPA 2 • Wali Kelas: Siti Nurhaliza, S.Pd",
    average: "86.9",
    rank: "#5",
    rankTotal: "/ 35",
    attendance: "99%",
  },
];

export function useStudentReport() {
  const [activeTab, setActiveTab] = useState<"current" | "archive">("current");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportHistoryItem | null>(
    null,
  );

  // Pengurutan arsip riwayat semester
  const reportHistory = useMemo(() => {
    return [...INITIAL_HISTORY].sort((a, b) => {
      const codeA = Number(a.code);
      const codeB = Number(b.code);
      return sortOrder === "desc" ? codeB - codeA : codeA - codeB;
    });
  }, [sortOrder]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    student: defaultStudent,
    activeTab,
    setActiveTab,
    sortOrder,
    toggleSortOrder,
    reportHistory,
    isQrModalOpen,
    setIsQrModalOpen,
    previewReport,
    setPreviewReport,
    handlePrint,
  };
}
