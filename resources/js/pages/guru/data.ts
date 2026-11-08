import {
  assignments,
  announcements,
  subjects,
  rombels,
  addAssignment,
  subscribeAssignments,
} from "@/data/academic.data";
export { subjects, rombels };
export { addAssignment, subscribeAssignments };
export const inset =
  "rounded-2xl bg-[#e9eef3] shadow-[inset_3px_3px_8px_#cbd3db,inset_-3px_-3px_8px_#fff]";
export const teacherId = "teacher-hendra";
export const teacherSubjects = () =>
  assignments
    .filter((item) => item.teacherId === teacherId)
    .map((item) => {
      const subject = subjects.find((entry) => entry.id === item.subjectId);
      const rombel = rombels.find((entry) => entry.id === item.rombelId);
      return {
        ...item,
        name: subject?.name ?? "Onbekend",
        className: rombel?.name ?? "Onbekend",
      };
    });
export const meetings = [
  {
    title: "Integral dan penerapannya",
    subject: "Matematika Peminatan",
    date: "24 Oktober 2024",
    status: "Terbit",
    students: 36,
  },
  {
    title: "Gelombang elektromagnetik",
    subject: "Fisika Lanjutan",
    date: "23 Oktober 2024",
    status: "Terbit",
    students: 36,
  },
  {
    title: "Distribusi data",
    subject: "Matematika Wajib",
    date: "22 Oktober 2024",
    status: "Draft",
    students: 34,
  },
];
export const quizzes = [
  {
    title: "Kuis Integral Dasar",
    subject: "Matematika Peminatan",
    type: "Pilihan ganda",
    responses: 31,
    status: "Perlu ditinjau",
  },
  {
    title: "Evaluasi Gelombang",
    subject: "Fisika Lanjutan",
    type: "Essay & pilihan ganda",
    responses: 36,
    status: "Selesai",
  },
  {
    title: "Ulangan Harian Statistika",
    subject: "Matematika Wajib",
    type: "Pilihan ganda",
    responses: 28,
    status: "Aktif",
  },
];
export { announcements };
