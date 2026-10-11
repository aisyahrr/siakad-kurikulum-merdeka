# Product Requirement Document (PRD): Sistem Informasi Akademik (SIAKAD)

## 1. Ringkasan Eksekutif & Tujuan Produk

SIAKAD adalah platform tata kelola pembelajaran dan operasional akademik terpadu berbasis web yang mengadopsi standar **Kurikulum Merdeka (Fase E & Fase F)**. Platform ini menghubungkan lima aktor sekolah (Admin, Guru, Wali Kelas, Siswa, dan Orang Tua/Wali Murid) dalam satu sistem dengan pemisahan peran yang tegas, sistem deteksi dini (*Early Warning System*), serta pelaporan rapor digital siap cetak.

---

## 2. Karakteristik & Desain Sistem (Design System)

Aplikasi ini menerapkan bahasa visual **Soft Neumorphism** yang konsisten dengan nuansa sejuk, bersih, dan kontras teruji.

### Palet Warna Utama

| Peran Warna | Kode | Keterangan |
|---|---|---|
| Background Canvas / Base | `#e9eef3` | Latar utama |
| Card Raised / Surface | `#e9eef3` | Permukaan kartu |
| Inset Well / Field Background | `#edf2f6` | Latar input / panel cekung |
| Primary / Accent Navy | `#17345b` | Teks utama, tombol primer, header |
| Secondary / Accent Teal | `#087b79` | Indikator tuntas, tombol sukses/kontak |
| Status Bahaya / Urgent Red | `#c0392b` / `#fadbd8` | Peringatan, alpa, remedial |
| Status Peringatan / Amber | `#d97706` / `#fef3c7` | Sakit, izin dispensasi |
| Teks Primer | `#20272d` | |
| Teks Sekunder / Keterangan | `#68777c` / `#5a6a72` | |

### Box-Shadow Tokens

- **Raised Standard (Kartu & Panel):** `shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]` atau `shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff]`
- **Raised Button / Chip:** `shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]`
- **Inset Field / Well (Input, Textarea, Panel Cekung):** `shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]` atau `shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]`

### Tipografi & Ergonomi

- **Sudut membulat (border radius):** `rounded-[28px]` untuk container utama, `rounded-2xl` untuk kartu turunan, dan `rounded-full` untuk badge/chip/button.
- **Batas ukuran font minimal:** `text-[11px]` atau `text-xs` (menghindari teks mikro yang sulit dibaca).
- **Format baris metrik:** Menggunakan pola iteratif Array-of-Objects (`.map()`) untuk menghindari redundansi JSX.

---

## 3. Matriks Hak Akses & Peran Pengguna (Role-Based Access Control)

| Aktor | Fokus Utama | Akses Data | Interaksi Kunci |
|---|---|---|---|
| **Admin** | Tata kelola sistem & master data | Global (seluruh sekolah) | CRUD Akun, Plotting Rombel, Kurikulum Mapel, Bulk Import CSV, Kunci Nilai |
| **Guru** | KBM & Asesmen Mata Pelajaran | Terbatas pada kelas & mapel yang diampu | Presensi per sesi, input Formatif/STS/SAS, bank materi, kuis, pengumuman |
| **Wali Kelas** | Pembinaan 1 rombel secara holistik | Terbatas pada 1 rombel binaan | Monitoring kelas, Early Warning System, Dossier siswa, Rekap Rapor A4, Log Bimbingan |
| **Siswa** | Belajar mandiri & transparansi capaian | Personal diri sendiri | Dashboard, materi/kuis, presensi, jadwal, transkrip nilai, rapor digital, profil |
| **Orang Tua** | Pemantauan perkembangan anak (*read-mostly*) | Personal anak terhubung | Monitoring capaian, status presensi hari ini, kontak wali kelas, ajukan surat izin |

---

## 4. Rincian Modul & Fitur Spesifik

### A. Modul Administrator (`/admin`)

**Dashboard Kendali (`/admin`)**
- Metrik agregat sekolah (Total Siswa, Guru, Rombel, Uptime Server).
- *System Audit Trail* (log aktivitas perubahan data penting secara realtime).
- Pintasan cepat ke penambahan akun dan impor berkas.

**Manajemen Pengguna & Kredensial (`/admin/pengguna`)**
- Katalog multi-aktor dengan filter per role.
- Reset kredensial dan aktivasi/penonaktifan akses akun secara instan.
- Form modal penambahan pengguna baru (NISN/NIP terintegrasi).

**Data Pokok Akademik (`/admin/data-akademik`)**
- Tab **Buku Induk Siswa** (nama, NISN, rombel, angkatan, status).
- Tab **Pendidik & Penugasan** (NIP, beban ajar, plotting Wali Kelas per rombel).

**Master Rombel & Mata Pelajaran (`/admin/master-data`)**
- Pengaturan Rombongan Belajar (Fase E/F, daya tampung, alokasi wali kelas).
- Konfigurasi Mata Pelajaran (kode mapel, bobot jam tatap muka, target KKTP acuan).

**Bulk Import Database (`/admin/import`)**
- Dukungan unggah berkas massal untuk Siswa, Guru, dan Rombel.
- Unduh template CSV resmi.
- Parser pratinjau data dengan validasi galat baris (*row validation*).

**Pengaturan Sistem (`/admin/pengaturan`)**
- Pengaturan Tahun Ajaran & Semester aktif.
- Fitur **Kunci Entri Nilai Rapor (Grade Entry Freeze)** untuk membekukan perubahan nilai oleh guru sebelum pencetakan rapor.
- Konfigurasi ambang batas KKTP dan peringatan absensi.
- Profil instansi sekolah (NPSN, alamat, kepala sekolah) untuk kop rapor resmi.

### B. Modul Guru Mata Pelajaran (`/guru`)

- **Dashboard Guru (`/guru`):** Ringkasan kelas ajar, jadwal mengajar hari ini, dan aksi cepat.
- **Mata Pelajaran (`/guru/mata-pelajaran`):** Katalog kurikulum dan materi yang diampu.
- **Jadwal Mengajar (`/guru/jadwal`):** Jadwal tatap muka mingguan terstruktur per jam pelajaran.
- **Input Nilai Asesmen (`/guru/nilai`):** Input penilaian Formatif (40%), STS (30%), dan SAS (30%) dengan kalkulasi otomatis ketercapaian KKTP (70.0).
- **Presensi Siswa Per Pertemuan (`/guru/presensi`):** Pencatatan kehadiran tatap muka kelas per sesi pelajaran (Hadir, Sakit, Izin, Alpa).
- **Pertemuan & Jurnal Mengajar (`/guru/pertemuan`):** Modul manajemen silabus, topik bahasan, dan jurnal harian KBM.
- **Kuis & Evaluasi (`/guru/kuis`):** Pengelolaan penugasan mandiri dan asesmen formatif.
- **Matriks Capaian Siswa (`/guru/matriks`):** Analitik sebaran nilai siswa terhadap batas KKTP.
- **Pengumuman Guru (`/guru/pengumuman`):** Pusat warta operasional guru dan surat edaran kurikulum.

### C. Modul Wali Kelas (`/wali-kelas`)

**Dashboard Monitoring & Early Warning (`/wali-kelas`)**
- Rata-rata capaian kumulatif kelas dan persentase kehadiran rombel.
- **Early Warning System:** deteksi otomatis siswa berisiko (presensi < 75% atau nilai rata-rata < 70.0).
- Tombol pintas hubungi orang tua via WhatsApp dengan template pesan otomatis.
- Tombol navigasi cepat beralih peran ke ruang guru (`/guru`).

**Dossier & Profil Siswa Binaan (`/wali-kelas/siswa`)**
- Tampilan *Split-Master*: daftar siswa di sisi kiri dan dossier mendalam di sisi kanan.
- Transkrip komprehensif lintas mata pelajaran (Formatif, STS, SAS, Nilai Akhir).
- Riwayat akumulasi ketidakhadiran individu (H/I/S/A) dan kontak wali murid.

**Rekap Nilai & Cetak Rapor Digital (`/wali-kelas/nilai` atau `/rekap`)**
- Master spreadsheet rekap nilai seluruh siswa kelas binaan.
- Kalkulasi otomatis peringkat kelas (Rank #1 s.d. selesai).
- Fitur ekspor berkas `.CSV`.
- Modal Pratinjau Rapor Digital Cetak (Standar A4/Legal): lengkap dengan kop dinas pendidikan, identitas siswa, tabel capaian kompetensi, catatan wali kelas, dan kolom tanda tangan resmi.

**Rekap Presensi & Verifikasi Dispensasi (`/wali-kelas/presensi`)**
- Ringkasan akumulasi kehadiran rombel per bulan atau semester.
- Verifikasi permohonan surat sakit/dispensasi yang diajukan orang tua siswa (Setujui / Tolak).

**Catatan Bimbingan & Konseling (`/wali-kelas/bimbingan`)**
- Dokumentasi kasus siswa (Akademik, Kedisiplinan, Presensi, Karakter).
- Pencatatan rencana tindak lanjut dan status penanganan (Dalam Pemantauan vs Tuntas).

**Warta & Pengumuman Rombel (`/wali-kelas/pengumuman`)**
- Publikasi pengumuman internal untuk siswa rombel dan wali murid.
- Pengunggahan surat edaran dan dokumen lampiran PDF.

### D. Modul Siswa (`/siswa`)

- **Dashboard Siswa (`/siswa`):** Rangkuman jadwal aktif, status presensi, tugas mendekati tenggat, dan capaian nilai.
- **Jadwal Pelajaran (`/siswa/jadwal`):** Agenda kegiatan belajar mengajar mingguan.
- **Materi & Kuis (`/siswa/materi`):** Akses bahan ajar dan pengerjaan asesmen daring.
- **Nilai Capaian (`/siswa/nilai`):** Transparansi perolehan nilai formatif dan sumatif per mapel.
- **Presensi Mandiri (`/siswa/presensi`):** Histori kehadiran dan status absensi.
- **Rapor Digital (`/siswa/rapor`):** Pratinjau lembar rapor semester aktif dan arsip semester sebelumnya.
- **Warta & Pengumuman (`/siswa/pengumuman`):** Informasi edaran resmi sekolah.
- **Profil Siswa (`/siswa/profil`):** Biodata diri, data NISN, dan informasi orang tua/wali.

### E. Modul Orang Tua / Wali Murid (`/orang-tua`)

**Dashboard Orang Tua (`/orang-tua`)**
- Status kehadiran anak hari ini secara realtime (Hadir - Tepat Waktu / Sakit / Izin).
- Kartu rata-rata nilai, peringkat kelas anak, dan tingkat kehadiran semester berjalan.
- Tombol langsung kirim pesan WhatsApp ke Wali Kelas.
- Agenda dan undangan pertemuan wali murid terbaru.

**Nilai & Perkembangan Anak (`/orang-tua/nilai`)**
- Transkrip nilai *read-only* seluruh mata pelajaran.
- Status ketercapaian batas KKTP (70.0) dan pratinjau lembar rapor digital.

**Presensi & Pengajuan Izin Mandiri (`/orang-tua/presensi`)**
- Rekapitulasi absensi anak (Hadir, Izin, Sakit, Alpa).
- **Formulir Pengajuan Izin/Sakit:** orang tua dapat mengunggah keterangan sakit atau dispensasi tanpa harus datang ke sekolah.

**Warta & Edaran Sekolah (`/orang-tua/pengumuman`)**
- Informasi rapat evaluasi belajar, edaran libur semester, dan agenda penting sekolah.

---

## 5. Struktur Routing Aplikasi (`AppRoutes.tsx`)

```tsx
<Routes>
  {/* Public Route */}
  <Route path="/login" element={<LoginPage />} />

  {/* Protected Session */}
  <Route element={<ProtectedRoute />}>

    {/* 1. ADMIN WORKSPACE */}
    <Route element={<RoleRoute role="admin" />}>
      <Route element={<AdminLayout />}>
        <Route index path="/admin" element={<DashboardAdminPage />} />
        <Route path="/admin/pengguna" element={<ManajemenPenggunaPage />} />
        <Route path="/admin/data-akademik" element={<DataAkademikPage />} />
        <Route path="/admin/master-data" element={<MasterDataPage />} />
        <Route path="/admin/import" element={<ImportDataPage />} />
        <Route path="/admin/pengaturan" element={<PengaturanAdminPage />} />
      </Route>
    </Route>

    {/* 2. GURU WORKSPACE */}
    <Route element={<RoleRoute role="guru" />}>
      <Route element={<GuruLayout />}>
        <Route index path="/guru" element={<DashboardPage />} />
        <Route path="/guru/mata-pelajaran" element={<MataPelajaranPage />} />
        <Route path="/guru/jadwal" element={<JadwalGuruPage />} />
        <Route path="/guru/nilai" element={<NilaiGuruPage />} />
        <Route path="/guru/presensi" element={<PresensiGuruPage />} />
        <Route path="/guru/pertemuan" element={<PertemuanPage />} />
        <Route path="/guru/kuis" element={<KuisPage />} />
        <Route path="/guru/matriks" element={<MatriksPage />} />
        <Route path="/guru/pengumuman" element={<PengumumanPage />} />
      </Route>
    </Route>

    {/* 3. WALI KELAS WORKSPACE */}
    <Route element={<RoleRoute role="wali-kelas" />}>
      <Route element={<WaliKelasLayout />}>
        <Route index path="/wali-kelas" element={<DashboardWaliPage />} />
        <Route path="/wali-kelas/siswa" element={<DossierSiswaPage />} />
        <Route path="/wali-kelas/nilai" element={<RekapNilaiPage />} />
        <Route path="/wali-kelas/rekap" element={<RekapNilaiPage />} />
        <Route path="/wali-kelas/nilai-rekap" element={<RekapNilaiPage />} />
        <Route path="/wali-kelas/presensi" element={<PresensiKelasPage />} />
        <Route path="/wali-kelas/bimbingan" element={<BimbinganPage />} />
        <Route path="/wali-kelas/pengumuman" element={<PengumumanWaliPage />} />
      </Route>
    </Route>

    {/* 4. ORANG TUA WORKSPACE */}
    <Route element={<RoleRoute role="orang-tua" />}>
      <Route element={<OrangTuaLayout />}>
        <Route index path="/orang-tua" element={<DashboardOrangTuaPage />} />
        <Route path="/orang-tua/nilai" element={<NilaiAnakPage />} />
        <Route path="/orang-tua/presensi" element={<PresensiAnakPage />} />
        <Route path="/orang-tua/pengumuman" element={<PengumumanOrangTuaPage />} />
      </Route>
    </Route>

    {/* 5. SISWA WORKSPACE */}
    <Route element={<RoleRoute role="siswa" />}>
      <Route element={<SiswaLayout />}>
        <Route index path="/siswa" element={<StudentDashboard />} />
        <Route path="/siswa/jadwal" element={<ScheduleFeature />} />
        <Route path="/siswa/materi" element={<MateriFeature />} />
        <Route path="/siswa/nilai" element={<NilaiFeature />} />
        <Route path="/siswa/presensi" element={<PresensiFeature />} />
        <Route path="/siswa/rapor" element={<RaporFeature />} />
        <Route path="/siswa/pengumuman" element={<PengumumanFeature />} />
        <Route path="/siswa/profil" element={<ProfilFeature />} />
      </Route>
    </Route>

  </Route>

  {/* Wildcard Fallback */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
```

---

## 6. Struktur Direktori Proyek

```text
src/
├── Components/
│   └── ui/                     # Komponen Neumorphic Atomik (Card, Button, Modal)
├── constants/
│   └── roleNavigation.ts       # Definisi navigasi dan ikon dinamis per role
├── layouts/
│   ├── AdminLayout.tsx
│   ├── GuruLayout.tsx
│   ├── WaliKelasLayout.tsx
│   ├── SiswaLayout.tsx
│   └── OrangTuaLayout.tsx
├── Pages/
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── admin/
│   │   ├── DashboardAdminPage.tsx
│   │   ├── ManajemenPenggunaPage.tsx
│   │   ├── DataAkademikPage.tsx
│   │   ├── MasterDataPage.tsx
│   │   ├── ImportDataPage.tsx
│   │   ├── PengaturanAdminPage.tsx
│   │   └── index.ts
│   ├── guru/
│   │   ├── DashboardPage.tsx
│   │   ├── MataPelajaranPage.tsx
│   │   ├── JadwalGuruPage.tsx
│   │   ├── NilaiGuruPage.tsx
│   │   ├── PresensiGuruPage.tsx
│   │   ├── PertemuanPage.tsx
│   │   ├── KuisPage.tsx
│   │   ├── MatriksPage.tsx
│   │   ├── PengumumanPage.tsx
│   │   └── index.ts
│   ├── wali-kelas/
│   │   ├── DashboardWaliPage.tsx
│   │   ├── DossierSiswaPage.tsx
│   │   ├── RekapNilaiPage.tsx
│   │   ├── PresensiKelasPage.tsx
│   │   ├── BimbinganPage.tsx
│   │   ├── PengumumanWaliPage.tsx
│   │   └── index.ts
│   ├── orangtua/
│   │   ├── DashboardOrangTuaPage.tsx
│   │   ├── NilaiAnakPage.tsx
│   │   ├── PresensiAnakPage.tsx
│   │   ├── PengumumanOrangTuaPage.tsx
│   │   └── index.ts
│   └── siswa/
│       ├── Dashboard.tsx
│       ├── Nilai.tsx
│       ├── Presensi.tsx
│       ├── ScheduleFeature.tsx
│       ├── Materi.tsx
│       ├── Pengumuman.tsx
│       ├── Profil.tsx
│       └── Rapor.tsx
└── Routes/
    ├── AppRoutes.tsx
    ├── ProtectedRoute.tsx
    └── RoleRoute.tsx
```

---

## 7. Model Data Utama (Core Schemas)

### A. Pengguna & Kredensial (`UserAccount`)

```typescript
interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "guru" | "wali-kelas" | "siswa" | "orang-tua";
  identifier: string; // NIP atau NISN
  isActive: boolean;
  lastLogin: string;
}
```

### B. Nilai Kurikulum Merdeka (`GradeRecord`)

```typescript
interface GradeRecord {
  id: string;
  studentId: string;
  subjectCode: string;
  formatif: number;   // Bobot 40%
  sts: number;        // Bobot 30%
  sas: number;        // Bobot 30%
  finalScore: number; // Formula: (0.4 * formatif) + (0.3 * sts) + (0.3 * sas)
  kktp: number;       // Acuan baku: 70.0
  isPassed: boolean;  // finalScore >= kktp
}
```

### C. Presensi & Izin (`AttendanceRecord`)

```typescript
interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
  documentUrl?: string; // Berkas surat izin / surat dokter
  verifiedBy?: string;  // ID Wali Kelas yang memvalidasi
}
```

### D. Log Pembinaan Siswa (`GuidanceLog`)

```typescript
interface GuidanceLog {
  id: string;
  studentId: string;
  category: "Akademik" | "Kedisiplinan" | "Presensi" | "Karakter";
  date: string;
  issue: string;
  actionPlan: string;
  parentContacted: boolean;
  status: "Dalam Pemantauan" | "Tuntas";
}
```

---

## 8. Formula Bisnis & Ketentuan Sistem

### Perhitungan Nilai Akhir (Rapor Digital)

$$\text{Nilai Akhir} = (0.40 \times \text{Formatif}) + (0.30 \times \text{STS}) + (0.30 \times \text{SAS})$$

### Kriteria Ketuntasan Tujuan Pembelajaran (KKTP)

Siswa dinyatakan **Tuntas** jika $\text{Nilai Akhir} \ge 70.0$. Nilai di bawah 70.0 masuk daftar rekomendasi remedial.

### Peringkat Siswa (Ranking Rombel)

Diurutkan secara menurun (*descending*) berdasarkan rata-rata kumulatif seluruh mata pelajaran yang diambil siswa pada semester aktif.

### Indikator Early Warning System (Wali Kelas)

Siswa otomatis diberi tag **Perhatian Khusus / Risiko** jika memenuhi minimal salah satu kondisi berikut:

1. Persentase kehadiran semester < 75%.
2. Terdapat 1 atau lebih nilai mata pelajaran < KKTP (70.0).
3. Terdapat 3 sesi Alpa (tanpa keterangan) berturut-turut.

### Kebijakan Kunci Nilai (Freeze Rule)

Jika fitur `isGradeEntryLocked = true` diaktifkan oleh Admin, seluruh hak akses mutasi nilai pada modul Guru dinonaktifkan (*read-only*), menjamin stabilitas data menjelang pencetakan rapor semester.