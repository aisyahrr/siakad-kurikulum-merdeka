export const ROLE_LABELS = {
  admin: "Administrator",
  guru: "Guru",
  "wali-kelas": "Wali Kelas",
  siswa: "Siswa",
  "orang-tua": "Orang Tua",
} as const;
export const DEMO_USERS = [
  {
    id: "1",
    name: "Nadia Pratama",
    email: "admin@siakad.test",
    password: "password",
    role: "admin",
  },
  {
    id: "2",
    name: "Budi Santoso",
    email: "guru@siakad.test",
    password: "password",
    role: "guru",
  },
  {
    id: "3",
    name: "Rina Wulandari",
    email: "wali@siakad.test",
    password: "password",
    role: "wali-kelas",
  },
  {
    id: "4",
    name: "Alya Putri",
    email: "siswa@siakad.test",
    password: "password",
    role: "siswa",
  },
  {
    id: "5",
    name: "Siti Rahma",
    email: "orangtua@siakad.test",
    password: "password",
    role: "orang-tua",
  },
] as const;
export const ROLE_MENUS = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: "▦" },
    { label: "Pengguna", href: "/admin/users", icon: "♙" },
    { label: "Laporan", href: "/admin/reports", icon: "▤" },
  ],
  guru: [
    { label: "Dashboard", href: "/guru", icon: "▦" },
    { label: "Kelas Saya", href: "/guru/classes", icon: "▤" },
    { label: "Penilaian", href: "/guru/grades", icon: "✓" },
  ],
  "wali-kelas": [
    { label: "Dashboard", href: "/wali-kelas", icon: "▦" },
    { label: "Siswa Binaan", href: "/wali-kelas/students", icon: "♙" },
    { label: "Kehadiran", href: "/wali-kelas/attendance", icon: "◷" },
  ],
  siswa: [
    { label: "Dashboard", href: "/siswa", icon: "▦" },
    { label: "Jadwal", href: "/siswa/schedule", icon: "◷" },
    { label: "Nilai", href: "/siswa/grades", icon: "▤" },
  ],
    "orang-tua": [
    { label: "Dashboard", href: "/orang-tua", icon: "▦" },
    { label: "Nilai Anak", href: "/orang-tua/nilai", icon: "▤" },
    { label: "Presensi Anak", href: "/orang-tua/presensi", icon: "◷" },
  ],
} as const;
