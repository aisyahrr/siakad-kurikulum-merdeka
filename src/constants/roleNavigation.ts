import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  House,
  Layers,
  Megaphone,
  Settings,
  Upload,
  UserRound,
  Users,
} from "lucide-react";

export const roleIcons = {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  House,
  Layers,
  Megaphone,
  Settings,
  Upload,
  Users,
  UserRound,
};

export type RoleIconName = keyof typeof roleIcons;

export type RoleNavigationItem = {
  label: string;
  href: string;
  icon: RoleIconName;
};

export const roleNavigation: Record<string, RoleNavigationItem[]> = {
  siswa: [
    { label: "Dashboard", href: "/siswa", icon: "House" },
    { label: "Jadwal", href: "/siswa/jadwal", icon: "CalendarDays" },
    { label: "Materi & Kuis", href: "/siswa/materi", icon: "GraduationCap" },
    { label: "Nilai", href: "/siswa/nilai", icon: "ClipboardCheck" },
    { label: "Presensi", href: "/siswa/presensi", icon: "Clock" },
    { label: "Pengumuman", href: "/siswa/pengumuman", icon: "Megaphone" },
    { label: "Rapor Digital", href: "/siswa/rapor", icon: "FileText" },
    { label: "Profil", href: "/siswa/profil", icon: "UserRound" },
  ],
  "orang-tua": [
    { label: "Dashboard", href: "/orang-tua", icon: "House" },
    { label: "Nilai Anak", href: "/orang-tua/nilai", icon: "BarChart3" },
    { label: "Presensi", href: "/orang-tua/presensi", icon: "ClipboardCheck" },
    { label: "Pengumuman", href: "/orang-tua/pengumuman", icon: "Megaphone" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: "House" },
    { label: "Pengguna", href: "/admin/pengguna", icon: "Users" },
    {
      label: "Guru & Siswa",
      href: "/admin/data-akademik",
      icon: "GraduationCap",
    },
    { label: "Kelas & Mapel", href: "/admin/master-data", icon: "BookOpen" },
    { label: "Import Data", href: "/admin/import", icon: "Upload" },
  ],
  guru: [
    { label: "Dashboard", href: "/guru", icon: "House" },
    { label: "Mata Pelajaran", href: "/guru/mata-pelajaran", icon: "BookOpen" },
    { label: "Jadwal Mengajar", href: "/guru/jadwal", icon: "CalendarDays" },
    { label: "Nilai", href: "/guru/nilai", icon: "BarChart3" },
    { label: "Presensi", href: "/guru/presensi", icon: "ClipboardCheck" },
    { label: "Pertemuan", href: "/guru/pertemuan", icon: "Layers" },
    { label: "Kuis & Ujian", href: "/guru/kuis", icon: "ClipboardCheck" },
    { label: "Matriks Siswa", href: "/guru/matriks", icon: "BarChart3" },
    { label: "Pengumuman", href: "/guru/pengumuman", icon: "Megaphone" },
  ],
  "wali-kelas": [
    { label: "Dashboard", href: "/wali-kelas", icon: "House" },
    { label: "Siswa Binaan", href: "/wali-kelas/siswa", icon: "Users" },
    { label: "Nilai Kelas", href: "/wali-kelas/nilai-rekap", icon: "BarChart3" },
    { label: "Presensi", href: "/wali-kelas/presensi", icon: "ClipboardCheck" },
    { label: "Bimbingan", href: "/wali-kelas/bimbingan", icon: "UserRound" },
    { label: "Pengumuman", href: "/wali-kelas/pengumuman", icon: "Megaphone" },
  ],
};

export const roleLabels: Record<string, string> = {
  admin: "Portal Administrator",
  guru: "Portal Guru",
  "wali-kelas": "Portal Wali Kelas",
  siswa: "Portal Akademik Siswa",
  "orang-tua": "Portal Orang Tua",
};