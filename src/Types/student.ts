export type Student = { name: string; nisn: string; nis: string; className: string; email: string; homeroomTeacher: string; gpa: number; rank: number };
export type ScheduleItem = { day: string; time: string; subject: string; teacher: string; room: string; topic: string; sks: number };
export type Grade = { subject: string; teacher: string; score: number; letter: string; assignment: number; midterm: number; final: number };
export type AttendanceRecord = { date: string; detail: string; status: string; time: string };
export type Announcement = { title: string; category: string; date: string; excerpt: string; important?: boolean };
