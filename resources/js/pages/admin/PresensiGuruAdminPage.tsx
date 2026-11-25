import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { CalendarCheck2, Search } from "lucide-react";

interface TeacherAttendanceItem {
  id: number;
  date: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
  teacher?: {
    nip?: string | null;
    user?: { name?: string } | null;
  } | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PresensiGuruAdminProps {
  attendances?: {
    data: TeacherAttendanceItem[];
    links: PaginationLink[];
    total: number;
  };
  filters?: { search?: string | null; status?: string | null };
}

export default function PresensiGuruAdminPage({
  attendances,
  filters,
}: PresensiGuruAdminProps = {}) {
  const rows = attendances?.data ?? [];
  const [searchQuery, setSearchQuery] = useState(filters?.search ?? "");
  const [statusFilter, setStatusFilter] = useState(filters?.status ?? "Semua");

  const applyFilters = (search: string, status: string) => {
    router.get(
      "/admin/presensi-guru",
      {
        search: search || undefined,
        status: status === "Semua" ? undefined : status,
      },
      { preserveState: true, preserveScroll: true, replace: true },
    );
  };

  return (
    <section className="space-y-6">
      <div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
          Monitoring Kehadiran • Tenaga Pendidik
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
          Presensi Guru
        </h1>
        <p className="mt-0.5 text-xs text-[#68777c]">
          Rekap kehadiran guru yang tercatat pada sistem akademik.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Search size={16} className="text-[#68777c]" />
          <input
            type="text"
            placeholder="Cari nama guru... (Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters(searchQuery, statusFilter);
            }}
            className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["Semua", "Hadir", "Izin", "Sakit", "Alpa"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(status);
                applyFilters(searchQuery, status);
              }}
              className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                statusFilter === status
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">Nama Guru</th>
                <th className="py-3 px-3">NIP</th>
                <th className="py-3 px-2 text-center">Tanggal</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {rows.map((item) => (
                <tr key={item.id} className="transition hover:bg-white/30">
                  <td className="py-3.5 px-3">
                    <span className="flex items-center gap-2 font-bold text-[#20272d]">
                      <CalendarCheck2 size={13} className="text-[#17345b]" />
                      {item.teacher?.user?.name ?? "-"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#17345b]">
                    {item.teacher?.nip ?? "-"}
                  </td>
                  <td className="py-3.5 px-2 text-center text-[#68777c]">
                    {item.date ? new Date(item.date).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        item.status === "Hadir"
                          ? "bg-[#dcebea] text-[#087b79]"
                          : item.status === "Alpa"
                            ? "bg-[#fadbd8] text-[#c0392b]"
                            : "bg-[#fef3c7] text-[#92400e]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-[#718086]">
                    Belum ada data presensi guru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {attendances && attendances.links.length > 3 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 border-t border-[#d8e1e8] pt-4">
            {attendances.links.map((link, index) =>
              link.url ? (
                <Link
                  key={index}
                  href={link.url}
                  preserveScroll
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    link.active
                      ? "bg-[#17345b] text-white"
                      : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <span
                  key={index}
                  className="rounded-full bg-[#e9eef3] px-3 py-1 text-[11px] font-bold text-[#a6b3b9]"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
