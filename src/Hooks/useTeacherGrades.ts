import { useEffect, useState } from "react";
import {
  getTeacherGrades,
  getTeacherStudents,
  subscribeAcademicData,
} from "@/Services/academic.service";
export function useTeacherGrades(subjectId: string, rombelId: string) {
  const [, refresh] = useState(0);
  useEffect(
    () => subscribeAcademicData(() => refresh((value) => value + 1)),
    [],
  );
  return {
    students: getTeacherStudents(rombelId),
    grades: getTeacherGrades(subjectId, rombelId),
  };
}
