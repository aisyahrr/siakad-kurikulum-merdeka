import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/Pages/auth/LoginPage";
import { ProtectedRoute } from "@/Routes/ProtectedRoute";
import { RoleRoute } from "@/Routes/RoleRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { GuruLayout } from "@/layouts/GuruLayout";
import { WaliKelasLayout } from "@/layouts/WaliKelasLayout";
import { SiswaLayout } from "@/layouts/SiswaLayout";
import { OrangTuaLayout } from "@/layouts/OrangTuaLayout";

import {
  StudentDashboard,
  ScheduleFeature,
  RaporFeature,
  ProfilFeature,
  PresensiFeature,
  PengumumanFeature,
  NilaiFeature,
  MateriFeature,
} from "@/Pages/siswa";

import {
  DashboardWaliPage,
  BimbinganPage,
  DossierSiswaPage,
  PresensiKelasPage,
  RekapNilaiPage,
  PengumumanWaliPage,
} from "@/Pages/wali-kelas";

import {
  DashboardPage,
  JadwalGuruPage,
  KuisPage,
  MataPelajaranPage,
  MatriksPage,
  NilaiGuruPage,
  PengumumanPage,
  PertemuanPage,
  PresensiGuruPage,
} from "@/Pages/guru";

import {
  DashboardOrangTuaPage,
  NilaiAnakPage,
  PresensiAnakPage,
  PengumumanOrangTuaPage,
} from "@/Pages/orangtua";

import {
  DashboardAdminPage,
  ManajemenPenggunaPage,
  DataAkademikPage,
  MasterDataPage,
  ImportDataPage,
  PengaturanAdminPage,
} from "@/Pages/admin";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        {/* ================= ADMIN ================= */}

        {/* ================= ADMIN ================= */}
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

        {/* ================= GURU ================= */}

        <Route element={<RoleRoute role="guru" />}>
          <Route element={<GuruLayout />}>
            <Route path="/guru" element={<DashboardPage />} />
            <Route
              path="/guru/mata-pelajaran"
              element={<MataPelajaranPage />}
            />
            <Route path="/guru/jadwal" element={<JadwalGuruPage />} />
            <Route path="/guru/nilai" element={<NilaiGuruPage />} />
            <Route path="/guru/presensi" element={<PresensiGuruPage />} />
            <Route path="/guru/pertemuan" element={<PertemuanPage />} />
            <Route path="/guru/kuis" element={<KuisPage />} />
            <Route path="/guru/matriks" element={<MatriksPage />} />
            <Route path="/guru/pengumuman" element={<PengumumanPage />} />
          </Route>
        </Route>
        {/* ================= WALI KELAS ================= */}
        <Route element={<RoleRoute role="wali-kelas" />}>
          <Route element={<WaliKelasLayout />}>
            <Route index path="/wali-kelas" element={<DashboardWaliPage />} />
            <Route path="/wali-kelas/siswa" element={<DossierSiswaPage />} />
            <Route
              path="/wali-kelas/nilai-rekap"
              element={<RekapNilaiPage />}
            />
            <Route
              path="/wali-kelas/presensi"
              element={<PresensiKelasPage />}
            />
            <Route path="/wali-kelas/bimbingan" element={<BimbinganPage />} />
            <Route
              path="/wali-kelas/pengumuman"
              element={<PengumumanWaliPage />}
            />
          </Route>
        </Route>

        {/* ================= ORANG TUA ================= */}
        <Route element={<RoleRoute role="orang-tua" />}>
          <Route element={<OrangTuaLayout />}>
            <Route
              index
              path="/orang-tua"
              element={<DashboardOrangTuaPage />}
            />
            <Route path="/orang-tua/nilai" element={<NilaiAnakPage />} />
            <Route path="/orang-tua/presensi" element={<PresensiAnakPage />} />
            <Route
              path="/orang-tua/pengumuman"
              element={<PengumumanOrangTuaPage />}
            />
          </Route>
        </Route>

        {/* ================= SISWA ================= */}

        <Route element={<RoleRoute role="siswa" />}>
          <Route element={<SiswaLayout />}>
            <Route path="/siswa" element={<StudentDashboard />} />

            <Route path="/siswa/nilai" element={<NilaiFeature />} />

            <Route path="/siswa/presensi" element={<PresensiFeature />} />

            <Route path="/siswa/jadwal" element={<ScheduleFeature />} />

            <Route path="/siswa/materi" element={<MateriFeature />} />

            <Route path="/siswa/pengumuman" element={<PengumumanFeature />} />

            <Route path="/siswa/profil" element={<ProfilFeature />} />

            <Route path="/siswa/rapor" element={<RaporFeature />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
