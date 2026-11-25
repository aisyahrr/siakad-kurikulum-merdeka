import { useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import {
    BookOpen,
    ExternalLink,
    FileText,
    Link2,
    Pencil,
    Search,
    Trash2,
    Video,
} from "lucide-react";
import { Header, Modal, ModalActions, field } from "./shared";

type MaterialType = "Modul" | "Dokumen" | "Video" | "Tautan";

interface MaterialItem {
    id: number;
    title: string;
    description: string | null;
    content: string | null;
    link: string | null;
    type: MaterialType;
    semester: "Ganjil" | "Genap";
    status: "Terbit" | "Draft";
    subject?: { id: number; name: string } | null;
    school_class?: { id: number; name: string } | null;
}

interface Option {
    id: number;
    name: string;
}

interface MateriPageProps {
    dbMaterials?: MaterialItem[];
    classes?: Option[];
    subjects?: Option[];
}

const typeIcon: Record<MaterialType, typeof FileText> = {
    Modul: BookOpen,
    Dokumen: FileText,
    Video: Video,
    Tautan: Link2,
};

export default function MateriPage({
    dbMaterials = [],
    classes = [],
    subjects = [],
}: MateriPageProps = {}) {
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<MaterialItem | null>(null);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"Semua" | MaterialType>("Semua");
    const [statusFilter, setStatusFilter] = useState<"Semua" | "Terbit" | "Draft">("Semua");

    const form = useForm({
        subject_id: "",
        school_class_id: "",
        title: "",
        description: "",
        content: "",
        link: "",
        type: "Modul" as MaterialType,
        semester: "Ganjil" as "Ganjil" | "Genap",
        status: "Terbit" as "Terbit" | "Draft",
    });

    const openCreate = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
        setModal(true);
    };

    const openEdit = (material: MaterialItem) => {
        setEditing(material);
        form.setData({
            subject_id: material.subject?.id ? String(material.subject.id) : "",
            school_class_id: material.school_class?.id ? String(material.school_class.id) : "",
            title: material.title,
            description: material.description ?? "",
            content: material.content ?? "",
            link: material.link ?? "",
            type: material.type,
            semester: material.semester,
            status: material.status,
        });
        form.clearErrors();
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        setEditing(null);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        };

        if (editing) {
            form.put(`/guru/materi/${editing.id}`, options);
            return;
        }

        form.post("/guru/materi", options);
    };

    const remove = (material: MaterialItem) => {
        if (!window.confirm(`Hapus materi "${material.title}"?`)) {
            return;
        }

        router.delete(`/guru/materi/${material.id}`, { preserveScroll: true });
    };

    const filtered = useMemo(
        () =>
            dbMaterials.filter((material) => {
                const query = search.toLowerCase();
                const matchSearch =
                    material.title.toLowerCase().includes(query) ||
                    (material.subject?.name ?? "").toLowerCase().includes(query);
                const matchType = typeFilter === "Semua" || material.type === typeFilter;
                const matchStatus = statusFilter === "Semua" || material.status === statusFilter;
                return matchSearch && matchType && matchStatus;
            }),
        [dbMaterials, search, typeFilter, statusFilter],
    );

    return (
        <section className="space-y-6">
            <Header
                title="Materi Ajar"
                description="Unggah modul, dokumen, video, atau tautan referensi yang dapat diakses siswa."
                action="Tambah Materi"
                onAction={openCreate}
            />

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

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-[#e9eef3] p-1 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
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

                    <div className="flex items-center gap-1 rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
                        {(["Semua", "Terbit", "Draft"] as const).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                                    statusFilter === status
                                        ? "bg-[#087b79] text-white"
                                        : "text-[#68777c] hover:text-[#17345b]"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-[28px] bg-[#e9eef3] p-10 text-center shadow-[inset_4px_4px_10px_#cbd3db,inset_-4px_-4px_10px_#fff]">
                    <BookOpen className="mx-auto text-[#88989e]" size={32} />
                    <p className="mt-3 text-sm font-semibold text-[#17345b]">Belum ada materi</p>
                    <p className="mt-1 text-xs text-[#68777c]">
                        Tambahkan materi agar dapat dilihat oleh siswa.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((material) => {
                        const Icon = typeIcon[material.type] ?? FileText;

                        return (
                            <article
                                key={material.id}
                                className="flex min-w-0 flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#17345b] text-white shadow-sm">
                                            <Icon size={18} />
                                        </span>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                                material.status === "Terbit"
                                                    ? "bg-[#dff4ed] text-[#087b79]"
                                                    : "bg-[#f3ead9] text-[#b45309]"
                                            }`}
                                        >
                                            {material.status}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 min-w-0 break-words text-base font-bold text-[#17345b]">
                                        {material.title}
                                    </h3>
                                    <p className="mt-1 text-[11px] font-semibold text-[#68777c]">
                                        {material.subject?.name ?? "Mata Pelajaran"} &middot;{" "}
                                        {material.school_class?.name ?? "Semua Kelas"}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-[#edf2f6] px-2.5 py-1 text-[10px] font-bold text-[#17345b]">
                                            {material.type}
                                        </span>
                                        <span className="rounded-full bg-[#edf2f6] px-2.5 py-1 text-[10px] font-bold text-[#17345b]">
                                            Semester {material.semester}
                                        </span>
                                    </div>

                                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#68777c]">
                                        {material.description ?? "Belum ada deskripsi materi."}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#d6dee4] pt-3">
                                    <div className="flex items-center gap-2">
                                        {material.link && (
                                            <a
                                                href={material.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087b79] hover:underline"
                                            >
                                                Buka Tautan <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(material)}
                                            className="rounded-full p-2 text-[#17345b] transition hover:bg-[#dce4e8]"
                                            title="Edit materi"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => remove(material)}
                                            className="rounded-full p-2 text-[#c0392b] transition hover:bg-[#f7e1df]"
                                            title="Hapus materi"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {modal && (
                <Modal
                    title={editing ? "Edit Materi" : "Tambah Materi"}
                    description="Lengkapi informasi materi pembelajaran untuk siswa."
                    onClose={closeModal}
                >
                    <form onSubmit={submit} className="mt-5 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-semibold">
                                Mata Pelajaran
                                <select
                                    className={field}
                                    value={form.data.subject_id}
                                    onChange={(event) => form.setData("subject_id", event.target.value)}
                                >
                                    <option value="">Pilih mata pelajaran</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.subject_id && (
                                    <span className="mt-1 block text-xs text-[#c0392b]">
                                        {form.errors.subject_id}
                                    </span>
                                )}
                            </label>

                            <label className="block text-sm font-semibold">
                                Kelas
                                <select
                                    className={field}
                                    value={form.data.school_class_id}
                                    onChange={(event) =>
                                        form.setData("school_class_id", event.target.value)
                                    }
                                >
                                    <option value="">Semua kelas</option>
                                    {classes.map((schoolClass) => (
                                        <option key={schoolClass.id} value={schoolClass.id}>
                                            {schoolClass.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <label className="block text-sm font-semibold">
                            Judul Materi
                            <input
                                className={field}
                                value={form.data.title}
                                onChange={(event) => form.setData("title", event.target.value)}
                                placeholder="Judul materi"
                            />
                            {form.errors.title && (
                                <span className="mt-1 block text-xs text-[#c0392b]">
                                    {form.errors.title}
                                </span>
                            )}
                        </label>

                        <label className="block text-sm font-semibold">
                            Deskripsi Singkat
                            <textarea
                                className={`${field} min-h-20`}
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData("description", event.target.value)
                                }
                                placeholder="Ringkasan materi"
                            />
                        </label>

                        <label className="block text-sm font-semibold">
                            Isi Materi
                            <textarea
                                className={`${field} min-h-28`}
                                value={form.data.content}
                                onChange={(event) => form.setData("content", event.target.value)}
                                placeholder="Uraian materi atau catatan pembelajaran"
                            />
                        </label>

                        <label className="block text-sm font-semibold">
                            Tautan Referensi
                            <input
                                type="url"
                                className={field}
                                value={form.data.link}
                                onChange={(event) => form.setData("link", event.target.value)}
                                placeholder="https://..."
                            />
                            {form.errors.link && (
                                <span className="mt-1 block text-xs text-[#c0392b]">
                                    {form.errors.link}
                                </span>
                            )}
                        </label>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <label className="block text-sm font-semibold">
                                Jenis
                                <select
                                    className={field}
                                    value={form.data.type}
                                    onChange={(event) =>
                                        form.setData("type", event.target.value as MaterialType)
                                    }
                                >
                                    {["Modul", "Dokumen", "Video", "Tautan"].map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block text-sm font-semibold">
                                Semester
                                <select
                                    className={field}
                                    value={form.data.semester}
                                    onChange={(event) =>
                                        form.setData(
                                            "semester",
                                            event.target.value as "Ganjil" | "Genap",
                                        )
                                    }
                                >
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </label>

                            <label className="block text-sm font-semibold">
                                Status
                                <select
                                    className={field}
                                    value={form.data.status}
                                    onChange={(event) =>
                                        form.setData(
                                            "status",
                                            event.target.value as "Terbit" | "Draft",
                                        )
                                    }
                                >
                                    <option value="Terbit">Terbit</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </label>
                        </div>

                        <ModalActions
                            onClose={closeModal}
                            label={form.processing ? "Menyimpan..." : "Simpan"}
                        />
                    </form>
                </Modal>
            )}
        </section>
    );
}
