# Laporan Migrasi React Router SIAKAD ke Laravel Inertia.js

Dokumen ini mencatat detail migrasi routing React Router lama ke Laravel + React + TypeScript + Inertia.js untuk sistem SIAKAD.

## 1. Audit Rute Lama (`resources/js/routes/index.tsx`)
Seluruh rute lama yang menggunakan React Router (`<Routes>`, `<Route>`, `<ProtectedRoute>`, `<RoleRoute>`) telah dipetakan ke rute web Laravel di `routes/web.php`.

### Daftar Actor & Rute yang Dimigrasikan:
- **Admin (`/admin/*`)**:
  - `/admin` -> `admin/DashboardAdminPage` (middleware `role:admin`)
  - `/admin/pengguna` -> `admin/ManajemenPenggunaPage`
  - `/admin/data-akademik` -> `admin/DataAkademikPage`
  - `/admin/master-data` -> `admin/MasterDataPage`
  - `/admin/import` -> `admin/ImportDataPage`
  - `/admin/pengaturan` -> `admin/PengaturanAdminPage`
- **Guru (`/guru/*`)**:
  - `/guru` -> `guru/DashboardPage` (middleware `role:guru`)
  - `/guru/mata-pelajaran` -> `guru/MataPelajaranPage`
  - `/guru/jadwal` -> `guru/JadwalGuruPage`
  - `/guru/nilai` -> `guru/NilaiGuruPage`
  - `/guru/presensi` -> `guru/PresensiGuruPage`
  - `/guru/pertemuan` -> `guru/PertemuanPage`
  - `/guru/kuis` -> `guru/KuisPage`
  - `/guru/pengumuman` -> `guru/PengumumanPage`
- **Wali Kelas (`/wali-kelas/*`)**:
  - `/wali-kelas` -> `wali-kelas/DashboardWaliPage` (middleware `role:wali-kelas`)
  - `/wali-kelas/bimbingan` -> `wali-kelas/BimbinganPage`
  - `/wali-kelas/dossier` -> `wali-kelas/DossierSiswaPage`
  - `/wali-kelas/presensi` -> `wali-kelas/PresensiKelasPage`
  - `/wali-kelas/rekap-nilai` -> `wali-kelas/RekapNilaiPage`
  - `/wali-kelas/pengumuman` -> `wali-kelas/PengumumanWaliPage`
- **Siswa (`/siswa/*`)**:
  - `/siswa` -> `siswa/index` (middleware `role:siswa`)
  - `/siswa/schedule` -> `siswa/ScheduleFeature`
  - `/siswa/rapor` -> `siswa/RaporFeature`
  - `/siswa/profil` -> `siswa/ProfilFeature`
  - `/siswa/presensi` -> `siswa/PresensiFeature`
  - `/siswa/pengumuman` -> `siswa/PengumumanFeature`
  - `/siswa/nilai` -> `siswa/NilaiFeature`
  - `/siswa/materi` -> `siswa/MateriFeature`
- **Orang Tua (`/orangtua/*`)**:
  - `/orangtua` -> `orangtua/DashboardOrangTuaPage` (middleware `role:orang-tua`)
  - `/orangtua/nilai` -> `orangtua/NilaiAnakPage`
  - `/orangtua/presensi` -> `orangtua/PresensiAnakPage`
  - `/orangtua/pengumuman` -> `orangtua/PengumumanOrangTuaPage`

## 2. Middleware Proteksi Role (`CheckRole.php`)
Fungsi `ProtectedRoute` dan `RoleRoute` pada React Router telah digantikan dengan middleware kustom Laravel `CheckRole` yang didaftarkan di `bootstrap/app.php` dengan alias `'role'`. Middleware ini memvalidasi apakah pengguna terautentikasi dan memiliki peran (`role`) yang sesuai dengan rute yang diakses.

## 3. Integrasi Navigasi & Inertia Link
Navigasi frontend menggunakan komponen `Link` dari `@inertiajs/react` sesuai dengan standar Inertia.js.

## 4. Validasi & Hasil Build
- `php artisan route:list` berhasil dijalankan dan menampilkan seluruh rute web dengan benar.
- `npm run build` berhasil dijalankan tanpa error TypeScript atau bundling.
