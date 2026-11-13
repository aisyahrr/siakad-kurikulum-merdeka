# Product Requirements Document (PRD) - Backend SIAKAD-App

Dokumen ini merinci spesifikasi kebutuhan backend untuk **SIAKAD-App** (Sistem Informasi Akademik Sekolah) berdasarkan implementasi frontend dan route SPA/Inertia yang telah dikembangkan dengan Laravel 11 dan React (Inertia.js).

---

## 1. Pendahuluan & Arsitektur Umum

Backend SIAKAD-App dibangun menggunakan kerangka kerja **Laravel 11** dengan pendekatan monolitik menggunakan **Inertia.js** untuk integrasi frontend SPA, serta menyediakan REST API endpoints pendukung jika diperlukan oleh layanan terpisah (seperti mobile app atau widget pihak ketiga).

### Teknologi Utama:
- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum / Breeze (Session-based via Inertia untuk Web, Token-based untuk API)
- **Database**: MySQL / PostgreSQL
- **Role & Permission**: Spatie Laravel Permission (Roles: `admin`, `guru`, `wali-kelas`, `siswa`, `orangtua`)

---

## 2. Struktur Modul & Kebutuhan API/Endpoint

Sistem dibagi menjadi 5 modul utama berdasarkan role pengguna yang didefinisikan pada route frontend.

---

### A. Modul Otentikasi & Pengguna Umum (`/login`, `/settings`)
Menangani manajemen sesi login lintas peran, keamanan, dan pengaturan profil.

| Method | Endpoint | Middleware | Deskripsi | Request Payload / Parameter |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/login` | `guest` | Autentikasi pengguna berdasarkan role | `email`, `password`, `remember` |
| `POST` | `/logout` | `auth` | Mengakhiri sesi pengguna | - |
| `GET/PUT`| `/settings/profile` | `auth` | Mengambil/Memperbarui profil akun | `name`, `email` |
| `PUT` | `/settings/password` | `auth` | Mengubah kata sandi | `current_password`, `password`, `password_confirmation` |

---

### B. Modul Administrator (`/admin/*`)
Admin mengelola keseluruhan sistem sekolah, pengguna, tahun ajaran, dan master data akademik.

| Method | Endpoint | Middleware | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin` | `auth, role:admin` | Dashboard statistik admin (total siswa, guru, kelas, dll) |
| `GET/POST/PUT/DELETE` | `/admin/pengguna` | `auth, role:admin` | CRUD Manajemen Pengguna (Admin, Guru, Siswa, Wali Kelas) |
| `GET/POST/PUT/DELETE` | `/admin/data-akademik` | `auth, role:admin` | Manajemen Tahun Ajaran, Semester, Kurikulum |
| `GET/POST/PUT/DELETE` | `/admin/master-data` | `auth, role:admin` | Manajemen Mata Pelajaran, Ruangan, Kelas |
| `POST` | `/admin/import` | `auth, role:admin` | Import massal data siswa/guru via file Excel/CSV |
| `GET/PUT` | `/admin/pengaturan` | `auth, role:admin` | Konfigurasi umum aplikasi sekolah |

---

### C. Modul Guru (`/guru/*`)
Guru mengelola pembelajaran, materi, jadwal mengajar, penilaian, presensi, kuis, dan pengumuman kelas.

| Method | Endpoint | Middleware | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/guru` | `auth, role:guru` | Dashboard ringkasan jadwal & tugas guru |
| `GET` | `/guru/mata-pelajaran` | `auth, role:guru` | Daftar mata pelajaran yang diampu |
| `GET` | `/guru/jadwal` | `auth, role:guru` | Jadwal mengajar mingguan |
| `GET/POST/PUT` | `/guru/nilai` | `auth, role:guru` | Input & Rekap Nilai Siswa per Mapel |
| `GET/POST` | `/guru/presensi` | `auth, role:guru` | Pencatatan kehadiran siswa di kelas |
| `GET/POST/DELETE` | `/guru/pertemuan` | `auth, role:guru` | Manajemen materi & pertemuan kelas |
| `GET/POST/PUT` | `/guru/kuis` | `auth, role:guru` | Pembuatan & penilaian kuis/tugas |
| `GET/POST` | `/guru/pengumuman` | `auth, role:guru` | Publikasi pengumuman untuk siswa/kelas |

---

### D. Modul Wali Kelas (`/wali-kelas/*`)
Wali kelas memantau rekap presensi kelas, rekap nilai, dossier/catatan siswa, bimbingan konseling, dan pengumuman khusus.

| Method | Endpoint | Middleware | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/wali-kelas` | `auth, role:wali-kelas` | Dashboard ringkasan kelas binaan |
| `GET/POST` | `/wali-kelas/bimbingan` | `auth, role:wali-kelas` | Pencatatan catatan bimbingan/konseling siswa |
| `GET` | `/wali-kelas/dossier` | `auth, role:wali-kelas` | Dossier/Portofolio lengkap data siswa binaan |
| `GET` | `/wali-kelas/presensi` | `auth, role:wali-kelas` | Rekapitulasi presensi kelas |
| `GET` | `/wali-kelas/rekap-nilai` | `auth, role:wali-kelas` | Rekapitulasi nilai rapor semester kelas |
| `GET/POST` | `/wali-kelas/pengumuman` | `auth, role:wali-kelas` | Pengumuman khusus wali kelas |

---

### E. Modul Siswa (`/siswa/*`)
Siswa mengakses jadwal pelajaran, rapor, presensi pribadi, materi/tugas, profil, dan pengumuman sekolah.

| Method | Endpoint | Middleware | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/siswa` | `auth, role:siswa` | Dashboard ringkasan akademik siswa |
| `GET` | `/siswa/schedule` | `auth, role:siswa` | Jadwal pelajaran pribadi |
| `GET` | `/siswa/rapor` | `auth, role:siswa` | Unduh/Lihat nilai rapor & transkrip |
| `GET` | `/siswa/profil` | `auth, role:siswa` | Informasi profil siswa |
| `GET` | `/siswa/presensi` | `auth, role:siswa` | Riwayat kehadiran siswa |
| `GET` | `/siswa/pengumuman` | `auth, role:siswa` | Daftar pengumuman sekolah/kelas |

---

## 3. Kebutuhan Basis Data (Database Schema)

Berikut adalah ringkasan entitas utama yang perlu dibuat via Migration Laravel:

1. **`users`**: `id`, `name`, `email`, `password`, `role` (enum/string: admin, guru, wali-kelas, siswa, orangtua), `timestamps`.
2. **`academic_years`**: `id`, `name` (e.g. 2025/2026), `semester` (Ganjil/Genap), `is_active`.
3. **`classes`**: `id`, `name` (e.g. X IPA 1), `grade_level`, `wali_kelas_id` (FK to users).
4. **`subjects`**: `id`, `code`, `name`.
5. **`schedules`**: `id`, `class_id`, `subject_id`, `teacher_id`, `day`, `start_time`, `end_time`.
6. **`attendances`**: `id`, `student_id`, `schedule_id`, `date`, `status` (Hadir, Izin, Sakit, Alpa).
7. **`grades`**: `id`, `student_id`, `subject_id`, `teacher_id`, `type` (Tugas, UTS, UAS), `score`.
8. **`announcements`**: `id`, `user_id`, `title`, `content`, `target_role`.
9. **`bimbingans`**: `id`, `student_id`, `teacher_id`, `note`, `date`.

---

## 4. Keamanan & Validasi
- **Autorisasi**: Menggunakan Spatie Permission / Laravel Middleware (`role:admin`, `role:guru`, dll) untuk mencegah *Unauthorized Access*.
- **Validasi Input**: Setiap Form Request wajib menggunakan Laravel `FormRequest` class untuk sanitasi dan validasi input.
- **CSRF & Rate Limiting**: Diaktifkan secara bawaan dari Laravel untuk mencegah serangan CSRF dan Brute-force pada endpoint login.
