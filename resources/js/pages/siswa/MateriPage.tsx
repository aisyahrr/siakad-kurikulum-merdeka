import { useMemo, useState } from "react";
import {
    BookOpen,
    ExternalLink,
    FileText,
    Link2,
    Search,
    Video,
    X,
} from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";

type MaterialType = "Modul" | "Dokumen" | "Video" | "Tautan";

interface MaterialItem {
    id: number;
    title: string;
    description: string | null;
    content: string | null;
    link: string | null;
    type: MaterialType;
    semester: "Ganjil" | "Genap";
    subject?: { id: number; name: string } | null;
    teacher?: { user?: { name: string } | null } | null;
}

interface MateriPageProps {
    dbMaterials?: MaterialItem[];
}

const typeIcon: Record<MaterialType, typeof FileText> = {
    Modul: BookOpen,
    Dokumen: FileText,
    Video: Video,
    Tautan: Link2,
};

export default function MateriPage({ dbMaterials = [] }: MateriPageProps = {}) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"Semua" | MaterialType>("Semua");
    const [selected, setSelected] = useState<MaterialItem | null>(null);

    const filtered = useMemo(
        () =>
            dbMaterials.filter((material) => {
                const query = search.toLowerCase();
                const matchSearch =
                    material.title.toLowerCase().includes(query) ||
                    (material.subject?.name ?? "").toLowerCase().includes(query);
                const matchType = typeFilter === "Semua" || material.type === typeFilter;
                return matchSearch && matchType;
            }),
        [dbMaterials, search, typeFilter],
    );

    const subjectCount = new Set(dbMaterials.map((material) => material.subject?.id)).size;

    const stats = [
        { label: "Materi Terbit", value: dbMaterials.length },
        { label: "Mata Pelajaran", value: subjectCount },
        {
            label: "Modul & Dokumen",
            value: dbMaterials.filter((material) =>
                ["Modul", "Dokumen"].includes(material.type),
            ).length,
        },
    ];

    return (
        <div className="space-y-6">
            <PageTitle
                eyebrow="PEMBELAJARAN & ASESMEN"
                title="Materi Pembelajaran"
                description="Akses modul ajar, dokumen, video, dan tautan referensi dari guru mata pelajaran."
            />

            <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                            <BookOpen size={24} />
                        </span>
                        <div>
                            <h2 className="text-base font-extrabold tracking-tight text-[#20272d]">
                                Katalog Pembelajaran
                            </h2>
                            <p className="mt-0.5 text-xs text-[#68777c]">
                                Seluruh materi yang dibagikan guru untuk kelas Anda.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 border-t border-[#d8e1e8] pt-4 md:border-0 md:pt-0">
                        {stats.map((stat) => (
                            <div key={stat.label} className="min-w-[90px]">
                                <strong className="block text-xl font-black tracking-tight text-[#17345b]">
                                    {stat.value}
                                </strong>
                                <span className="block text-[11px] font-bold text-[#20272d]">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                    <Search size={16} className="text-[#68777c]" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari materi atau mata pelajaran..."
                        className="w-full bg-transparent text-xs text-[#20282d] outline-none placeholder:text-[#88989e]"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#e9eef3] p-1 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                    {(["Semua", "Modul", "Dokumen", "Video", "Tautan"] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setTypeFilter(type)}
                            className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                                typeFilter === type
                                    ? "bg-[#17345b] text-white shadow-sm"
                                    : "text-[#68777c] hover:text-[#17345b]"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf2f6] text-[#88989e] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-[#20272d]">
                        Tidak ada materi ditemukan
                    </h3>
                    <p className="mt-0.5 text-xs text-[#75848a]">
                        Coba sesuaikan kata kunci atau filter kategori di atas.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((material) => {
                        const Icon = typeIcon[material.type] ?? FileText;

                        return (
                            <button
                                key={material.id}
                                type="button"
                                onClick={() => setSelected(material)}
                                className="flex min-w-0 flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 text-left shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition hover:-translate-y-0.5"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#17345b] text-white shadow-sm">
                                            <Icon size={18} />
                                        </span>
                                        <span className="rounded-full bg-[#edf2f6] px-2.5 py-1 text-[10px] font-bold text-[#17345b]">
                                            {material.type}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 min-w-0 break-words text-base font-bold text-[#17345b]">
                                        {material.title}
                                    </h3>
                                    <p className="mt-1 text-[11px] font-semibold text-[#68777c]">
                                        {material.subject?.name ?? "Mata Pelajaran"} &middot; Semester{" "}
                                        {material.semester}
                                    </p>
                                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#68777c]">
                                        {material.description ?? "Klik untuk melihat detail materi."}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-[#d6dee4] pt-3">
                                    <span className="text-[10px] font-bold text-[#68777c]">
                                        {material.teacher?.user?.name ?? "Guru Mata Pelajaran"}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087b79]">
                                        Lihat Materi
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {selected && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-[#17345b]/35 p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[27px] bg-[#edf2f4] p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#17345b]">
                                    {selected.type} &middot; Semester {selected.semester}
                                </p>
                                <h2 className="mt-1 break-words text-2xl font-bold text-[#17345b]">
                                    {selected.title}
                                </h2>
                                <p className="mt-1 text-sm text-[#68777c]">
                                    {selected.subject?.name ?? "Mata Pelajaran"} &middot;{" "}
                                    {selected.teacher?.user?.name ?? "Guru Mata Pelajaran"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-full p-2 hover:bg-[#dce4e8]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
                                    Deskripsi
                                </span>
                                <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-[#20272d]">
                                    {selected.description ?? "Belum ada deskripsi materi."}
                                </p>
                            </div>

                            {selected.content && (
                                <div className="rounded-2xl bg-[#e9eef3] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
                                        Isi Materi
                                    </span>
                                    <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-[#20272d]">
                                        {selected.content}
                                    </p>
                                </div>
                            )}

                            {selected.link && (
                                <a
                                    href={selected.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#102743]"
                                >
                                    Buka Materi / Referensi <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
