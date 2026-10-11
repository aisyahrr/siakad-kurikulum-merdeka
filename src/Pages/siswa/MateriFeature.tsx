import { useState } from "react";
import { BookOpen, AlertCircle } from "lucide-react";
import { useMaterials } from "@/Hooks/siswa/useMaterials";
import type { Material } from "@/Types/siswa/material.types";
import { Card } from "@/Components/ui/Card";
import { PageTitle } from "@/Components/ui/PageTitle";
import {
  MaterialCard,
  MaterialFilters,
  MaterialModal,
} from "@/Components/siswa/MaterialComponents";

export function MaterialPage() {
  const { filteredItems, filters, updateFilters, isLoading, error } = useMaterials();
  const [modal, setModal] = useState<{
    item: Material;
    mode: "detail" | "menu";
  } | null>(null);

  const stats = [
    { label: "Mata Pelajaran", value: "12", sub: "Kurikulum Merdeka" },
    { label: "Modul Tersedia", value: "48", sub: "Materi Terbit" },
    { label: "Kuis & Evaluasi", value: "28", sub: "Asesmen Formatif" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER UTAMA */}
      <PageTitle
        eyebrow="PEMBELAJARAN & ASESMEN"
        title="Materi & Kuis Digital"
        description="Akses modul ajar resmi, unduh berkas literasi, dan kerjakan evaluasi formatif mandiri."
      />

      {/* BANNER RINGKASAN NEUMORPHIC */}
      <Card>
        <div className="flex flex-col gap-5 p-1 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
              <BookOpen size={24} />
            </span>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-[#20272d]">
                Katalog Pembelajaran Terpadu
              </h2>
              <p className="mt-0.5 text-xs text-[#68777c]">
                Pelajari materi tematik per pertemuan dan kerjakan evaluasi untuk memenuhi ketuntasan KKTP.
              </p>
            </div>
          </div>

          {/* COUNTER ARRAY METRICS */}
          <div className="flex flex-wrap items-center gap-6 border-t border-[#d8e1e8] pt-4 md:border-0 md:pt-0">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-[90px]">
                <strong className="block text-xl font-black tracking-tight text-[#17345b]">
                  {stat.value}
                </strong>
                <span className="block text-[11px] font-bold text-[#20272d]">
                  {stat.label}
                </span>
                <span className="text-[10px] text-[#718086]">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* FILTER CONTROLS */}
      <MaterialFilters
        activeType={filters.type}
        semester={filters.semester}
        subject={filters.subject}
        onTypeChange={(value) => updateFilters("type", value)}
        onSemesterChange={(value) =>
          updateFilters("semester", value as typeof filters.semester)
        }
        onSubjectChange={(value) =>
          updateFilters("subject", value as typeof filters.subject)
        }
      />

      {/* LOADING & ERROR STATES */}
      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#e9eef3] p-4 text-xs font-semibold text-[#68777c] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
          <span className="h-2 w-2 animate-ping rounded-full bg-[#17345b]" />
          <span>Memuat katalog modul materi dan kuis...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#fadbd8] p-4 text-xs font-bold text-[#c0392b] shadow-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* GRID DAFTAR MATERI */}
      {!isLoading && !error && (
        <>
          {filteredItems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <MaterialCard
                  key={item.subject}
                  item={item}
                  onOpen={(selected, mode) => setModal({ item: selected, mode })}
                />
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf2f6] text-[#88989e] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                <BookOpen size={24} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#20272d]">
                Tidak ada materi atau kuis ditemukan
              </h3>
              <p className="mt-0.5 text-xs text-[#75848a]">
                Coba sesuaikan filter kategori, semester, atau pilih mata pelajaran yang lain.
              </p>
            </div>
          )}
        </>
      )}

      {/* MODAL DETAIL / AKSI */}
      <MaterialModal
        item={modal?.item ?? null}
        mode={modal?.mode ?? null}
        onClose={() => setModal(null)}
      />
    </div>
  );
}