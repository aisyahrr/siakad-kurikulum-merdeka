import { useMemo } from "react";
import {
  announcements as academicAnnouncements,
  attendance as attendanceRecords,
  getStudentSchedule,
  students,
  subjects,
  teachers,
} from "@/data/academic.data";

export interface StudentScheduleItem {
  id: string | number;
  time: string;
  session: number;
  subject: string;
  type: string;
  room: string;
  teacher: string;
  status: "Selesai" | "Sedang Berlangsung" | "Mendatang";
}

export function useStudentDashboard(studentId?: string | number) {
  // Ambil data siswa aktif (bisa dipass via props atau fallback ke student pertama)
  const activeStudent = useMemo(() => {
    if (studentId) {
      return students.find((s) => s.id === studentId) ?? students[0];
    }
    return students[0];
  }, [studentId]);

  // Model data profil & performa siswa
  const student = useMemo(() => {
    const previousGpa = 87.2;
    const currentGpa = activeStudent?.gpa ?? 0;
    const gpaIncrease = (currentGpa - previousGpa).toFixed(2);

    return {
      ...activeStudent,
      status: "Aktif Reguler",
      semester: "Ganjil",
      maxGpa: 100,
      activeCredits: 22,
      totalStudents: 36,
      previousGpa,
      gpaIncrease,
    };
  }, [activeStudent]);

  // Kalkulasi kehadiran teroptimasi (cukup 1x loop reduce)
  const attendance = useMemo(() => {
    const records = attendanceRecords.filter(
      (item) => item.studentId === activeStudent.id
    );

    const counts = records.reduce(
      (acc, item) => {
        if (item.status === "Hadir") acc.present += 1;
        else if (item.status === "Izin") acc.permission += 1;
        else if (item.status === "Sakit") acc.sick += 1;
        else if (item.status === "Alpa") acc.absent += 1;
        return acc;
      },
      { present: 0, permission: 0, sick: 0, absent: 0 }
    );

    const total = records.length;
    const percentage = total > 0 ? Math.round((counts.present / total) * 1000) / 10 : 0;

    return {
      ...counts,
      total,
      percentage,
      maxAbsent: 4,
    };
  }, [activeStudent.id]);

  // Mapping jadwal belajar & relasi pengampu
  const schedules = useMemo<StudentScheduleItem[]>(() => {
    return getStudentSchedule(activeStudent.id).map((item, index) => {
      const subjectName =
        subjects.find((subject) => subject.id === item.subjectId)?.name ??
        "Mata Pelajaran";
      const teacherName =
        teachers.find((teacher) => teacher.id === item.teacherId)?.name ??
        "Guru Pengampu";

      const status: StudentScheduleItem["status"] =
        index === 0
          ? "Selesai"
          : index === 1
          ? "Sedang Berlangsung"
          : "Mendatang";

      return {
        id: item.id,
        time: item.time,
        session: index + 1,
        subject: subjectName,
        type: "Pembelajaran",
        room: item.room,
        teacher: teacherName,
        status,
      };
    });
  }, [activeStudent.id]);

  // Mapping pengumuman
  const announcements = useMemo(() => {
    return academicAnnouncements.map((item) => ({
      id: item.id,
      category: item.category,
      title: item.title,
      date: item.date,
    }));
  }, []);

  return {
    student,
    attendance,
    schedules,
    announcements,
  };
}