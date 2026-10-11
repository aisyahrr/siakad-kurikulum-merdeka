# Audit Guru & Siswa

Tanggal audit: 2026-10-09

## Ruang Lingkup dan Metode

Audit dilakukan pada implementasi frontend React/TypeScript di `src/`, routing, layout, navigation, hooks, services, types, dummy data, serta dokumen PRD yang tersedia.

Dokumen yang diminta tetapi tidak ditemukan:

- `SIAKAD_FRONTEND_GUIDELINES.md`
- `PRD.md`
- `referensiUI/`

Dokumen acuan yang tersedia dan digunakan adalah `PRD_SIAKAD.md`. `README.md` masih berupa README template Vite dan tidak menjelaskan alur aplikasi secara khusus.

Pemeriksaan yang dijalankan:

- `npm run lint`: tidak ada error, satu warning existing di `src/layouts/AuthLayout.tsx:36` tentang directive ESLint yang tidak terpakai.
- `npm run build`: berhasil; TypeScript check dan Vite build berhasil.
- Build menampilkan warning Vite terkait penggunaan `__dirname` di `vite.config.ts:10`; warning ini tidak menghalangi build.

## A. Ringkasan Eksekutif

Sistem Guru dan Siswa sudah memiliki kerangka UI, routing dasar, halaman akademik utama, filtering pada beberapa halaman, dan dummy data yang cukup untuk demonstrasi visual. Namun sistem belum cukup untuk menjalankan alur inti PRD secara operasional.

Kekurangan terbesar ada pada integrasi data dan persistensi. Halaman Guru memakai data lokal statis dan modal submit hanya menutup modal tanpa menyimpan data. Halaman Siswa sebagian besar membaca dummy data terpisah, sehingga relasi Guru → mapel/rombel → materi/nilai/absensi → Siswa belum dapat diverifikasi sebagai satu sumber data.

Siswa memiliki cakupan halaman lebih lengkap daripada Guru, tetapi banyak tombol hanya visual atau belum mempunyai aksi. Guru belum memiliki halaman/rute khusus untuk jadwal mengajar, absensi, input nilai, koreksi essay, dan analitik mapel, padahal modul tersebut tercantum dalam PRD.

Kesimpulan status: **belum cukup untuk menjalankan alur inti**, tetapi fondasi frontend untuk prototipe sudah tersedia.

## B. Hasil Audit Guru

| Halaman/Fitur | Status | Temuan | Rekomendasi | Prioritas |
|---|---|---|---|---|
| Dashboard Guru | Sebagian tersedia | `src/Pages/guru/DashboardPage.tsx:6` menampilkan statistik dan aktivitas dummy. Angka tidak berasal dari service atau data yang dipakai halaman lain. Shortcut dashboard tidak terlihat menuju detail fitur. | Hubungkan statistik dengan sumber data mapel, pertemuan, kuis, dan kelas yang sama. Tambahkan shortcut yang benar-benar menuju route Guru. | P1 — PRD GRU-01 s.d. GRU-10 membutuhkan konteks data yang nyata |
| Mata Pelajaran & Rombel | UI tersedia, aturan akses belum tepat | `src/Pages/guru/MataPelajaranPage.tsx:6` menyediakan modal "Tambah Mata Pelajaran". Submit hanya `preventDefault` lalu menutup modal; tidak ada persistensi. Berdasarkan PRD ADM-02 dan ADM-03, master mapel dan assignment guru dikelola Admin, sehingga Guru seharusnya terutama melihat penugasan yang sudah diberikan. | Ubah alur utama menjadi read-only untuk assignment Admin. Jika diperlukan, sediakan permintaan penugasan, bukan membuat master/assignment langsung. Tambahkan ID relasi mapel, rombel, dan guru. | P0 — hak akses dan integritas data; PRD ADM-02/ADM-03 |
| Pertemuan & Materi | Modal tersedia, belum berfungsi | `src/Pages/guru/PertemuanPage.tsx:7` memiliki form judul, tanggal, rangkuman, dan PDF sesuai GRU-01, GRU-02, GRU-03. Submit tidak menyimpan data. Tombol "Kelola" membuka modal pembuatan yang sama, bukan edit/detail pertemuan tertentu. | Pisahkan create/edit/detail. Simpan pertemuan berdasarkan `subjectId`, `rombelId`, dan `teacherId`; validasi file PDF dan ukuran file; tampilkan status draft/terbit. | P0 — alur materi inti PRD belum berjalan |
| Kuis & Ujian | Form dasar tersedia, engine belum ada | `src/Pages/guru/KuisPage.tsx:7` hanya mengisi metadata jumlah PG/essay. Belum ada pembuatan butir soal, bobot, kunci, pembahasan, publish, timer, atau koreksi essay yang diwajibkan GRU-04 s.d. GRU-08. Tombol "Buka" membuka form create generik. | Buat wizard: metadata → soal PG → soal essay → preview/publish. Tambahkan validasi bobot, kunci, deadline, status draft/published, dan halaman koreksi essay. | P0 — requirement kuis utama belum terpenuhi |
| Matriks Siswa | Tampilan dummy tersedia | `src/Pages/guru/KuisPage.tsx:8` memakai array nama dan nilai lokal. Tidak ada filter mapel/rombel, detail siswa, atau hubungan ke materi/kuis aktual. | Ambil data berdasarkan assignment Guru dan tampilkan progress modul, nilai kuis, serta status dari submission siswa. | P1 — PRD GRU-09 |
| Analitik Mapel | Belum tersedia | Tidak ada route atau halaman khusus analitik. Statistik dashboard bukan analitik yang dapat difilter dan tidak menyediakan rata-rata, rasio kelulusan KKTP, atau sebaran nilai seperti GRU-10. | Tambahkan halaman analitik per mapel/rombel setelah data nilai dan submission stabil. | P1 — PRD GRU-10 |
| Jadwal Mengajar | Belum tersedia untuk Guru | Navigation Guru di `src/constants/roleNavigation.ts:21` tidak memiliki menu jadwal. Tidak ada route Guru untuk jadwal mengajar. | Tambahkan halaman jadwal yang hanya mengambil jadwal dari assignment Guru, dengan hari, jam, ruang, mapel, dan rombel. | P1 — kebutuhan operasional dan pemeriksaan relasi jadwal |
| Absensi Guru | Belum tersedia | Tidak ada route atau halaman untuk daftar siswa dan pencatatan H/S/I/A. | Tambahkan alur presensi per pertemuan/rombel dan validasi bahwa Guru hanya dapat mengubah kelas yang ditugaskan. | P0 — alur akademik inti dan sinkron dengan presensi Siswa |
| Input Nilai Guru | Belum tersedia | Tidak ada route untuk input atau edit nilai. Siswa hanya membaca dummy grades. | Tambahkan pemilihan mapel/rombel, daftar siswa, komponen nilai, validasi rentang, draft/publish, dan audit pengubah. | P0 — PRD menyebut nilai sebagai tanggung jawab Guru |
| Pengumuman Guru | Menu ada, route tidak ada | Navigation memiliki `/guru/pengumuman` di `src/constants/roleNavigation.ts:27`, tetapi `src/Routes/index.tsx:37-45` tidak mendaftarkan route tersebut. Akibatnya route jatuh ke wildcard dan redirect ke login. | Hapus menu sementara atau buat route/halaman yang sesuai. Jika Guru boleh membuat pengumuman, batasi scope ke mapel/rombel yang diampu. | P0 — navigasi rusak |
| Profil Guru | Belum ada menu khusus | Layout menampilkan identitas user, tetapi tidak ada halaman profil Guru pada navigation Guru. | Tambahkan hanya bila diperlukan untuk data akun; pisahkan pengaturan akun dari data akademik. | P2 |

## C. Hasil Audit Siswa

| Halaman/Fitur | Status | Temuan | Rekomendasi | Prioritas |
|---|---|---|---|---|
| Dashboard Siswa | UI lengkap, data terfragmentasi | `src/Pages/siswa/StudentDashboardFeature.tsx:23-108` mendefinisikan student, attendance, schedule, dan announcements sendiri. Hook `useStudentDashboard` di `src/Hooks/siswa/useStudentDashboard.ts:1-4` memakai sumber dummy lain. Dashboard tidak menggunakan hook tersebut. | Gunakan satu sumber data siswa aktif dan relasi semester/rombel. Hilangkan duplikasi data dashboard dan data halaman detail. | P0 — statistik dan detail dapat berbeda |
| Jadwal Pelajaran | Halaman tersedia, konsistensi sebagian | `src/Pages/siswa/ScheduleFeature.tsx` memakai data schedule service/hook, sedangkan dashboard memakai array lokal. `src/constants/dummy/student.ts:18-75` memiliki jadwal tambahan Jumat/Sabtu yang perlu diverifikasi terhadap rombel. | Gunakan schedule service yang sama di dashboard dan detail; setiap item memiliki `studentClassId`, `subjectId`, `teacherId`, dan periode. | P1 |
| Nilai Akademik | Halaman tersedia, read-only UI | `src/Pages/siswa/NilaiFeature.tsx:141` memiliki switch semester, tetapi tombol semester tidak mengubah state. Data nilai berasal dari dummy `src/constants/dummy/student.ts:76-131` melalui hook sederhana, tanpa relasi student/semester/subject ID. | Pastikan hanya nilai student aktif yang dikembalikan backend. Implementasikan semester switch atau tampilkan sebagai disabled. Bedakan nilai belum tersedia dari nilai nol dan status published/draft. | P0 — PRD SIS-08 dan keamanan data |
| Absensi Siswa | Halaman tersedia, sumber data statis | Data attendance di `src/constants/dummy/student.ts:132-163` mencakup Hadir dan Izin, tetapi tidak menunjukkan relasi pertemuan/mapel dan belum mencakup Sakit/Alpa pada data. Persentase dashboard 97.2% berasal dari data lain dan tidak dihitung dari lima record tersebut. | Hitung rekap dari record sumber yang sama. Sertakan H/S/I/A, tanggal, pertemuan/mapel, dan status final. | P0 — statistik saat ini tidak dapat diverifikasi |
| Materi & Kuis | Halaman paling matang secara interaksi | `src/Pages/siswa/MateriFeature.tsx:435-504` memakai `useMaterials`, filter, loading/error, dan modal detail. Service `src/Services/material.service.ts:7-12` masih mengembalikan dummy data dan mock `create/update/remove` tidak memperbarui array global. | Tambahkan relasi materi ke subject, teacher, rombel, meeting, dan semester. Pastikan progress dan kuis berasal dari pertemuan Guru yang sama. | P1 |
| Pengumuman | Filter tersedia, banyak aksi belum nyata | `src/Pages/siswa/PengumumanFeature.tsx:184-211` memiliki search/filter, tetapi tombol bookmark, baca selengkapnya, download, dan hubungi wali kelas tidak memiliki handler yang terlihat. | Tambahkan detail pengumuman, read/unread, bookmark bila diperlukan, serta validasi scope penerima. | P1 — PRD belum mewajibkan bookmark, tetapi detail/read status relevan |
| Profil | Tampilan tersedia, edit belum terverifikasi | `src/Pages/siswa/ProfilFeature.tsx` memiliki tampilan profil dan beberapa tombol visual. Belum ditemukan alur persistensi perubahan profil. | Tetapkan field yang boleh diedit; data akademik seperti NIS/NISN/rombel harus read-only. | P1 |
| Rapor Digital | Tampilan tersedia, dokumen belum nyata | `src/Pages/siswa/RaporFeature.tsx` menampilkan histori dan tombol unduh/verifikasi, tetapi aksi unduh, lihat rapor, menu, dan QR perlu diverifikasi; data tampak lokal. | Sediakan status rapor diterbitkan, endpoint PDF, dan verifikasi tanda tangan hanya jika backend mendukung. | P1 — PRD portal siswa mencakup rapor melalui nilai/hasil studi |
| Shortcut dan tombol umum | Tidak konsisten | Banyak tombol pada halaman Siswa tidak memiliki `onClick`/`Link`, misalnya tombol "Hubungi Wali Kelas", "Baca Selengkapnya", dan beberapa aksi di `Pages.tsx`, `ProfilFeature.tsx`, `PresensiFeature.tsx`, serta `RaporFeature.tsx`. | Audit tombol per halaman; setiap tombol harus menjadi aksi nyata, disabled dengan alasan, atau dihapus. | P1 |

## D. Konsistensi Relasi Data

### Yang sudah terlihat secara struktural

- Siswa memiliki data jadwal, nilai, presensi, materi, dan pengumuman pada folder `src/data/siswa/`.
- Materi sudah memiliki abstraction service/hook: `src/Services/material.service.ts` dan `src/Hooks/siswa/useMaterials.ts`.
- Routing memisahkan akses Guru dan Siswa melalui `ProtectedRoute` dan `RoleRoute` di `src/Routes/index.tsx:26-82`.
- Navigation Guru dan Siswa dipisahkan secara konfigurasi di `src/constants/roleNavigation.ts` dan `src/constants/navigation.ts`.

### Masalah yang ditemukan

- Dashboard siswa menduplikasi data dengan `src/constants/dummy/student.ts`; data dashboard tidak memakai hook `useStudentDashboard`.
- `student`, `schedule`, `grade`, dan `attendance` memakai object/array tanpa ID relasi yang cukup untuk membuktikan hubungan siswa, guru, mapel, rombel, semester, dan pertemuan.
- Nama tidak konsisten: dashboard menggunakan `Rayhan` dan `Dr. Hendra Wijaya, M.Pd`, sedangkan dummy terpusat menggunakan `Alya Putri` dan variasi nama guru dengan/ tanpa gelar/tanda titik.
- Mata pelajaran tidak konsisten: jadwal memakai `Kimia Organik`, nilai memakai `Kimia`; jadwal memakai `Fisika Lanjutan`, dashboard siswa memakai `Fisika Kuantum & Mekanika`.
- Dummy Guru di `src/Pages/guru/data.ts` memiliki mapel/rombel, tetapi tidak memiliki ID guru, ID mapel, ID rombel, atau relasi ke data Siswa.
- Data Guru dan Siswa belum berbagi service/store. Submit modal Guru hanya menutup modal; perubahan tidak muncul di halaman Guru lain atau halaman Siswa.
- Attendance summary dashboard (`68 present, 2 permission, 0 sick, 0 absent, total 70`) tidak berasal dari lima record attendance yang terlihat pada dummy data.
- Tidak dapat diverifikasi apakah siswa berada pada rombel yang benar karena relasi `rombelId` tidak tersedia.

### Relasi yang belum dapat diverifikasi

- Guru ↔ Mapel, Guru ↔ Rombel, dan Mapel ↔ Rombel hanya tersirat dari string.
- Rombel ↔ Siswa tidak memiliki relasi eksplisit.
- Mapel ↔ Jadwal hanya cocok berdasarkan nama teks.
- Siswa ↔ Nilai dan Siswa ↔ Absensi tidak menggunakan student ID.
- Guru sebagai penginput nilai/absensi belum memiliki implementasi halaman atau service.

## E. Hak Akses dan Navigasi

- Frontend sudah membungkus route dengan `ProtectedRoute` dan `RoleRoute`, sehingga pemisahan tampilan role dasar sudah ada di `src/Routes/index.tsx:26-82`.
- Ini bukan pengamanan produksi. Backend Laravel/Sanctum tetap harus memvalidasi role, ownership, assignment Guru, student relation, dan object-level permission pada setiap endpoint.
- Route Guru hanya mendaftarkan `/guru`, `/guru/mata-pelajaran`, `/guru/pertemuan`, `/guru/kuis`, dan `/guru/matriks` (`src/Routes/index.tsx:37-44`). Menu `/guru/pengumuman` tidak memiliki route.
- Navigation Wali Kelas dan Admin juga memiliki banyak subroute yang diarahkan ke satu wildcard `WorkspacePage`; ini berada di luar fokus audit utama, tetapi menunjukkan route belum merepresentasikan halaman per fitur.
- Siswa mempunyai route untuk dashboard, nilai, presensi, jadwal, materi, pengumuman, profil, dan rapor. Tidak ada route eksplisit untuk mengerjakan kuis/ujian, padahal PRD SIS-03 sampai SIS-08 mensyaratkannya; materi hanya menampilkan katalog/modal yang belum terbukti menjadi exam flow penuh.
- Guru dapat melihat mapel dummy yang dipilih dari UI, tetapi belum ada enforcement bahwa pilihan tersebut ditetapkan Admin.
- Siswa secara visual hanya menampilkan data dummy satu siswa, tetapi belum ada backend enforcement yang membatasi akses pada siswa aktif.

## F. UI/UX

### Temuan positif

- Warna navy, neumorphic card, rounded button, dan layout sidebar konsisten secara umum antara Guru dan Siswa.
- Layout mendukung sidebar mobile melalui `AuthLayout.tsx:49-74` dan tombol menu mobile.
- Halaman Materi Siswa memiliki loading/error state nyata di `MateriFeature.tsx:488-489`.
- Beberapa halaman menyediakan responsive grid dan overflow table.

### Temuan masalah

- Beberapa file feature sangat besar dan berisi markup panjang satu baris, terutama halaman Guru yang baru dipisah (`MataPelajaranPage.tsx`, `PertemuanPage.tsx`, `KuisPage.tsx`). Ini menyulitkan review dan pemeliharaan.
- Banyak tombol terlihat aktif tetapi tidak mempunyai aksi atau feedback. Ini terjadi di halaman Siswa dan sebagian tombol Guru yang hanya menutup modal.
- Tidak ada pola feedback sukses/gagal setelah submit form Guru. Form yang terlihat seperti menyimpan sebenarnya tidak melakukan persistensi.
- Modal Guru belum memiliki fokus awal, pengelolaan Escape, atau atribut dialog/accessibility yang eksplisit.
- Tidak ditemukan empty state yang konsisten untuk filter tanpa hasil pada seluruh halaman.
- `AuthLayout` memakai import `studentNavigation` dan role navigation, tetapi warning ESLint di `src/layouts/AuthLayout.tsx:36` menunjukkan directive lama yang perlu dibersihkan; ini bukan bug runtime.
- Ikon Presensi pada student navigation memakai `UserRound` di `src/constants/navigation.ts:4`, bukan ikon presensi/clipboard, sehingga affordance menu kurang tepat.
- File `src/Pages/siswa/Pages.tsx` dan feature pages tampak memiliki overlap konten/komponen; perlu verifikasi apakah `Pages.tsx` masih dipakai atau merupakan implementasi lama.

## G. Struktur Kode

### Temuan

- `App.tsx` tetap sederhana dan hanya merangkai provider/router (`src/App.tsx:6-15`), ini baik.
- Routing terpusat di `src/Routes/index.tsx`, tetapi route Guru masih hard-coded dan formatnya tidak seragam.
- Hook Siswa sederhana seperti `useGrades`, `useAttendance`, dan `useStudentDashboard` hanya mengembalikan dummy data, sedangkan `useMaterials` sudah memakai service, loading, error, dan filter. Abstraction belum konsisten.
- Service `material.service.ts` sudah menjadi arah integrasi backend yang baik, tetapi mock mutation tidak menyimpan state sehingga create/update/delete menyesatkan bila dipakai.
- Dummy data Guru berada di `src/Pages/guru/data.ts`, sedangkan dummy Siswa tersebar di `src/data/siswa/` dan `src/constants/dummy/student.ts`. Belum ada model relasional bersama.
- Type sudah digunakan pada beberapa data (`src/constants/dummy/student.ts:1-7`), tetapi data Guru belum menggunakan interface/domain type khusus.
- Tidak ditemukan penggunaan `any` pada area yang diperiksa, tetapi belum ada test otomatis untuk memverifikasi relasi dan hak akses.
- `RoleDashboardPage.tsx` dan `DashboardPage.tsx` lama sudah dihapus sebelumnya; tidak ditemukan pemakaian tersisa. `WorkspacePage.tsx` masih digunakan oleh route admin, wali kelas, dan orang tua.
- Shared Guru (`src/Pages/guru/shared.tsx`) menggabungkan header, modal, dan field class; masih wajar untuk prototipe, tetapi dapat dipisah jika modal bertambah kompleks.

### Rekomendasi struktur tanpa refactor besar

1. Pertahankan `App.tsx` sederhana.
2. Bentuk domain data bersama untuk `User`, `TeacherAssignment`, `Student`, `Subject`, `Classroom`, `Meeting`, `Material`, `Quiz`, `Grade`, dan `Attendance` dengan ID serta periode.
3. Pindahkan dummy data Guru dan Siswa ke satu mock repository/service agar alur silang dapat diuji.
4. Pertahankan hook per fitur, tetapi semua hook membaca service yang sama.
5. Pecah form kuis menjadi komponen bertahap hanya saat implementasi engine dimulai.

## H. Bug dan Error

| Lokasi | Dampak |
|---|---|
| `src/constants/roleNavigation.ts:27` dan `src/Routes/index.tsx:37-45` | Menu `/guru/pengumuman` mengarah ke route yang tidak terdaftar; pengguna akan jatuh ke wildcard `/login`. |
| `src/Pages/guru/MataPelajaranPage.tsx:6` | Submit tambah mapel tidak menyimpan data; assignment Guru dapat terlihat seolah berhasil padahal tidak. |
| `src/Pages/guru/PertemuanPage.tsx:7` | Submit pertemuan/materi tidak menyimpan data dan tombol Kelola tidak mengelola item tertentu. |
| `src/Pages/guru/KuisPage.tsx:7` | Submit kuis tidak menyimpan metadata dan belum membuat soal. |
| `src/Pages/siswa/StudentDashboardFeature.tsx:23-108` vs `src/constants/dummy/student.ts:8-189` | Dashboard dan detail memakai siswa, jadwal, guru, serta statistik yang berbeda. |
| `src/constants/dummy/student.ts:76-131` | Nama mapel `Kimia` tidak sama dengan jadwal `Kimia Organik`; format nama guru juga tidak konsisten. |
| `src/Pages/siswa/NilaiFeature.tsx:166-191` | Tombol semester Ganjil/Genap tidak mengubah data. |
| `src/Pages/siswa/PengumumanFeature.tsx:211` | Bookmark, baca selengkapnya, dan download tidak terlihat memiliki aksi. |
| `src/Services/material.service.ts:10-12` | Mutation mock mengembalikan hasil tetapi tidak memperbarui sumber `dummyMaterials`; perubahan tidak tercermin di daftar. |
| `src/layouts/AuthLayout.tsx:36` | Warning lint berupa unused eslint-disable directive; tidak berdampak runtime. |
| `vite.config.ts:10` | Warning Vite tentang `__dirname` dan config loader; build tetap berhasil. |

Tidak ditemukan error TypeScript/build pada audit ini.

## I. Daftar Fitur yang Kurang

### P0 — Kritis

1. **Persistensi dan relasi domain Guru-Siswa** — Actor Guru dan Siswa. Saat ini data terpisah dan mutation modal tidak tersimpan. Berasal dari kebutuhan integritas alur PRD dan menjadi prasyarat semua modul.
2. **Input nilai Guru** — Guru. Belum ada halaman/input nilai, padahal siswa menampilkan nilai. Berasal dari tanggung jawab Guru di PRD dan alur akademik inti.
3. **Absensi Guru dan sinkronisasi absensi Siswa** — Guru/Siswa. Guru belum dapat mencatat H/S/I/A, dan rekap siswa tidak dapat diverifikasi. Berasal dari scope akademik dan kebutuhan presensi lintas actor.
4. **Kuis/ujian penuh** — Guru/Siswa. Metadata saja belum cukup; soal PG/essay, timer, publish, submission, auto-scoring, koreksi essay, dan nilai final belum ada. Berasal langsung dari GRU-04 s.d. GRU-08 dan SIS-03 s.d. SIS-08.
5. **Perbaikan route Pengumuman Guru** — Guru. Menu saat ini menuju route yang tidak ada. Ini bug navigasi konkret.
6. **Ownership enforcement backend** — Guru/Siswa. Frontend route guard saja tidak cukup untuk keamanan data. Berasal dari AUTH-03, AUTH-06, AUTH-07 dan prinsip ownership pada PRD.

### P1 — Penting

1. **Jadwal mengajar Guru** — Guru. Diperlukan untuk operasional dan relasi jadwal; route/menu belum ada.
2. **Matriks berbasis data aktual** — Guru. Halaman ada, tetapi masih hard-coded dan tidak terhubung ke mapel/rombel/kuis.
3. **Analitik mapel** — Guru. Rata-rata, rasio KKTP, dan sebaran nilai belum tersedia; GRU-10.
4. **Konsolidasi sumber data Siswa** — Siswa. Dashboard dan detail harus membaca service yang sama agar jadwal, nilai, presensi, dan pengumuman konsisten.
5. **Detail dan status keterbacaan pengumuman** — Siswa. Search/filter ada, tetapi aksi detail/read/unread belum lengkap.
6. **Rapor dan download yang benar-benar terhubung** — Siswa. Tombol dokumen/verifikasi perlu endpoint/status nyata.
7. **Feedback form dan error/empty state konsisten** — Guru/Siswa. Dibutuhkan agar aksi tidak terlihat berhasil ketika sebenarnya hanya menutup modal.

### P2 — Opsional

1. Bookmark pengumuman Siswa, jika memang diputuskan menjadi fitur produk.
2. Profil Guru khusus, jika kebutuhan akun Guru memerlukan field selain layout identity.
3. Pagination/sorting pada tabel ketika data backend sudah besar.
4. Perbaikan accessibility modal, fokus keyboard, Escape, dan ARIA dialog.
5. Penyelarasan ikon Presensi pada navigasi Siswa.
6. Pembersihan file/komponen lama setelah pemakaian `Pages.tsx` diverifikasi.

## J. Rencana Perbaikan

1. Tetapkan model relasional dan aturan ownership: user/role, Guru, Siswa, mapel, rombel, assignment, semester, pertemuan, materi, kuis, submission, nilai, dan presensi.
2. Satukan mock repository/service agar mutation Guru dapat memperbarui data yang dibaca Siswa; gunakan ID, bukan pencocokan nama.
3. Perbaiki route dan navigation Guru, dimulai dari menghapus atau membuat route pengumuman yang benar.
4. Implementasikan pertemuan/materi yang tersimpan dan dapat dibaca Siswa.
5. Implementasikan input nilai dan presensi Guru, lalu tampilkan hasil terbitnya pada Siswa.
6. Implementasikan quiz flow bertahap: metadata, soal, publish, pengerjaan siswa, auto-scoring PG, koreksi essay, nilai final.
7. Implementasikan matriks dan analitik Guru dari data nilai/progress aktual.
8. Konsolidasikan dashboard/detail Siswa ke service yang sama dan perbaiki status semester/pengumuman/rapor.
9. Tambahkan feedback, empty/loading/error state, dan accessibility setelah alur data stabil.

## K. Kesimpulan

1. **Apakah fitur Guru sudah cukup?** Belum. UI dasar sudah ada, tetapi input nilai, absensi, jadwal mengajar, analitik, quiz engine, koreksi essay, dan persistensi belum tersedia.
2. **Apakah fitur Siswa sudah cukup?** Belum untuk alur PRD penuh. Halaman utama cukup lengkap secara visual, tetapi quiz execution, konsistensi sumber data, status nilai/presensi, dan banyak interaksi belum selesai.
3. **Apakah data Guru dan Siswa sudah konsisten?** Belum dapat dianggap konsisten. Ada data terpisah, nama mapel/guru berbeda, statistik attendance tidak cocok dengan record, dan belum ada ID/relasi lintas actor.
4. **Tiga sampai lima perbaikan paling penting:**
   - Bangun model/service relasional bersama dan ownership backend.
   - Implementasikan input nilai dan absensi Guru yang terbaca Siswa.
   - Implementasikan quiz/ujian end-to-end.
   - Simpan pertemuan/materi Guru dan tampilkan pada katalog Siswa.
   - Perbaiki route Guru yang rusak serta konsolidasi dummy data Siswa.
5. **Yang tidak perlu ditambahkan saat ini:** fitur pembayaran/SPP, PPDB, integrasi Dapodik, aplikasi mobile native, bookmark pengumuman, dan fitur tambahan lain yang tidak mendukung alur inti PRD. Jangan menambah fitur sebelum relasi data dan alur akademik utama stabil.

Implementasi rekomendasi belum dilakukan pada tahap audit ini. Menunggu persetujuan sebelum mengubah kode.
