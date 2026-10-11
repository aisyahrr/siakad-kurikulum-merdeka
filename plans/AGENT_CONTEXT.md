# SIAKAD Agent Context

## Tujuan

SIAKAD-App adalah portal akademik berbasis React dan TypeScript untuk lima aktor: Admin, Guru, Wali Kelas, Siswa, dan Orang Tua. Dokumen ini menjadi konteks utama agent saat mengubah, memperbaiki, atau menambah fitur.

## Aktor dan aturan akses

- **Admin** mengelola data master, pengguna, guru, siswa, kelas/rombel, mata pelajaran, tahun ajaran, semester, assignment Wali Kelas, dan import massal.
- **Guru** adalah role utama yang fokus pada mata pelajaran yang diampu, pertemuan, materi, modul, kuis, ujian, koreksi essay, nilai, dan analitik mapel.
- **Wali Kelas bukan role utama yang sepenuhnya terpisah.** Wali Kelas merupakan Guru yang mendapatkan assignment/tugas tambahan untuk membimbing satu kelas. Seorang Guru dapat sekaligus menjadi Wali Kelas.
- **Wali Kelas** memonitor seluruh siswa pada kelas bimbingan: nilai seluruh mapel, presensi, early warning, bimbingan, rekap, ranking, export, print, dan komunikasi Orang Tua.
- **Siswa** mengakses materi, modul, kuis, ujian, nilai, pembahasan, presensi, jadwal, pengumuman, dan profil akademik.
- **Orang Tua** memiliki akses read-only pada data anak yang terhubung. Orang Tua tidak dapat mengubah nilai, presensi, materi, atau data akademik.

Workspace yang didokumentasikan: `/admin`, `/guru`, `/wali-kelas`, `/siswa`, `/orang-tua`.

## Stack

- React 19
- TypeScript 6
- Vite 8
- React Router DOM 7
- Tailwind CSS 4 melalui `@tailwindcss/vite`
- TanStack React Query tersedia di dependency dan provider
- Lucide React untuk icon
- Alias import: `@/*` mengarah ke `src/*`
- PRD menetapkan target integrasi Laravel + Sanctum, Filament v3, dan Nuxt; source code saat ini adalah frontend React/Vite yang masih berkembang.

## Perintah

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Aturan Agent

1. Baca file terkait dan komponen tetangga sebelum mengubah kode.
2. Ikuti pola React function component dan TypeScript yang sudah digunakan.
3. Jangan menambah library baru sebelum memeriksa dependency yang tersedia.
4. Jangan menyimpan secret, password produksi, atau token ke repository.
5. Jangan menambah komentar kode kecuali diminta.
6. Setelah perubahan, jalankan `npm run lint` dan `npm run build`.
7. Periksa route aktif sebelum mengubah halaman.
8. Data siswa dan modul yang belum terhubung backend masih dapat menggunakan data dummy typed.
9. Perhatikan konsistensi kapitalisasi path. Repository memiliki folder `Services`, `Types`, `Pages`, `Components`, tetapi sebagian import menggunakan lowercase; TypeScript dapat melaporkan TS1261.
10. Jangan mengubah file di `node_modules`.
11. Jangan memberi akses Wali Kelas ke luar kelas bimbingan yang di-assignment Admin.
12. Jangan memberi akses tulis kepada Orang Tua.

## Prinsip Perubahan

- Perubahan UI siswa: mulai dari route aktif, lalu ikuti component yang dirender route tersebut.
- Perubahan data dummy: gunakan folder `src/data` atau struktur data typed yang sudah digunakan fitur terkait.
- Perubahan autentikasi: cek `src/Services/auth.service.ts` dan `src/providers/AuthProvider.tsx`.
- Perubahan navigasi: cek constants, layout role, dan route.
- Perubahan API: gunakan `src/Services/api.ts`; jangan mencampur fetch langsung tanpa alasan.
- Fitur Wali Kelas harus memeriksa assignment kelas, bukan menganggapnya sebagai role database yang sepenuhnya berbeda dari Guru.
- Fitur Orang Tua harus memeriksa relasi akun dengan anak dan hanya menampilkan data read-only.
