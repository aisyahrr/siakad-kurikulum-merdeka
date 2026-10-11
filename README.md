# SIAKAD: Sistem Informasi Akademik

Platform tata kelola pembelajaran dan operasional akademik terpadu berbasis web yang mengadopsi **Kurikulum Merdeka (Fase E & Fase F)**. SIAKAD menghubungkan lima aktor sekolah (Admin, Guru, Wali Kelas, Siswa, dan Orang Tua) dalam satu sistem dengan pemisahan peran yang tegas, *Early Warning System*, dan rapor digital siap cetak.

## Fitur Utama

- **5 workspace berbasis peran** dengan Role-Based Access Control (Admin, Guru, Wali Kelas, Siswa, Orang Tua).
- **Penilaian Kurikulum Merdeka**: Formatif (40%), STS (30%), SAS (30%) dengan kalkulasi otomatis dan ketuntasan KKTP (70.0).
- **Early Warning System** untuk wali kelas: deteksi otomatis siswa berisiko.
- **Rapor digital** dengan pratinjau cetak A4/Legal, kop sekolah, dan peringkat kelas otomatis.
- **Presensi per sesi** dan pengajuan izin/sakit mandiri oleh orang tua, dengan verifikasi wali kelas.
- **Bulk import CSV** dengan validasi baris untuk data siswa, guru, dan rombel.
- **Grade Entry Freeze**: Admin dapat mengunci input nilai menjelang pencetakan rapor.
- **Catatan bimbingan & konseling** serta kontak cepat ke orang tua via WhatsApp.
- **Desain Soft Neumorphism** yang bersih dan konsisten.

## Peran Pengguna

| Peran | Fokus | Rute |
|---|---|---|
| Admin | Tata kelola sistem & master data | `/admin` |
| Guru | KBM & asesmen mata pelajaran | `/guru` |
| Wali Kelas | Pembinaan 1 rombel secara holistik | `/wali-kelas` |
| Siswa | Belajar mandiri & transparansi capaian | `/siswa` |
| Orang Tua | Pemantauan perkembangan anak | `/orang-tua` |

## Aturan Bisnis

**Nilai akhir**

```text
Nilai Akhir = (0.40 × Formatif) + (0.30 × STS) + (0.30 × SAS)
```

**Tuntas** jika Nilai Akhir ≥ 70.0. Di bawah itu masuk rekomendasi remedial.

**Early Warning System**: siswa diberi tag *Perhatian Khusus / Risiko* bila memenuhi salah satu kondisi:

1. Kehadiran semester < 75%
2. Ada nilai mata pelajaran < 70.0
3. 3 sesi Alpa berturut-turut

**Freeze Rule**: jika `isGradeEntryLocked = true`, seluruh akses ubah nilai pada modul Guru menjadi *read-only*.

## Teknologi

- React + TypeScript
- React Router (routing per peran dengan `ProtectedRoute` dan `RoleRoute`)
- Tailwind CSS

## Struktur Proyek

```text
src/
├── Components/ui/      # Komponen neumorphic atomik (Card, Button, Modal)
├── constants/          # roleNavigation.ts: navigasi per peran
├── layouts/            # Layout tiap peran
├── Pages/              # auth, admin, guru, wali-kelas, orangtua, siswa
└── Routes/             # AppRoutes, ProtectedRoute, RoleRoute
```

## Memulai

> Sesuaikan perintah di bawah dengan package manager dan tool build yang kamu pakai.

```bash
# Clone repositori
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>

# Install dependensi
npm install

# Jalankan mode development
npm run dev

# Build untuk produksi
npm run build
```

## Dokumentasi

Spesifikasi lengkap produk (modul, skema data, desain sistem, dan routing) ada di [`PRD-SIAKAD.md`](./PRD-SIAKAD.md).

## Roadmap

- [ ] Integrasi backend dan autentikasi
- [ ] Persistensi data (database)
- [ ] Ekspor rapor ke PDF
- [ ] Notifikasi WhatsApp otomatis

## Kontribusi

Kontribusi terbuka. Silakan fork repositori ini, buat branch fitur (`git checkout -b fitur/nama-fitur`), commit perubahanmu, lalu buka Pull Request.

## Lisensi

Tentukan lisensi proyek (misalnya MIT) dan tambahkan berkas `LICENSE`.
