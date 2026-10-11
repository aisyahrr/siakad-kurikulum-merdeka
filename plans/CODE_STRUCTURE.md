# Struktur Kode SIAKAD-App

Dokumen ini mendeskripsikan struktur source code yang ada dan target workspace yang ditetapkan PRD. Dokumentasi route tidak berarti folder source code baru harus dibuat tanpa implementasi.

```text
SIAKAD-App/
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ Components/
│  │  ├─ layout/
│  │  ├─ navigation/
│  │  ├─ siswa/
│  │  └─ ui/
│  ├─ Pages/
│  │  ├─ DashboardPage.tsx
│  │  ├─ auth/LoginPage.tsx
│  │  ├─ admin/index.ts
│  │  ├─ guru/index.ts
│  │  ├─ wali-kelas/index.ts
│  │  └─ siswa/
│  │     ├─ StudentDashboardFeature.tsx
│  │     ├─ ScheduleFeature.tsx
│  │     ├─ MateriFeature.tsx
│  │     ├─ NilaiFeature.tsx
│  │     ├─ PresensiFeature.tsx
│  │     ├─ PengumumanFeature.tsx
│  │     ├─ RaporFeature.tsx
│  │     └─ ProfilFeature.tsx
│  ├─ Hooks/siswa/
│  ├─ Routes/
│  ├─ Services/
│  ├─ Types/siswa/
│  ├─ data/siswa/
│  ├─ constants/
│  ├─ layouts/
│  └─ providers/
├─ plans/
├─ PRD_SIAKAD.md
└─ package.json
```

## Aktor dan permission

- **Guru** adalah role utama dan mengelola proses pembelajaran serta mata pelajaran yang diampu.
- **Wali Kelas** merupakan assignment tambahan Guru. Portal Wali Kelas tidak harus direpresentasikan sebagai role database yang sepenuhnya terpisah.
- Permission Wali Kelas harus dibatasi berdasarkan kelas bimbingan yang diberikan Admin.
- **Orang Tua** menggunakan workspace `/orang-tua` ketika diimplementasikan, hanya dapat mengakses data anak yang memiliki relasi dengan akun tersebut, dan selalu read-only.

## Alur Aplikasi

```text
main.tsx
  -> App.tsx
    -> BrowserRouter
    -> QueryProvider
    -> AuthProvider
    -> AppRoutes
```

## Workspace dan route

- `/login` → `LoginPage`
- `/admin/*` → workspace Admin; struktur dasar tersedia melalui `Pages/admin` dan layout terkait.
- `/guru/*` → workspace Guru; fokus pembelajaran mapel yang diampu.
- `/wali-kelas/*` → workspace assignment Wali Kelas; akses dibatasi kelas bimbingan.
- `/siswa/*` → workspace Siswa dengan fitur dashboard, jadwal, materi, nilai, presensi, pengumuman, rapor, dan profil.
- `/orang-tua/*` → workspace Portal Orang Tua yang ditetapkan PRD; implementasi source code lengkap belum tersedia.

Route workspace tidak boleh dijadikan alasan untuk membuat folder source code baru tanpa requirement dan implementasi yang sesuai.

## Sumber Data

- Akun role demo: `src/constants/index.ts`
- Data siswa, jadwal, nilai, presensi, pengumuman: `src/constants/dummy/student.ts` dan `src/data/siswa/`
- Type domain siswa: `src/Types/siswa/`
- API wrapper: `src/Services/api.ts`
- URL API: `VITE_API_URL`, fallback `/api`

## Integrasi yang perlu dijaga

- Relasi Orang Tua–anak wajib digunakan sebagai batas data server-side, bukan hanya filter UI.
- Wali Kelas dapat melihat seluruh siswa kelas bimbingan, sedangkan Guru hanya melihat mapel/rombel yang ditugaskan.
- Portal Orang Tua tidak boleh memiliki mutation untuk nilai, presensi, materi, atau data akademik.

## Masalah yang Diketahui

- Ada referensi path dengan perbedaan kapitalisasi, contohnya `src/Types` dan import `src/types`, atau `src/Components` dan import `src/components`.
- `npm run build` dapat gagal dengan TS1261 karena perbedaan kapitalisasi path.
- `npm run lint` masih memiliki beberapa error existing.
- Beberapa menu role belum memiliki route halaman terpisah.
- Sebagian UI masih menggunakan nilai statis atau data dummy.
