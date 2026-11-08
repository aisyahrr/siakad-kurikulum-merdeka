import { useState, useMemo, useCallback } from "react";
import { getStudentSchedule, subjects, teachers } from "@/data/academic.data";

export interface ScheduleItem {
  id: string | number;
  day: string;
  time: string;
  duration: string;
  session: string;
  subject: string;
  topic: string;
  teacher: string;
  room: string;
  sks: number;
  type: string;
  typeColor: string;
  icon: string;
}

export const DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;
export type DayType = (typeof DAYS)[number];

export function useSchedule(
  studentId: string = "student-alya",
  initialDay: DayType = "Rabu",
) {
  const [selectedDay, setSelectedDay] = useState<DayType>(initialDay);
  const [isSynced, setIsSynced] = useState<boolean>(() => {
    return localStorage.getItem("siakad-calendar-synced") === "true";
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  // Raw Schedule mapping
  const allSchedules = useMemo<ScheduleItem[]>(() => {
    return getStudentSchedule(studentId).map((item, index) => ({
      id: item.id,
      day: item.day,
      time: item.time,
      duration: "Durasi: 90 Menit",
      session: `Sesi ${String(index + 1).padStart(2, "0")}`,
      subject:
        subjects.find((s) => s.id === item.subjectId)?.name ?? "Mata Pelajaran",
      topic: item.topic,
      teacher: teachers.find((t) => t.id === item.teacherId)?.name ?? "Guru",
      room: item.room,
      sks: item.sks,
      type: "Pembelajaran",
      typeColor: "blue",
      icon: "book",
    }));
  }, [studentId]);

  // Filter jadwal hari aktif
  const daySchedules = useMemo(() => {
    return allSchedules.filter((item) => item.day === selectedDay);
  }, [allSchedules, selectedDay]);

  // Kalkulasi Total SKS hari aktif
  const totalSks = useMemo(() => {
    return daySchedules.reduce((total, item) => total + item.sks, 0);
  }, [daySchedules]);

  // Kalkulasi Total Waktu Belajar (Regex & Minute Conversion)
  const totalStudyTime = useMemo(() => {
    let totalMinutes = 0;

    daySchedules.forEach((item) => {
      const match = item.time.match(
        /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
      );
      if (!match) return;

      const [, startHour, startMinute, endHour, endMinute] = match;
      const start = Number(startHour) * 60 + Number(startMinute);
      const end = Number(endHour) * 60 + Number(endMinute);

      if (end > start) {
        totalMinutes += end - start;
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} Menit`;
    if (minutes === 0) return `${hours} Jam`;
    return `${hours} Jam ${minutes} Menit`;
  }, [daySchedules]);

  // Jumlah sesi praktikum
  const practicalSessions = useMemo(() => {
    return daySchedules.filter((item) =>
      item.type.toLowerCase().includes("praktikum"),
    ).length;
  }, [daySchedules]);

  // Sync Calendar Handler
  const handleSyncCalendar = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      localStorage.setItem("siakad-calendar-synced", "true");
      setIsSynced(true);
      setIsSyncing(false);
    }, 700);
  }, []);

  // PDF Print Handler
  const handleDownloadPDF = useCallback(() => {
    window.print();
  }, []);

  return {
    days: DAYS,
    selectedDay,
    setSelectedDay,
    allSchedules,
    daySchedules,
    totalSks,
    totalStudyTime,
    practicalSessions,
    isSynced,
    isSyncing,
    showCalendar,
    setShowCalendar,
    handleSyncCalendar,
    handleDownloadPDF,
  };
}
