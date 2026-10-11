import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  ArrowRight,
  ClipboardCheck,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { Header, Modal, ModalActions, field } from "./shared";
import {
  addAssignment,
  rombels,
  subjects,
  subscribeAssignments,
  teacherSubjects,
} from "./data";

export function MataPelajaranPage() {
  const [query, setQuery] = useState("");
  const [selectedRombel, setSelectedRombel] = useState("Semua");
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [, setVersion] = useState(0);

  useEffect(
    () => subscribeAssignments(() => setVersion((value) => value + 1)),
    [],
  );

  const allSubjects = teacherSubjects();

  // Extract daftar rombel unik untuk filter chip
  const rombelOptions = [
    "Semua",
    ...Array.from(new Set(allSubjects.map((item) => item.className))),
  ];

  const filtered = allSubjects.filter((item) => {
    const matchesSearch = `${item.name} ${item.className}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesRombel =
      selectedRombel === "Semua" || item.className === selectedRombel;
    return matchesSearch && matchesRombel;
  });

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <Header
        title="Mata Pelajaran Saya"
        description="Daftar mata pelajaran dan rombel yang ditetapkan untuk Anda."
        action="Tambah Penugasan"
        onAction={() => {
          setMessage("");
          setModal(true);
        }}
      />

      {/* SEARCH BAR & FILTER ROMBEL PILLS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Search size={16} className="text-[#68777c]" />
          <input
            className="w-full bg-transparent text-xs text-[#20282d] outline-none placeholder:text-[#88989e]"
            placeholder="Cari mata pelajaran atau rombel..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <SlidersHorizontal size={14} className="text-[#68777c]" />
        </div>

        {/* ROMBEL FILTER CHIPS */}
        <div className="flex flex-wrap items-center gap-1.5">
          {rombelOptions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRombel(r)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] ${
                selectedRombel === r
                  ? "bg-[#17345b] text-white"
                  : "bg-[#e9eef3] text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* FEEDBACK NOTIFICATION */}
      {message && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* SUBJECTS CARD GRID */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const totalMeetings = 16;
          const currentMeetings = Number(item.meetings) || 0;
          const progressPercent = Math.min(
            100,
            Math.round((currentMeetings / totalMeetings) * 100),
          );

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                {/* TOP HEADER: ICON & CLASS BADGE */}
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                    <BookOpen size={18} />
                  </span>

                  <span className="rounded-full bg-[#dbe8f5] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                    {item.className}
                  </span>
                </div>

                {/* TITLE & CURRICULUM TAG */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#75848a]">
                    Kurikulum Merdeka
                  </span>
                  <h2 className="text-base font-extrabold leading-snug tracking-tight text-[#17345b]">
                    {item.name}
                  </h2>
                </div>

                {/* PROGRESS SILABUS BAR */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#68777c]">
                    <span>Progres Silabus</span>
                    <span className="text-[#17345b]">
                      {currentMeetings}/{totalMeetings} Sesi ({progressPercent}
                      %)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#d7e0e5] shadow-inner">
                    <div
                      className="h-full rounded-full bg-[#17345b] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* METRICS INSET 3-COLUMN */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] text-[#68777c]">
                  <div className="rounded-2xl bg-[#edf2f6] p-2.5 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                    <span className="block text-[10px] font-semibold">
                      Pertemuan
                    </span>
                    <b className="mt-0.5 block text-sm font-extrabold text-[#17345b]">
                      {item.meetings}
                    </b>
                  </div>

                  <div className="rounded-2xl bg-[#edf2f6] p-2.5 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                    <span className="block text-[10px] font-semibold">
                      Siswa
                    </span>
                    <b className="mt-0.5 block text-sm font-extrabold text-[#17345b]">
                      {item.students || "36"}
                    </b>
                  </div>

                  <div className="rounded-2xl bg-[#edf2f6] p-2.5 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                    <span className="block text-[10px] font-semibold">
                      Rata-rata
                    </span>
                    <b className="mt-0.5 block text-sm font-extrabold text-[#087b79]">
                      {item.average || "86.4"}
                    </b>
                  </div>
                </div>
              </div>

              {/* CARD ACTION BUTTONS */}
              <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#d8e1e8] pt-3.5">
                <Link
                  to="/guru/presensi"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-1.5 text-[11px] font-bold text-[#55636a] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:text-[#17345b]"
                >
                  <ClipboardCheck size={13} />
                  Presensi
                </Link>

                <Link
                  to="/guru/pertemuan"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_5px_#cbd3db] transition hover:bg-[#102743]"
                >
                  Buka Modul
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <BookOpen size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada mata pelajaran ditemukan
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Coba gunakan kata kunci lain atau ubah filter rombel.
          </p>
        </div>
      )}

      {/* MODAL TAMBAH PENUGASAN */}
      {modal && (
        <Modal
          title="Tambah Penugasan Mata Pelajaran"
          description="Hubungkan assignment yang tersedia dengan rombel. Master mapel dan penugasan seharusnya ditetapkan Admin."
          onClose={() => setModal(false)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const result = addAssignment(
                String(form.get("subjectId")),
                String(form.get("rombelId")),
              );
              if (!result.ok) {
                setMessage(result.message);
                return;
              }
              setMessage(result.message);
              setModal(false);
            }}
          >
            <label className="mt-4 block text-xs font-bold text-[#17345b]">
              Mata Pelajaran
              <select
                className={`${field} mt-1`}
                name="subjectId"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Pilih mata pelajaran
                </option>
                {subjects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block text-xs font-bold text-[#17345b]">
              Rombongan Belajar (Rombel)
              <select
                className={`${field} mt-1`}
                name="rombelId"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Pilih rombel
                </option>
                {rombels.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <ModalActions
              onClose={() => setModal(false)}
              label="Simpan Penugasan"
            />
          </form>
        </Modal>
      )}
    </section>
  );
}
