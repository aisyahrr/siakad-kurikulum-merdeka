import { useEffect, useState } from "react";
import {
  attendance,
  schedules,
  students,
  subjects,
  teachers,
} from "@/data/academic.data";
import { subscribeAcademicData } from "@/Services/academic.service";
export type AttendanceStatus = "Hadir" | "Izin" | "Sakit" | "Alpa";
export function useAcademicAttendance() {
  const [, refresh] = useState(0);
  useEffect(
    () => subscribeAcademicData(() => refresh((value) => value + 1)),
    [],
  );
  const teacherSchedules = schedules.filter(
    (schedule) => schedule.teacherId === "teacher-hendra",
  );
  return {
    schedules: teacherSchedules,
    students,
    attendance,
    subjects,
    teachers,
  };
}
