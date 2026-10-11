import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserPlus,
  Upload,
  Settings,
  Server,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function DashboardAdminPage() {
  const systemMetrics = {
    totalStudents: 1080,
    totalTeachers: 64,
    totalClasses: 30,
    systemUptime: "99.98%",
  };

  const auditLogs = [
    {
      id: "log-1",
      user: "Drs. Hendra Setiawan",
      role: "Wali Kelas",
      action: "Finalisasi cetak rapor kelas XII MIPA 1",
      timestamp: "10 menit lalu",
      ip: "192.168.1.45",
    },
    {
      id: "log-2",
      user: "Admin Pusat",
      role: "Administrator",
      action: "Bulk import 36 data siswa baru angkatan 2024",
      timestamp: "1 jam lalu",
      ip: "192.168.1.10",
    },
    {
      id: "log-3",
      user: "Budi Santoso, M.Pd",
      role: "Guru",
      action: "Input nilai sumatif SAS Matematika Peminatan",
      timestamp: "3 jam lalu",
      ip: "192.168.1.72",
    },
    {
      id: "log-4",
      user: "Siti Rahma, M.Pd",
      role: "Guru",
      action: "Penerbitan modul materi pertemuan P06",
      timestamp: "5 jam lalu",
      ip: "192.168.1.33",
    },
  ];

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Tahun Ajaran Aktif 2024/2025 • Semester Ganjil
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Pusat Kendali Administrator
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Pantau ketersediaan sistem, audit operasional akun, dan kelola seluruh master data akademik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/pengguna"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743]"
          >
            <UserPlus size={14} />
            Tambah Pengguna
          </Link>
          <Link
            to="/admin/import"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] transition hover:text-[#102743]"
          >
            <Upload size={14} />
            Bulk Import
          </Link>
        </div>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Siswa Terdaftar",
            value: systemMetrics.totalStudents.toLocaleString(),
            sub: "30 Rombel Aktif",
            icon: Users,
            colorText: "text-[#17345b]",
          },
          {
            label: "Tenaga Pendidik (Guru)",
            value: systemMetrics.totalTeachers,
            sub: "Semua Mapel Terakreditasi",
            icon: GraduationCap,
            colorText: "text-[#087b79]",
          },
          {
            label: "Rombongan Belajar",
            value: systemMetrics.totalClasses,
            sub: "Fase E & Fase F (Kurikulum Merdeka)",
            icon: BookOpen,
            colorText: "text-[#17345b]",
          },
          {
            label: "Ketersediaan Server",
            value: systemMetrics.systemUptime,
            sub: "SIAKAD Engine Berjalan Normal",
            icon: Server,
            colorText: "text-[#087b79]",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3.5 rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <span className="block text-[11px] font-semibold text-[#68777c]">
                  {item.label}
                </span>
                <strong className={`block text-2xl font-black ${item.colorText}`}>
                  {item.value}
                </strong>
                <span className="text-[10px] text-[#78888e]">{item.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DUA KOLOM: SHORTCUT NAVIGASI & AUDIT LOGS */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] items-start">
        {/* KOLOM KIRI: SHORTCUT MENU ADMIN */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-[#17345b]">Aksi Cepat Administrator</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Manajemen Akun",
                desc: "Kelola credential dan akses multi-aktor",
                to: "/admin/pengguna",
                icon: Users,
              },
              {
                title: "Master Kurikulum",
                desc: "Konfigurasi mapel, jam, dan rombel",
                to: "/admin/master-data",
                icon: BookOpen,
              },
              {
                title: "Import Database",
                desc: "Integrasi berkas batch CSV/Excel",
                to: "/admin/import",
                icon: Upload,
              },
              {
                title: "Aturan Semester",
                desc: "Kunci nilai rapor & tahun ajaran",
                to: "/admin/pengaturan",
                icon: Settings,
              },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link
                  key={shortcut.title}
                  to={shortcut.to}
                  className="flex flex-col justify-between rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                      <Icon size={17} />
                    </span>
                    <ArrowRight size={14} className="text-[#68777c]" />
                  </div>
                  <div className="mt-3">
                    <strong className="block text-xs font-bold text-[#20272d]">
                      {shortcut.title}
                    </strong>
                    <span className="text-[10px] text-[#68777c]">{shortcut.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* KOLOM KANAN: SYSTEM AUDIT LOGS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#17345b]">
              Log Audit & Aktivitas Sistem Terbaru
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087b79]">
              <Sparkles size={12} /> Realtime
            </span>
          </div>

          <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff]">
            <div className="divide-y divide-[#dce4ea]">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-[#20272d]">{log.user}</strong>
                      <span className="rounded-full bg-[#dbe8f5] px-2 py-0.2 text-[9px] font-extrabold uppercase text-[#17345b]">
                        {log.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#718086]">{log.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#526066] leading-relaxed">{log.action}</p>
                  <span className="text-[10px] text-[#8fa0a6]">IP Client: {log.ip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}