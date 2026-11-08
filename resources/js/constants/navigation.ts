export type IconName =
  | "House"
  | "CalendarDays"
  | "GraduationCap"
  | "ClipboardCheck"
  | "FileText"
  | "Megaphone"
  | "UserRound"
  | "BookOpen"
  | "LayoutDashboard"
  | "Users"
  | "PenTool"
  | "Clock"
  | "Layers"
  | "BarChart3"
  | "HelpCircle"
  | "AlertTriangle"
  | "FolderOpen";

export type NavigationItem = {
  label: string;
  href: string;
  icon: IconName;
};

// Navigasi Siswa
export const studentNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/siswa", icon: "House" },
  { label: "Jadwal", href: "/siswa/jadwal", icon: "CalendarDays" },
  { label: "Materi & Kuis", href: "/siswa/materi", icon: "GraduationCap" },
  { label: "Nilai", href: "/siswa/nilai", icon: "ClipboardCheck" },
  { label: "Presensi", href: "/siswa/presensi", icon: "Clock" },
  { label: "Pengumuman", href: "/siswa/pengumuman", icon: "Megaphone" },
  { label: "Rapor Digital", href: "/siswa/rapor", icon: "FileText" },
  { label: "Profil", href: "/siswa/profil", icon: "UserRound" },
];

// Navigasi Guru
export const teacherNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/guru", icon: "LayoutDashboard" },
  { label: "Mata Pelajaran", href: "/guru/mapel", icon: "BookOpen" },
  { label: "Pertemuan", href: "/guru/pertemuan", icon: "Layers" },
  { label: "Presensi Siswa", href: "/guru/presensi", icon: "Clock" },
  { label: "Input Nilai", href: "/guru/nilai", icon: "PenTool" },
  { label: "Analitik KKTP", href: "/guru/analitik", icon: "BarChart3" },
  { label: "Jadwal Mengajar", href: "/guru/jadwal", icon: "CalendarDays" },
];

// Navigasi Wali Kelas
export const homeroomNavigation: NavigationItem[] = [
  { label: "Monitoring Kelas", href: "/wali-kelas", icon: "LayoutDashboard" },
  { label: "Early Warning", href: "/wali-kelas/early-warning", icon: "AlertTriangle" },
  { label: "Dossier Siswa", href: "/wali-kelas/siswa", icon: "Users" },
  { label: "Catatan Bimbingan", href: "/wali-kelas/bimbingan", icon: "FolderOpen" },
];

export const parentNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/orang-tua", icon: "LayoutDashboard" },
  { label: "Nilai Anak", href: "/orang-tua/nilai", icon: "BarChart3" },
  { label: "Presensi Anak", href: "/orang-tua/presensi", icon: "ClipboardCheck" },
  { label: "Pengumuman", href: "/orang-tua/pengumuman", icon: "Megaphone" },
];