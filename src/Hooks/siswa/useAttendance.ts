import { useState, useEffect, useMemo, useCallback } from "react";
import { attendance as initialAttendance } from "@/data/academic.data";
import { subscribeAcademicData } from "@/Services/academic.service";

export interface AttendanceRecordItem {
  id: string | number;
  date: string;
  detail: string;
  time: string;
  activity: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
  type: "present" | "permission";
}

export const MONTH_FILTERS = [
  "Oktober 2024",
  "September 2024",
  "Agustus 2024",
] as const;

export function useAttendance(studentId: string = "student-alya") {
  const [, setRefreshKey] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("Oktober 2024");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Sinkronisasi data realtime via service
  useEffect(() => {
    return subscribeAcademicData(() => setRefreshKey((prev) => prev + 1));
  }, []);

  // Filter presensi per siswa
  const studentAttendance = useMemo(() => {
    return initialAttendance.filter((item) => item.studentId === studentId);
  }, [studentId]);

  // Agregasi jumlah sesi per status
  const summaryCounts = useMemo(() => {
    return studentAttendance.reduce(
      (acc, item) => {
        if (item.status === "Hadir") acc.present += 1;
        else if (item.status === "Izin") acc.permission += 1;
        else if (item.status === "Sakit") acc.sick += 1;
        else if (item.status === "Alpa") acc.absent += 1;
        return acc;
      },
      { present: 0, permission: 0, sick: 0, absent: 0 },
    );
  }, [studentAttendance]);

  // Metrik akumulatif & batas toleransi
  const metrics = useMemo(() => {
    const total = studentAttendance.length;
    const rate =
      total > 0 ? Math.round((summaryCounts.present / total) * 1000) / 10 : 0;
    const maxAllowance = 10;
    const nonPresentTotal = summaryCounts.permission + summaryCounts.sick;
    const remainingDays = Math.max(0, maxAllowance - nonPresentTotal);

    return {
      rate,
      total,
      maxAllowance,
      remainingDays,
    };
  }, [studentAttendance, summaryCounts]);

  // Transform record tabel/list
  const records = useMemo<AttendanceRecordItem[]>(() => {
    return studentAttendance.map((record) => ({
      id: record.id,
      date: record.date,
      detail: record.detail,
      time: record.time,
      activity: record.status,
      status: record.status as AttendanceRecordItem["status"],
      type: record.status === "Hadir" ? "present" : "permission",
    }));
  }, [studentAttendance]);

  // Handler pengajuan izin / sakit mandiri
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const submitLeaveRequest = useCallback((category: string, reason: string) => {
    setIsModalOpen(false);
    setFeedback(`Permohonan ${category} berhasil dikirim ke Wali Kelas.`);
    setTimeout(() => setFeedback(""), 4000);
  }, []);

  return {
    selectedMonth,
    setSelectedMonth,
    monthFilters: MONTH_FILTERS,
    summaryCounts,
    metrics,
    records,
    isModalOpen,
    setIsModalOpen,
    feedback,
    submitLeaveRequest,
  };
}
