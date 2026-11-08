export type WorkspaceRole = "admin" | "guru" | "wali-kelas" | "orang-tua";

export type WorkspaceRecord = {
  name: string;
  context: string;
  detail: string;
  status: string;
};

export const workspaceData: Record<WorkspaceRole, { stats: [string, string, string][]; records: WorkspaceRecord[] }> = {
  admin: {
    stats: [["Total Pengguna", "428", "+12 bulan ini"], ["Guru Aktif", "56", "98% terverifikasi"], ["Kelas / Rombel", "18", "Semester ganjil"], ["Data Terimport", "1.248", "Sinkron hari ini"]],
    records: [{ name: "Import data siswa", context: "Data Master", detail: "124 data berhasil diproses", status: "Selesai" }, { name: "Nadia Pratama", context: "Pengguna", detail: "Akun administrator diperbarui", status: "Aktif" }, { name: "XII MIPA 1", context: "Rombel", detail: "Wali kelas ditetapkan", status: "Selesai" }],
  },
  guru: {
    stats: [["Mata Pelajaran", "4", "Yang diampu"], ["Pertemuan Aktif", "24", "+3 minggu ini"], ["Kuis Menunggu", "8", "Perlu ditinjau"], ["Rata-rata Kelas", "86.4", "+4.2% semester ini"]],
    records: [{ name: "P1 - Integral", context: "Matematika", detail: "36 siswa mengikuti", status: "Aktif" }, { name: "Kuis Gelombang", context: "Fisika", detail: "8 jawaban essay", status: "Perlu koreksi" }, { name: "Modul Hidrokarbon", context: "Kimia", detail: "Diunduh 31 siswa", status: "Terbit" }],
  },
  "wali-kelas": {
    stats: [["Siswa Binaan", "36", "XII MIPA 1"], ["Rata-rata Kelas", "86.4", "+2.8% semester ini"], ["Kehadiran", "94.8%", "2 siswa perhatian"], ["Early Warning", "4", "Perlu ditindaklanjuti"]],
    records: [{ name: "Bagas Ramadhan", context: "Presensi", detail: "Kehadiran 72%", status: "Perhatian" }, { name: "Citra Lestari", context: "Kuis", detail: "3 evaluasi belum selesai", status: "Perhatian" }, { name: "Alya Putri", context: "Akademik", detail: "Rata-rata 89.4", status: "Aman" }],
  },
  "orang-tua": {
    stats: [["Nilai Rata-rata", "89.4", "Semester ganjil"], ["Kehadiran", "97.2%", "68 hari hadir"], ["Evaluasi Selesai", "24", "Dari 26 evaluasi"], ["Peringkat Kelas", "#2", "Dari 36 siswa"]],
    records: [{ name: "Matematika Peminatan", context: "Dr. Hendra Wijaya", detail: "Nilai 92 (A)", status: "Baik" }, { name: "Fisika Lanjutan", context: "Dra. Sri Wahyuni", detail: "Nilai 96 (A+)", status: "Sangat baik" }, { name: "Pengumuman UAS", context: "Akademik", detail: "25 Nov - 6 Des 2024", status: "Info" }],
  },
};
