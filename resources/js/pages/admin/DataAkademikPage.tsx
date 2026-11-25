import { useEffect, useState, useMemo } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { Search, Plus, CheckCircle2, Edit3, X } from "lucide-react";

interface StudentRecord {
  id: string | number;
  name: string;
  nisn: string;
  rombel: string;
  rombelId?: number | null;
  angkatan: string;
  gender: "L" | "P" | "-";
  status: "Aktif" | "Mutasi" | "Lulus";
}

interface TeacherRecord {
  id: string | number;
  name: string;
  nip: string;
  mainSubject: string;
  homeroomClass?: string;
  homeroomClassId?: number | null;
  teachingHours: number;
  status: "PNS" | "PPPK" | "Honorer";
}

interface ClassOption {
  id: number;
  name: string;
}

interface DataAkademikProps {
  students?: StudentRecord[];
  teachers?: TeacherRecord[];
  classes?: ClassOption[];
}

export default function DataAkademikPage({
  students = [],
  teachers = [],
  classes = [],
}: DataAkademikProps = {}) {
  const page = usePage<{ flash?: { success?: string; error?: string } }>();
  const flash = page.props.flash;

  const [activeTab, setActiveTab] = useState<"siswa" | "guru">("siswa");
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("Semua");
  const [modalStudent, setModalStudent] = useState(false);
  const [modalAssignHomeroom, setModalAssignHomeroom] =
    useState<TeacherRecord | null>(null);
  const [assignedClassId, setAssignedClassId] = useState<string>("");
  const [feedback, setFeedback] = useState("");

  const studentForm = useForm({
    name: "",
    nisn: "",
    gender: "L" as "L" | "P",
    rombel: "",
    angkatan: String(new Date().getFullYear()),
  });

  useEffect(() => {
    if (flash?.success) {
      setFeedback(flash.success);
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
    if (flash?.error) {
      setFeedback(flash.error);
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success, flash?.error]);

  const rombelOptions = useMemo(
    () => ["Semua", ...classes.map((item) => item.name)],
    [classes],
  );

  // Top summary metrics
  const summary = useMemo(() => {
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const assignedHomeroom = teachers.filter((t) => t.homeroomClass).length;
    return { totalStudents, totalTeachers, assignedHomeroom };
  }, [students, teachers]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery);
      const matchClass = classFilter === "Semua" || s.rombel === classFilter;
      return matchSearch && matchClass;
    });
  }, [students, searchQuery, classFilter]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      return (
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.nip.includes(searchQuery) ||
        t.mainSubject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [teachers, searchQuery]);

  const openAssignModal = (teacher: TeacherRecord) => {
    setModalAssignHomeroom(teacher);
    setAssignedClassId(teacher.homeroomClassId ? String(teacher.homeroomClassId) : "none");
  };

  const handleAssignHomeroom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalAssignHomeroom) return;

    router.post(
      `/admin/data-akademik/guru/${modalAssignHomeroom.id}/wali-kelas`,
      {
        class_id: assignedClassId === "none" ? null : assignedClassId,
      },
      {
        preserveScroll: true,
        onSuccess: () => setModalAssignHomeroom(null),
      },
    );
  };

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    studentForm.post("/admin/data-akademik/siswa", {
      preserveScroll: true,
      onSuccess: () => {
        setModalStudent(false);
        studentForm.reset();
      },
    });
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Database Master • Dapodik & Kurikulum Merdeka
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Data Pokok Akademik (Siswa & Guru)
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Pengelolaan buku induk siswa, identitas NIP guru, serta penugasan
            resmi Wali Kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "siswa" && (
            <button
              type="button"
              onClick={() => setModalStudent(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743]"
            >
              <Plus size={14} />
              Tambah Siswa
            </button>
          )}
        </div>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Peserta Didik",
            value: summary.totalStudents,
            sub: "Buku Induk Aktif",
            colorText: "text-[#17345b]",
          },
          {
            label: "Tenaga Pengajar",
            value: summary.totalTeachers,
            sub: "PNS, PPPK & Honorer",
            colorText: "text-[#087b79]",
          },
          {
            label: "Penugasan Wali Kelas",
            value: `${summary.assignedHomeroom} Guru`,
            sub: "Terpetakan ke Rombel",
            colorText: "text-[#17345b]",
          },
          {
            label: "Sinkronisasi Dapodik",
            value: "100%",
            sub: "Validasi NISN/NIP Tuntas",
            colorText: "text-[#087b79]",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
          >
            <span className={`block text-[11px] font-bold ${item.colorText}`}>
              {item.label}
            </span>
            <strong
              className={`mt-1 block text-2xl font-black ${item.colorText}`}
            >
              {item.value}
            </strong>
            <span className="text-[10px] text-[#718086]">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* FEEDBACK ALERT */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* TAB SWITCHER & FILTER BAR */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* SEARCH BOX */}
          <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <Search size={16} className="text-[#68777c]" />
            <input
              type="text"
              placeholder={
                activeTab === "siswa"
                  ? "Cari nama siswa atau NISN..."
                  : "Cari nama guru, NIP, atau mapel..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
            />
          </div>

          {/* TAB SWITCHER (SISWA VS GURU) */}
          <div className="flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("siswa")}
              className={`rounded-full px-4 py-1 text-[11px] font-bold transition ${
                activeTab === "siswa"
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              Buku Induk Siswa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("guru")}
              className={`rounded-full px-4 py-1 text-[11px] font-bold transition ${
                activeTab === "guru"
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              Pendidik & Wali Kelas
            </button>
          </div>
        </div>

        {/* ROMBEL FILTER JIKA TAB SISWA */}
        {activeTab === "siswa" && (
          <div className="flex flex-wrap items-center gap-1.5">
            {rombelOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setClassFilter(r)}
                className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                  classFilter === r
                    ? "bg-[#087b79] text-white shadow-sm"
                    : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        <div className="overflow-x-auto">
          {activeTab === "siswa" ? (
            /* ================= TABEL SISWA ================= */
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3">NISN Resmi</th>
                  <th className="py-3 px-2 text-center">Rombel</th>
                  <th className="py-3 px-2 text-center">Angkatan</th>
                  <th className="py-3 px-2 text-center">Gender</th>
                  <th className="py-3 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce4ea] text-xs">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="transition hover:bg-white/30">
                    <td className="py-3.5 px-3">
                      <strong className="block font-bold text-[#20272d]">
                        {s.name}
                      </strong>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#17345b]">
                      {s.nisn}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold text-[#17345b]">
                        {s.rombel}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center font-medium text-[#68777c]">
                      {s.angkatan}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-[#68777c]">
                      {s.gender}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="rounded-full bg-[#dcebea] px-2.5 py-0.5 text-[10px] font-extrabold text-[#087b79]">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* ================= TABEL GURU & WALI KELAS ================= */
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                  <th className="py-3 px-3">Nama Pendidik</th>
                  <th className="py-3 px-3">NIP</th>
                  <th className="py-3 px-2">Mata Pelajaran Utama</th>
                  <th className="py-3 px-2 text-center">
                    Penugasan Wali Kelas
                  </th>
                  <th className="py-3 px-2 text-center">Beban Ajar</th>
                  <th className="py-3 px-3 text-center">Aksi Penugasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce4ea] text-xs">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="transition hover:bg-white/30">
                    <td className="py-3.5 px-3">
                      <strong className="block font-bold text-[#20272d]">
                        {t.name}
                      </strong>
                      <span className="text-[10px] text-[#718086]">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#17345b]">
                      {t.nip}
                    </td>
                    <td className="py-3.5 px-2 font-medium text-[#20272d]">
                      {t.mainSubject}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      {t.homeroomClass ? (
                        <span className="rounded-full bg-[#dcebea] px-3 py-0.5 text-[10px] font-extrabold text-[#087b79]">
                          Wali {t.homeroomClass}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#8fa0a6]">
                          Hanya Guru Mapel
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-[#17345b]">
                      {t.teachingHours} Jam/Mgg
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => openAssignModal(t)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#e9eef3] px-3 py-1 text-[10px] font-bold text-[#17345b] shadow-[2px_2px_4px_#cbd3db,-2px_-2px_4px_#fff] transition hover:text-[#087b79]"
                      >
                        <Edit3 size={12} />
                        Atur Rombel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL TAMBAH DATA SISWA */}
      {modalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Buku Induk Siswa
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  Entri Siswa Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalStudent(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Nama Lengkap Siswa
                </label>
                <input
                  name="name"
                  value={studentForm.data.name}
                  onChange={(e) => studentForm.setData("name", e.target.value)}
                  placeholder="Contoh: Muhammad Farhan"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
                {studentForm.errors.name && (
                  <span className="text-[10px] font-semibold text-[#c0392b]">{studentForm.errors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    NISN Resmi (10 Digit)
                  </label>
                  <input
                    name="nisn"
                    value={studentForm.data.nisn}
                    onChange={(e) => studentForm.setData("nisn", e.target.value)}
                    placeholder="0064928119"
                    maxLength={10}
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                  {studentForm.errors.nisn && (
                    <span className="text-[10px] font-semibold text-[#c0392b]">{studentForm.errors.nisn}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Jenis Kelamin
                  </label>
                  <select
                    name="gender"
                    value={studentForm.data.gender}
                    onChange={(e) => studentForm.setData("gender", e.target.value as "L" | "P")}
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Rombel Belajar
                  </label>
                  <select
                    name="rombel"
                    value={studentForm.data.rombel}
                    onChange={(e) => studentForm.setData("rombel", e.target.value)}
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option value="">-- Pilih Rombel --</option>
                    {classes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Tahun Angkatan
                  </label>
                  <input
                    name="angkatan"
                    value={studentForm.data.angkatan}
                    onChange={(e) => studentForm.setData("angkatan", e.target.value)}
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                  {studentForm.errors.angkatan && (
                    <span className="text-[10px] font-semibold text-[#c0392b]">{studentForm.errors.angkatan}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setModalStudent(false)}
                  className="rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Plus size={13} /> Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PENUGASAN WALI KELAS */}
      {modalAssignHomeroom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Penugasan Akademik
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  Plotting Wali Kelas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAssignHomeroom(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAssignHomeroom} className="mt-4 space-y-3">
              <div className="rounded-2xl bg-[#edf2f6] p-3 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <strong className="block font-bold text-[#20272d]">
                  {modalAssignHomeroom.name}
                </strong>
                <span className="text-[10px] text-[#68777c]">
                  NIP: {modalAssignHomeroom.nip} •{" "}
                  {modalAssignHomeroom.mainSubject}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Rombongan Belajar Sasaran
                </label>
                <select
                  name="assignedClass"
                  value={assignedClassId}
                  onChange={(e) => setAssignedClassId(e.target.value)}
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                >
                  <option value="none">
                    -- Bebas Tugas Wali Kelas (Hanya Guru Mapel) --
                  </option>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setModalAssignHomeroom(null)}
                  className="rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
