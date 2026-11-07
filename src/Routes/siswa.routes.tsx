import type { RouteObject } from "react-router-dom";

import { SiswaLayout } from "@/layouts/SiswaLayout";
import {
  StudentDashboard,
  NilaiFeature,
  PresensiFeature,
  ScheduleFeature,
  MateriFeature,
  PengumumanFeature,
  ProfilFeature,
  RaporFeature,
} from "@/Pages/siswa";

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
