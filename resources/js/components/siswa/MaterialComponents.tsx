import { useEffect } from "react";
import {
  BookOpen,
  BookOpenCheck,
  CheckSquare,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";
import { Card } from "@/Components/ui/Card";
import type { Material, MaterialFilters as MaterialFilterState } from "@/Types/siswa/material.types";

export type MaterialItem = Material;

const inset =
  "rounded-2xl bg-[#e9eef3] shadow-[inset_3px_3px_8px_#cbd3db,inset_-3px_-3px_8px_#fff]";
const button =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#17345b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102743]";

export function MaterialFilters({
  activeType,
  semester,
  subject,
  onTypeChange,
  onSemesterChange,
  onSubjectChange,
}: {
  activeType: MaterialFilterState["type"];
  semester: MaterialFilterState["semester"];
  subject: MaterialFilterState["subject"];
  onTypeChange: (value: MaterialFilterState["type"]) => void;
  onSemesterChange: (value: MaterialFilterState["semester"]) => void;
  onSubjectChange: (value: MaterialFilterState["subject"]) => void;
}) {
  const types: MaterialFilterState["type"][] = ["Semua Materi", "Modul", "Kuis", "Video", "Dokumen"];
  return (
    <div className="flex flex-wrap gap-3">
      {types.map((type) => (
        <button
          className={activeType === type ? button : `${inset} flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-bold text-[#37454a]`}
          key={type}
          onClick={() => onTypeChange(type)}
          type="button"
        >
          {type === "Semua Materi" ? <BookOpenCheck size={15} /> : <FileText size={15} />}
          {type}
        </button>
      ))}
      <select className={`${inset} ml-auto cursor-pointer px-5 py-3 text-sm font-bold text-[#37454a] outline-none`} value={semester} onChange={(event) => onSemesterChange(event.target.value as MaterialFilterState["semester"])}>
        <option>Semester Ganjil</option>
        <option>Semester Genap</option>
      </select>
      <select className={`${inset} cursor-pointer px-5 py-3 text-sm font-bold text-[#37454a] outline-none`} value={subject} onChange={(event) => onSubjectChange(event.target.value as MaterialFilterState["subject"])}>
        <option>Semua Mata Pelajaran</option>
        <option>MIPA / Peminatan</option>
        <option>Bahasa</option>
        <option>Sosial</option>
      </select>
    </div>
  );
}

export function MaterialCard({ item, onOpen }: { item: MaterialItem; onOpen: (item: MaterialItem, mode: "detail" | "menu") => void }) {
  const { Icon } = item;
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dceafa] text-[#1762bf]"><Icon size={21} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-2"><h3 className="truncate font-bold">{item.subject}</h3><button aria-label={`Menu ${item.subject}`} className="text-xl leading-none" onClick={() => onOpen(item, "menu")} type="button">⋮</button></div>
          <p className="truncate text-xs text-[#526167]">{item.teacher}</p>
        </div>
      </div>
      <div className="mt-5 h-1.5 rounded-full bg-[#d7e0e5]"><div className="h-full w-[78%] rounded-full bg-[#416dc0]" /></div>
      <div className="mt-3 flex justify-between text-xs font-bold text-[#37454a]"><span><BookOpen size={13} className="mr-1 inline" />{item.modules}</span><span><CheckSquare size={13} className="mr-1 inline" />{item.quizzes}</span><span>{item.progress}</span></div>
      <button className={`${button} mt-3 w-full py-2.5 text-xs`} onClick={() => onOpen(item, "detail")} type="button">Lihat Materi <ChevronRight size={15} /></button>
    </Card>
  );
}

export function MaterialModal({ item, mode, onClose }: { item: MaterialItem | null; mode: "detail" | "menu" | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);
  if (!item || !mode) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#17345b]/35 p-4" onClick={onClose}>
    <div className="w-full max-w-lg rounded-[27px] bg-[#edf2f4] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#dceafa] text-[#1762bf]"><item.Icon size={22} /></span><div><p className="text-xs font-bold uppercase tracking-wider text-[#68777c]">{mode === "detail" ? "Detail Materi" : "Menu Materi"}</p><h2 className="text-xl font-bold">{item.subject}</h2></div></div><button aria-label="Tutup modal" onClick={onClose} type="button"><X /></button></div>
      {mode === "detail" ? <><p className="mt-5 text-sm leading-relaxed text-[#526167]">Materi pembelajaran dari {item.teacher}. Tersedia {item.modules.toLowerCase()} dan {item.quizzes.toLowerCase()} untuk semester aktif.</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#e1e8ed] p-4"><b className="block text-lg">{item.modules}</b><span className="text-xs text-[#68777c]">Materi tersedia</span></div><div className="rounded-2xl bg-[#e1e8ed] p-4"><b className="block text-lg">{item.quizzes}</b><span className="text-xs text-[#68777c]">Evaluasi</span></div></div><button className={`${button} mt-5 w-full`} onClick={onClose} type="button">Mulai Belajar <ChevronRight size={16} /></button></> : <div className="mt-5 grid gap-3"><button className={`${inset} flex items-center gap-3 p-4 text-left font-bold`} onClick={() => onClose()} type="button"><BookOpen size={18} /> Buka modul pembelajaran</button><button className={`${inset} flex items-center gap-3 p-4 text-left font-bold`} onClick={() => onClose()} type="button"><CheckSquare size={18} /> Kerjakan kuis</button><button className={`${inset} flex items-center gap-3 p-4 text-left font-bold`} onClick={() => onClose()} type="button"><FileText size={18} /> Unduh dokumen</button></div>}
    </div>
  </div>;
}
