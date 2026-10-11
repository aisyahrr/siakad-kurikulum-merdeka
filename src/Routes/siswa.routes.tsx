import type { RouteObject } from "react-router-dom";

import { SiswaLayout } from "@/layouts/SiswaLayout";
import { StudentDashboard } from "@/Pages/siswa/Dashboard";
import { NilaiFeature } from "@/Pages/siswa/Nilai";
import { PresensiFeature } from "@/Pages/siswa/Presensi";
import { SchedulePage as ScheduleFeature } from "@/Pages/siswa/ScheduleFeature";
import { MateriFeature } from "@/Pages/siswa/Materi";
import { PengumumanFeature } from "@/Pages/siswa/Pengumuman";
import { ProfilFeature } from "@/Pages/siswa/Profil";
import { RaporFeature } from "@/Pages/siswa/Rapor";

export const siswaRoutes: RouteObject[] = [
  {
    element: <SiswaLayout />,
    children: [
      {
        path: "/siswa",
        element: <StudentDashboard />,
      },
      {
        path: "/siswa/nilai",
        element: <NilaiFeature />,
      },
      {
        path: "/siswa/presensi",
        element: <PresensiFeature />,
      },
      {
        path: "/siswa/jadwal",
        element: <ScheduleFeature />,
      },
      {
        path: "/siswa/materi",
        element: <MateriFeature />,
      },
      {
        path: "/siswa/pengumuman",
        element: <PengumumanFeature />,
      },
      {
        path: "/siswa/profil",
        element: <ProfilFeature />,
      },
      {
        path: "/siswa/rapor",
        element: <RaporFeature />,
      },
    ],
  },
];
