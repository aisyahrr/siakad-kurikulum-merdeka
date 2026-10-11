import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getAssignmentView,
  getTeacherStudents,
  saveGrade,
  subscribeAcademicData,
} from "@/Services/academic.service";
import { useTeacherGrades } from "@/Hooks/useTeacherGrades";

export interface StudentGradeRow {
  studentId: string;
  studentName: string;
  nisn: string;
  assignment: number; // Formatif (40%)
  midterm: number; // STS (30%)
  final: number; // SAS (30%)
  finalScore: number;
  letter: "A" | "B" | "C" | "D";
  isPassed: boolean;
}

export function useTeacherGradeBook() {
  const assignments = useMemo(() => getAssignmentView(), []);
  const [assignmentId, setAssignmentId] = useState<string>(
    assignments[0]?.id ?? "",
  );
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [, setRefreshKey] = useState<number>(0);

  // Subscribe ke pembaruan data akademik
  useEffect(() => {
    return subscribeAcademicData(() => setRefreshKey((prev) => prev + 1));
  }, []);

  const selectedAssignment = useMemo(() => {
    return (
      assignments.find((item) => item.id === assignmentId) ?? assignments[0]
    );
  }, [assignments, assignmentId]);

  const { grades } = useTeacherGrades(
    selectedAssignment?.subjectId ?? "",
    selectedAssignment?.rombelId ?? "",
  );

  const students = useMemo(() => {
    return getTeacherStudents(selectedAssignment?.rombelId ?? "");
  }, [selectedAssignment?.rombelId]);

  // Form spreadsheet nilai per siswa
  const [inputRows, setInputRows] = useState<
    Record<string, { assignment: number; midterm: number; final: number }>
  >({});

  useEffect(() => {
    if (!students.length) return;
    const initialMap: Record<
      string,
      { assignment: number; midterm: number; final: number }
    > = {};
    students.forEach((student) => {
      const existing = grades.find((g) => g.studentId === student.id);
      initialMap[student.id] = {
        assignment: existing?.assignment ?? 85,
        midterm: existing?.midterm ?? 80,
        final: existing?.final ?? 85,
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputRows(initialMap);
  }, [students, grades, assignmentId]);

  // Kalkulasi baris siswa lengkap
  const rows = useMemo<StudentGradeRow[]>(() => {
    return students.map((student, idx) => {
      const scores = inputRows[student.id] ?? {
        assignment: 85,
        midterm: 80,
        final: 85,
      };
      const finalScore = Math.round(
        scores.assignment * 0.4 + scores.midterm * 0.3 + scores.final * 0.3,
      );

      let letter: "A" | "B" | "C" | "D" = "D";
      if (finalScore >= 90) letter = "A";
      else if (finalScore >= 80) letter = "B";
      else if (finalScore >= 70) letter = "C";

      return {
        studentId: student.id,
        studentName: student.name,
        nisn: `00649281${idx + 10}`,
        assignment: scores.assignment,
        midterm: scores.midterm,
        final: scores.final,
        finalScore,
        letter,
        isPassed: finalScore >= 70,
      };
    });
  }, [students, inputRows]);

  const handleInputChange = useCallback(
    (
      studentId: string,
      field: "assignment" | "midterm" | "final",
      value: string,
    ) => {
      const numValue = Math.min(100, Math.max(0, Number(value) || 0));
      setInputRows((prev) => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] ?? { assignment: 0, midterm: 0, final: 0 }),
          [field]: numValue,
        },
      }));
    },
    [],
  );

  const handleSaveAll = useCallback(() => {
    if (!selectedAssignment) return;
    rows.forEach((row) => {
      saveGrade({
        studentId: row.studentId,
        subjectId: selectedAssignment.subjectId,
        assignment: row.assignment,
        midterm: row.midterm,
        final: row.final,
      });
    });
    setFeedback(
      `Seluruh nilai rombel ${selectedAssignment.rombelName} berhasil disimpan ke sistem.`,
    );
    setTimeout(() => setFeedback(""), 4000);
  }, [rows, selectedAssignment]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) =>
      r.studentName.toLowerCase().includes(searchStudent.toLowerCase()),
    );
  }, [rows, searchStudent]);

  const handleExportCSV = useCallback(() => {
    if (!rows.length) return;
    const headers =
      "No,Nama Siswa,NISN,Formatif,STS,SAS,Nilai Akhir,Predikat,Status KKTP\n";
    const content = rows
      .map(
        (r, i) =>
          `${i + 1},"${r.studentName}",${r.nisn},${r.assignment},${r.midterm},${r.final},${r.finalScore},${r.letter},${r.isPassed ? "Tuntas" : "Remedial"}`,
      )
      .join("\n");
    const blob = new Blob([headers + content], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Rekap_Nilai_${selectedAssignment.rombelName}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [rows, selectedAssignment]);

  return {
    assignments,
    assignmentId,
    setAssignmentId,
    selectedAssignment,
    searchStudent,
    setSearchStudent,
    feedback,
    rows,
    filteredRows,
    handleInputChange,
    handleSaveAll,
    handleExportCSV,
  };
}
