# Roadmap Workflow Agent SIAKAD

## Prioritas 1 — Stabilkan Project

- [ ] Samakan kapitalisasi folder dan seluruh import.
- [ ] Pilih satu konvensi path dan terapkan secara konsisten.
- [ ] Perbaiki semua error `npm run lint`.
- [ ] Pastikan `npm run build` berhasil.
- [ ] Verifikasi login dan workspace `/admin`, `/guru`, `/wali-kelas`, `/siswa`, dan `/orang-tua`.

## Prioritas 2 — Rapikan Routing dan Navigasi

- [ ] Cocokkan setiap `ROLE_MENUS` dengan route nyata.
- [ ] Tambahkan halaman placeholder untuk menu yang belum tersedia.
- [ ] Pastikan route siswa konsisten antara menu dan implementasi.
- [ ] Siapkan route `/orang-tua` tanpa mengubah source code pada task dokumentasi ini.
- [ ] Tambahkan fallback route per workspace bila diperlukan.

## Prioritas 3 — Pisahkan Data dari UI

- [ ] Pertahankan tipe domain di `src/Types`.
- [ ] Pindahkan nilai dinamis ke data terstruktur.
- [ ] Gunakan hooks dan service untuk mengisolasi fetch/data dari page.
- [ ] Buat service/repository REST ketika backend mulai digunakan.
- [ ] Validasi relasi Orang Tua–anak di backend.
- [ ] Validasi assignment Wali Kelas terhadap kelas bimbingan di backend.

## Prioritas 4 — Modul Akademik Siswa

- [ ] Dashboard siswa
- [ ] Jadwal pelajaran
- [ ] Materi pembelajaran
- [ ] Nilai dan hasil studi
- [ ] Presensi
- [ ] Pengumuman
- [ ] Rapor digital
- [ ] Profil siswa

Setiap modul harus memiliki loading state, empty state, error state, dan data typed.

## Prioritas 5 — Modul Role Lain

### Admin

- [ ] Dashboard administrator
- [ ] Manajemen pengguna, guru, siswa, kelas/rombel, dan mata pelajaran
- [ ] Manajemen tahun ajaran dan semester
- [ ] Assignment Guru sebagai Wali Kelas
- [ ] Import data massal

### Guru

- [ ] Dashboard Guru
- [ ] Pertemuan dan materi
- [ ] Modul PDF
- [ ] Kuis/ujian dan bank soal
- [ ] Koreksi essay
- [ ] Matriks dan analitik mapel

### Wali Kelas

- [ ] Dashboard kelas bimbingan
- [ ] Monitoring seluruh siswa kelas bimbingan
- [ ] Nilai seluruh mata pelajaran
- [ ] Rekap presensi
- [ ] Early warning
- [ ] Catatan bimbingan/konseling
- [ ] Ranking, export, dan print
- [ ] Pintasan komunikasi Orang Tua

### Orang Tua

- [ ] Login Orang Tua
- [ ] Relasi dan pemilihan anak
- [ ] Ringkasan perkembangan akademik
- [ ] Nilai per mata pelajaran
- [ ] Riwayat kuis/evaluasi
- [ ] Rekap presensi
- [ ] Mata pelajaran dan guru
- [ ] Pengumuman akademik
- [ ] Read-only permission

Portal Orang Tua adalah bagian dari scope utama PRD dan berstatus 🟡 Dalam Pengembangan, bukan item yang baru dipertimbangkan pada roadmap masa depan.

## Prioritas 6 — Pengembangan Lanjutan

- [ ] Presensi digital QR/geolokasi
- [ ] Rapor resmi lengkap
- [ ] Push notification/email notification
- [ ] Bank soal reusable lintas kelas dan tahun ajaran
- [ ] SPP/pembayaran
- [ ] PPDB
- [ ] Analitik akademik lanjutan
- [ ] Integrasi sistem eksternal

## Workflow Setiap Task Agent

1. Baca `plans/AGENT_CONTEXT.md`, `plans/CODE_STRUCTURE.md`, dan `PRD_SIAKAD.md`.
2. Identifikasi route yang benar.
3. Cari import data dan component yang benar.
4. Baca file target dan tetangga sebelum mengedit.
5. Buat perubahan sekecil mungkin dan ikuti konvensi.
6. Jangan mengedit file yang tidak terkait.
7. Jalankan `npm run lint`.
8. Jalankan `npm run build`.
9. Jika gagal karena masalah lama, laporkan file dan error secara spesifik.
10. Periksa diff sebelum menyelesaikan task.

## Template Task Agent

```text
Tujuan:
- [jelaskan perubahan]

Workspace/route terdampak:
- [route]

File utama:
- [path]

Sumber data:
- [path atau API]

Batasan:
- Guru fokus pada mapel yang diampu.
- Wali Kelas adalah assignment Guru dan dibatasi kelas bimbingan.
- Orang Tua read-only dan dibatasi relasi anak.
- Jangan menambah dependency tanpa persetujuan.

Verifikasi:
- npm run lint
- npm run build
```
