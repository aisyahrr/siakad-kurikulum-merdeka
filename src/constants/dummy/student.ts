import { announcements as academicAnnouncements, attendance as academicAttendance, grades as academicGrades, rombels, schedules as academicSchedules, students, subjects, teachers } from "@/data/academic.data";
import type { Announcement, AttendanceRecord, Grade, ScheduleItem, Student } from "@/Types/student";

const activeStudent = students[0];
const getSubject = (id: string) => subjects.find((item) => item.id === id)?.name ?? "Mata Pelajaran";
const getTeacher = (id: string) => teachers.find((item) => item.id === id)?.name.replace(/\.$/, "") ?? "Guru";
const getRombel = (id: string) => rombels.find((item) => item.id === id)?.name ?? "";

export const student: Student = { name: activeStudent.name, nisn: activeStudent.nisn, nis: activeStudent.nis, className: getRombel(activeStudent.rombelId), email: activeStudent.email, homeroomTeacher: activeStudent.homeroomTeacher, gpa: activeStudent.gpa, rank: activeStudent.rank };
export const schedules: ScheduleItem[] = academicSchedules.filter((item) => item.rombelId === activeStudent.rombelId).map((item) => ({ day: item.day, time: item.time, subject: getSubject(item.subjectId), teacher: getTeacher(item.teacherId), room: item.room, topic: item.topic, sks: item.sks }));
export const grades: Grade[] = academicGrades.filter((item) => item.studentId === activeStudent.id).map((item) => ({ subject: getSubject(item.subjectId), teacher: getTeacher(item.teacherId), score: item.score, letter: item.letter, assignment: item.assignment, midterm: item.midterm, final: item.final }));
export const attendance: AttendanceRecord[] = academicAttendance.filter((item) => item.studentId === activeStudent.id).map((item) => ({ date: item.date, detail: item.detail, status: item.status, time: item.time }));
export const announcements: Announcement[] = academicAnnouncements.map((item) => ({ title: item.title, category: item.category, date: item.date, excerpt: item.excerpt, important: item.important }));
