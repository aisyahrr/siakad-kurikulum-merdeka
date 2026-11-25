import { useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import {
  ArrowRight,
  AlertCircle,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileEdit,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Header, Modal, ModalActions, field } from "./shared";

/* ==========================================================================
   1. HALAMAN KUIS & UJIAN (+ MODAL KOREKSI ESSAY SPLIT-VIEW)
   ========================================================================== */
interface QuizOptionItem {
  id: number;
  option_text: string;
  is_correct: boolean;
}

interface QuizQuestionItem {
  id: number;
  type: "mcq" | "essay";
  question_text: string;
  points: number;
  options: QuizOptionItem[];
}

interface QuizAnswerItem {
  quiz_question_id: number;
  quiz_option_id: number | null;
  essay_answer: string | null;
  score: number | null;
}

interface QuizSubmissionItem {
  id: number;
  mcq_score: number;
  essay_score: number | null;
  total_score: number | null;
  is_graded: boolean;
  feedback: string | null;
  submitted_at?: string | null;
  student?: { id: number; nisn?: string; user?: { name: string } };
  answers?: QuizAnswerItem[];
}

interface DbQuiz {
  id: number;
  title: string;
  type: string;
  duration: number;
  status: "Terbit" | "Draft";
  school_class?: { id: number; name: string } | null;
  subject?: { id: number; name: string } | null;
  submissions_count?: number;
  questions?: QuizQuestionItem[];
  submissions?: QuizSubmissionItem[];
}

interface Option {
  id: number;
  name: string;
}

interface DraftOption {
  text: string;
  correct: boolean;
}

interface DraftQuestion {
  type: "mcq" | "essay";
  text: string;
  points: number;
  options: DraftOption[];
}

interface KuisPageProps {
  dbQuizzes?: DbQuiz[];
  classes?: Option[];
  subjects?: Option[];
}

function emptyMcqQuestion(): DraftQuestion {
  return {
    type: "mcq",
    text: "",
    points: 10,
    options: [
      { text: "", correct: true },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
  };
}

function emptyEssayQuestion(): DraftQuestion {
  return { type: "essay", text: "", points: 20, options: [] };
}

export default function KuisPage({
  dbQuizzes = [],
  classes = [],
  subjects = [],
}: KuisPageProps = {}) {
  const [modalCreate, setModalCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalGradingId, setModalGradingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Terbit" | "Draft">("Semua");
  const [questionError, setQuestionError] = useState("");
  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>([emptyMcqQuestion()]);

  const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null);
  const [currentEssayInput, setCurrentEssayInput] = useState<number>(0);
  const [currentFeedbackInput, setCurrentFeedbackInput] = useState<string>("");

  const form = useForm({
    school_class_id: "",
    subject_id: "",
    title: "",
    type: "Formatif",
    duration: 45,
    status: "Terbit" as "Terbit" | "Draft",
  });

  const modalGrading = useMemo(
    () => dbQuizzes.find((quiz) => quiz.id === modalGradingId) ?? null,
    [dbQuizzes, modalGradingId],
  );

  const gradingSubmissions = modalGrading?.submissions ?? [];
  const activeSubmission =
    gradingSubmissions.find((submission) => submission.id === activeSubmissionId) ??
    gradingSubmissions[0];
  const essayQuestion = modalGrading?.questions?.find((question) => question.type === "essay");
  const activeEssayAnswer =
    activeSubmission?.answers?.find(
      (answer) => answer.quiz_question_id === essayQuestion?.id,
    )?.essay_answer ?? "Siswa belum menjawab soal essay ini.";

  const openCreate = () => {
    setEditingId(null);
    form.reset();
    form.clearErrors();
    setQuestionError("");
    setDraftQuestions([emptyMcqQuestion()]);
    setModalCreate(true);
  };

  const openEdit = (quiz: DbQuiz) => {
    setEditingId(quiz.id);
    form.setData({
      school_class_id: quiz.school_class?.id ? String(quiz.school_class.id) : "",
      subject_id: quiz.subject?.id ? String(quiz.subject.id) : "",
      title: quiz.title,
      type: quiz.type,
      duration: quiz.duration,
      status: quiz.status,
    });
    form.clearErrors();
    setQuestionError("");

    const mapped = (quiz.questions ?? []).map<DraftQuestion>((question) => ({
      type: question.type,
      text: question.question_text,
      points: question.points,
      options:
        question.type === "mcq"
          ? question.options.map((option) => ({
              text: option.option_text,
              correct: option.is_correct,
            }))
          : [],
    }));

    setDraftQuestions(mapped.length > 0 ? mapped : [emptyMcqQuestion()]);
    setModalCreate(true);
  };

  const openGrading = (quiz: DbQuiz) => {
    const first = quiz.submissions?.[0];
    setModalGradingId(quiz.id);
    setActiveSubmissionId(first?.id ?? null);
    setCurrentEssayInput(first?.essay_score ?? 0);
    setCurrentFeedbackInput(first?.feedback ?? "");
  };

  const selectStudentForGrading = (submission: QuizSubmissionItem) => {
    setActiveSubmissionId(submission.id);
    setCurrentEssayInput(submission.essay_score ?? 0);
    setCurrentFeedbackInput(submission.feedback ?? "");
  };

  const saveGrading = () => {
    if (!activeSubmission) {
      return;
    }

    router.post(
      `/guru/kuis/grade/${activeSubmission.id}`,
      {
        essay_score: currentEssayInput,
        feedback: currentFeedbackInput,
      },
      { preserveScroll: true },
    );
  };

  const updateQuestion = (index: number, patch: Partial<DraftQuestion>) => {
    setDraftQuestions((previous) =>
      previous.map((question, position) =>
        position === index ? { ...question, ...patch } : question,
      ),
    );
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    setDraftQuestions((previous) =>
      previous.map((question, position) => {
        if (position !== questionIndex) {
          return question;
        }

        return {
          ...question,
          options: question.options.map((option, optionPosition) =>
            optionPosition === optionIndex ? { ...option, text } : option,
          ),
        };
      }),
    );
  };

  const markCorrectOption = (questionIndex: number, optionIndex: number) => {
    setDraftQuestions((previous) =>
      previous.map((question, position) => {
        if (position !== questionIndex) {
          return question;
        }

        return {
          ...question,
          options: question.options.map((option, optionPosition) => ({
            ...option,
            correct: optionPosition === optionIndex,
          })),
        };
      }),
    );
  };

  const removeQuestion = (index: number) => {
    setDraftQuestions((previous) => previous.filter((_, position) => position !== index));
  };

  const submitQuiz = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuestionError("");

    if (draftQuestions.length === 0) {
      setQuestionError("Tambahkan minimal satu soal.");
      return;
    }

    for (const [index, question] of draftQuestions.entries()) {
      if (!question.text.trim()) {
        setQuestionError(`Soal #${index + 1} belum diisi.`);
        return;
      }

      if (question.type !== "mcq") {
        continue;
      }

      const filledOptions = question.options.filter((option) => option.text.trim());

      if (filledOptions.length < 2) {
        setQuestionError(`Soal #${index + 1} membutuhkan minimal 2 opsi jawaban.`);
        return;
      }

      if (filledOptions.filter((option) => option.correct).length !== 1) {
        setQuestionError(`Pilih tepat satu jawaban benar pada soal #${index + 1}.`);
        return;
      }
    }

    const questions = draftQuestions.map((question) => ({
      question_text: question.text,
      type: question.type,
      points: question.points,
      options:
        question.type === "mcq"
          ? question.options
              .filter((option) => option.text.trim())
              .map((option) => ({ option_text: option.text, is_correct: option.correct }))
          : [],
    }));

    form.transform((data) => ({ ...data, questions }));

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        setModalCreate(false);
        setEditingId(null);
      },
    };

    if (editingId) {
      form.put(`/guru/kuis/${editingId}`, options);
      return;
    }

    form.post("/guru/kuis", options);
  };

  const removeQuiz = (quiz: DbQuiz) => {
    if (!window.confirm(`Hapus kuis "${quiz.title}"?`)) {
      return;
    }

    router.delete(`/guru/kuis/${quiz.id}`, { preserveScroll: true });
  };

  const filteredQuizzes = useMemo(() => {
    return dbQuizzes.filter((quiz) => {
      const matchSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.subject?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "Semua" || quiz.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [dbQuizzes, searchQuery, statusFilter]);

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <Header
        title="Kuis & Evaluasi Pembelajaran"
        description="Rancang paket asesmen formatif atau sumatif, batas waktu pengerjaan, dan pantau pengumpulan jawaban siswa."
        action="Buat Paket Kuis"
        onAction={openCreate}
      />

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Search size={16} className="text-[#68777c]" />
          <input
            type="text"
            placeholder="Cari judul kuis atau mata pelajaran..."
            className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-1.5 rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
          {(["Semua", "Terbit", "Draft"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                statusFilter === tab
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* QUIZ CARDS LIST */}
      <div className="space-y-4">
        {filteredQuizzes.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 hover:-translate-y-0.5 sm:p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                  <ClipboardCheck size={22} />
                </span>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                      {item.school_class?.name ?? "Semua Kelas"}
                    </span>
                    <span className="text-[11px] font-bold text-[#68777c]">
                      {item.subject?.name ?? "Mata Pelajaran"}
                    </span>
                    <span className="text-[#a8b5bc]">•</span>
                    <span className="rounded-full bg-[#e2e8f0] px-2 py-0.5 text-[10px] font-bold uppercase text-[#475569]">
                      {item.type}
                    </span>
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-[#20272d]">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#68777c]">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-[#17345b]" />
                      Durasi: {item.duration} Menit
                    </span>
                    <span>•</span>
                    <span>
                      {item.questions?.filter((question) => question.type === "mcq").length ?? 0}{" "}
                      Pilihan Ganda ·{" "}
                      {item.questions?.filter((question) => question.type === "essay").length ?? 0}{" "}
                      Esei
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                    item.status === "Terbit"
                      ? "bg-[#dcebea] text-[#087b79]"
                      : "bg-[#fef3c7] text-[#b45309]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            {/* BOTTOM BAR: RESPONSES BAR & ACTIONS */}
            <div className="mt-5 flex flex-col gap-3 border-t border-[#d8e1e8] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#edf2f6] px-3.5 py-1 text-[11px] font-semibold text-[#5a6a72] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                <Sparkles size={13} className="text-[#087b79]" />
                <span>
                  Respons Masuk:{" "}
                  <strong className="text-[#17345b]">
                    {item.submissions_count ?? item.submissions?.length ?? 0}
                  </strong>{" "}
                  Siswa
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-1.5 text-[11px] font-bold text-[#55636a] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:text-[#17345b]"
                >
                  Edit Paket
                </button>

                <button
                  type="button"
                  onClick={() => removeQuiz(item)}
                  className="inline-grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-[#c0392b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:bg-[#f7e1df]"
                  title="Hapus kuis"
                >
                  <Trash2 size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => openGrading(item)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_5px_#cbd3db] transition hover:bg-[#102743]"
                >
                  <FileEdit size={13} />
                  Koreksi Jawaban
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredQuizzes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <ClipboardCheck size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada paket kuis ditemukan
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Coba sesuaikan kata kunci pencarian atau ubah filter status di atas.
          </p>
        </div>
      )}

      {/* MODAL BUAT / EDIT KUIS */}
      {modalCreate && (
        <Modal
          title={editingId ? "Edit Kuis & Evaluasi" : "Buat Kuis & Evaluasi Baru"}
          description="Atur rincian asesmen, kelas target, dan butir soal yang akan dikerjakan siswa."
          onClose={() => setModalCreate(false)}
        >
          <form onSubmit={submitQuiz}>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-[#17345b]">
                Mata Pelajaran
                <select
                  className={`${field} mt-1`}
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
                  <span className="mt-1 block text-[11px] text-[#c0392b]">
                    {form.errors.subject_id}
                  </span>
                )}
              </label>

              <label className="block text-xs font-bold text-[#17345b]">
                Rombel Target
                <select
                  className={`${field} mt-1`}
                  value={form.data.school_class_id}
                  onChange={(event) => form.setData("school_class_id", event.target.value)}
                >
                  <option value="">Pilih kelas</option>
                  {classes.map((schoolClass) => (
                    <option key={schoolClass.id} value={schoolClass.id}>
                      {schoolClass.name}
                    </option>
                  ))}
                </select>
                {form.errors.school_class_id && (
                  <span className="mt-1 block text-[11px] text-[#c0392b]">
                    {form.errors.school_class_id}
                  </span>
                )}
              </label>
            </div>

            <label className="mt-3 block text-xs font-bold text-[#17345b]">
              Judul Asesmen / Evaluasi
              <input
                className={`${field} mt-1`}
                value={form.data.title}
                onChange={(event) => form.setData("title", event.target.value)}
                placeholder="Contoh: Evaluasi Formatif Vektor dan Geometri Ruang"
              />
              {form.errors.title && (
                <span className="mt-1 block text-[11px] text-[#c0392b]">{form.errors.title}</span>
              )}
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="block text-xs font-bold text-[#17345b]">
                Tipe Asesmen
                <select
                  className={`${field} mt-1`}
                  value={form.data.type}
                  onChange={(event) => form.setData("type", event.target.value)}
                >
                  <option value="Formatif">Formatif (Kuis Harian)</option>
                  <option value="Sumatif">Sumatif (Ujian Blok / STS)</option>
                </select>
              </label>

              <label className="block text-xs font-bold text-[#17345b]">
                Batas Waktu (Menit)
                <input
                  className={`${field} mt-1`}
                  value={form.data.duration}
                  onChange={(event) =>
                    form.setData("duration", Number(event.target.value) || 5)
                  }
                  type="number"
                  min="5"
                  max="180"
                />
              </label>

              <label className="block text-xs font-bold text-[#17345b]">
                Status
                <select
                  className={`${field} mt-1`}
                  value={form.data.status}
                  onChange={(event) =>
                    form.setData("status", event.target.value as "Terbit" | "Draft")
                  }
                >
                  <option value="Terbit">Terbit</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#17345b]">
                  Butir Soal ({draftQuestions.length})
                </span>
                <span className="text-[10px] text-[#68777c]">
                  PG dinilai otomatis, essay dikoreksi manual
                </span>
              </div>

              {draftQuestions.map((question, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-[#edf2f6] p-3 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-[#68777c]">
                      Soal #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={question.type}
                        onChange={(event) => {
                          const type = event.target.value as "mcq" | "essay";
                          updateQuestion(index, {
                            type,
                            options:
                              type === "essay"
                                ? []
                                : [
                                    { text: "", correct: true },
                                    { text: "", correct: false },
                                    { text: "", correct: false },
                                    { text: "", correct: false },
                                  ],
                          });
                        }}
                        className="rounded-lg bg-[#e9eef3] px-2 py-1 text-[11px] font-bold text-[#17345b] outline-none"
                      >
                        <option value="mcq">Pilihan Ganda</option>
                        <option value="essay">Essay</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={question.points}
                        onChange={(event) =>
                          updateQuestion(index, {
                            points: Math.min(100, Math.max(1, Number(event.target.value) || 1)),
                          })
                        }
                        className="w-16 rounded-lg bg-[#e9eef3] px-2 py-1 text-[11px] font-bold text-[#17345b] outline-none"
                        title="Poin soal"
                      />
                      {draftQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="rounded-full p-1.5 text-[#c0392b] transition hover:bg-[#f7e1df]"
                          title="Hapus soal"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={question.text}
                    onChange={(event) => updateQuestion(index, { text: event.target.value })}
                    placeholder={
                      question.type === "mcq"
                        ? "Tulis pertanyaan pilihan ganda..."
                        : "Tulis pertanyaan essay..."
                    }
                    className="mt-2 min-h-16 w-full rounded-xl bg-[#e9eef3] p-2.5 text-xs text-[#20272d] outline-none"
                  />

                  {question.type === "mcq" && (
                    <div className="mt-2 space-y-1.5">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={option.correct}
                            onChange={() => markCorrectOption(index, optionIndex)}
                            className="accent-[#087b79]"
                            title="Tandai jawaban benar"
                          />
                          <input
                            value={option.text}
                            onChange={(event) =>
                              updateOption(index, optionIndex, event.target.value)
                            }
                            placeholder={`Opsi ${String.fromCharCode(65 + optionIndex)}`}
                            className="w-full rounded-lg bg-[#e9eef3] px-2.5 py-1.5 text-xs text-[#20272d] outline-none"
                          />
                        </div>
                      ))}
                      <p className="text-[10px] text-[#68777c]">
                        Pilih radio di samping jawaban yang benar.
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDraftQuestions((previous) => [...previous, emptyMcqQuestion()])}
                  className="inline-flex items-center gap-1 rounded-full bg-[#e9eef3] px-3 py-1.5 text-[11px] font-bold text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  <Plus size={13} /> Pilihan Ganda
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDraftQuestions((previous) => [...previous, emptyEssayQuestion()])
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-[#e9eef3] px-3 py-1.5 text-[11px] font-bold text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  <Plus size={13} /> Essay
                </button>
              </div>

              {questionError && (
                <p className="text-xs font-semibold text-[#c0392b]">{questionError}</p>
              )}
            </div>

            <ModalActions
              onClose={() => setModalCreate(false)}
              label={
                form.processing
                  ? "Menyimpan..."
                  : editingId
                    ? "Simpan Perubahan"
                    : "Terbitkan Paket Evaluasi"
              }
            />
          </form>
        </Modal>
      )}

      {/* MODAL KOREKSI ASESMEN ESSAY (SPLIT-VIEW) */}
      {modalGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-[32px] bg-[#e9eef3] p-6 shadow-[10px_10px_25px_#b8c2cc]">
            {/* MODAL TOP BAR */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#d8e1e8] pb-4">
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                  Koreksi Jawaban Essay Siswa
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  {modalGrading.title} — {modalGrading.rombel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalGradingId(null)}
                className="rounded-full bg-[#e9eef3] px-3.5 py-1 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
              >
                Tutup [ESC]
              </button>
            </div>

            {/* SPLIT CANVAS CONTAINER */}
            <div className="mt-4 grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-[300px_1fr]">
              {/* SISI KIRI: DAFTAR SISWA */}
              <div className="flex flex-col rounded-2xl bg-[#edf2f6] p-3 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <span className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
                  Antrean Respons ({gradingSubmissions.length})
                </span>
                <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {gradingSubmissions.map((sub) => {
                    const isActive = sub.id === activeSubmissionId;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => selectStudentForGrading(sub)}
                        className={`w-full rounded-xl p-2.5 text-left transition ${
                          isActive
                            ? "bg-[#17345b] text-white shadow-sm"
                            : "bg-[#e9eef3] text-[#20272d] hover:bg-white/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <strong className="min-w-0 truncate text-xs font-bold">
                            {sub.student?.user?.name ?? "Siswa"}
                          </strong>
                          {sub.is_graded ? (
                            <Check size={13} className={isActive ? "text-[#34d399]" : "text-[#087b79]"} />
                          ) : (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#ef4444]" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] opacity-80">
                          <span>PG: {sub.mcq_score}/100</span>
                          <span>
                            Essay: {sub.essay_score !== null ? `${sub.essay_score}/100` : "Pending"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {gradingSubmissions.length === 0 && (
                    <p className="rounded-xl bg-[#e9eef3] p-3 text-[11px] text-[#68777c]">
                      Belum ada siswa yang mengumpulkan kuis ini.
                    </p>
                  )}
                </div>
              </div>

              {/* SISI KANAN: WORKSPACE KOREKSI */}
              <div className="flex flex-col justify-between overflow-y-auto pr-2">
                <div className="space-y-4">
                  {/* INFORMASI BUTIR SOAL */}
                  <div className="rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#087b79]">
                      Butir Soal Essay (Bobot Maks: {essayQuestion?.points ?? 0} Poin)
                    </span>
                    <p className="mt-1 text-xs font-bold leading-relaxed text-[#20272d]">
                      {essayQuestion?.question_text ??
                        "Kuis ini tidak memiliki butir soal essay."}
                    </p>
                  </div>

                  {/* JAWABAN SISWA */}
                  <div>
                    <span className="text-[11px] font-bold text-[#68777c]">
                      Jawaban dari {activeSubmission?.student?.user?.name ?? "Siswa"}:
                    </span>
                    <div className="mt-1 min-h-16 rounded-2xl bg-[#edf2f6] p-4 text-xs leading-relaxed text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                      "{activeEssayAnswer}"
                    </div>
                  </div>

                  {/* RUBRIK SCORE & FEEDBACK FORM */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#17345b]">
                        Nilai Essay (0–100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentEssayInput}
                        onChange={(e) => setCurrentEssayInput(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                        className="mt-1 w-full rounded-xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                      />
                    </div>

                    <div className="flex flex-col justify-center rounded-xl bg-[#e9eef3] p-2.5 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                      <span className="text-[10px] font-bold text-[#68777c]">Kalkulasi Nilai Akhir:</span>
                      <strong className="text-sm font-extrabold text-[#17345b]">
                        {activeSubmission
                          ? Math.round((activeSubmission.mcq_score + currentEssayInput) / 2)
                          : 0}{" "}
                        / 100
                      </strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17345b]">
                      Catatan Evaluasi / Feedback Guru:
                    </label>
                    <textarea
                      value={currentFeedbackInput}
                      onChange={(e) => setCurrentFeedbackInput(e.target.value)}
                      placeholder="Berikan catatan perbaikan atau apresiasi terhadap hasil jawaban siswa..."
                      className="mt-1 min-h-20 w-full rounded-xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    />
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#d8e1e8] pt-3">
                  <button
                    type="button"
                    onClick={saveGrading}
                    disabled={!activeSubmission}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#102743] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={14} />
                    Simpan Nilai & Berikan Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   2. HALAMAN MATRIKS SISWA & ANALITIK
   ========================================================================== */
interface MatrixStudentItem {
  id: string;
  name: string;
  nisn: string;
  m1: boolean;
  m2: boolean;
  m3: boolean;
  quizScore: number;
}

export function MatriksPage() {
  const [selectedClass, setSelectedClass] = useState("XII MIPA 1");
  const [searchStudent, setSearchStudent] = useState("");

  const studentData: MatrixStudentItem[] = [
    { id: "1", name: "Alya Putri", nisn: "0064928110", m1: true, m2: true, m3: true, quizScore: 92 },
    { id: "2", name: "Bagas Ramadhan", nisn: "0064928111", m1: true, m2: false, m3: false, quizScore: 68 },
    { id: "3", name: "Citra Lestari", nisn: "0064928112", m1: true, m2: true, m3: true, quizScore: 86 },
    { id: "4", name: "Dimas Pratama", nisn: "0064928113", m1: true, m2: true, m3: false, quizScore: 78 },
    { id: "5", name: "Eka Rahmawati", nisn: "0064928114", m1: true, m2: true, m3: true, quizScore: 95 },
  ];

  const filtered = studentData.filter((s) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <Header
        title="Matriks Penyelesaian & KKTP Siswa"
        description="Pantau pemenuhan silabus modul bacaan dan evaluasi ketercapaian tujuan pembelajaran siswa."
      />

      {/* TOP STATS & FILTER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ROMBEL PILL SELECTOR */}
        <div className="flex items-center gap-1.5 rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
          {["XII MIPA 1", "XI MIPA 2"].map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition ${
                selectedClass === cls
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* KKTP SUMMARY METRICS */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcebea] px-3.5 py-1.5 text-xs font-bold text-[#087b79]">
            <CheckCircle2 size={13} /> 80% Siswa Tuntas KKTP
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fadbd8] px-3.5 py-1.5 text-xs font-bold text-[#c0392b]">
            <AlertCircle size={13} /> 1 Perlu Remedial
          </span>
        </div>
      </div>

      {/* MATRIX TABLE CARD */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        {/* SUBHEADER: SEARCH */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d8e1e8]">
          <div className="flex items-center gap-2.5 rounded-full bg-[#edf2f6] px-4 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] w-full sm:w-72">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari siswa dalam matriks..."
              className="w-full bg-transparent outline-none text-xs text-[#20272d]"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
            />
          </div>
          <span className="text-[11px] font-bold text-[#68777c] hidden sm:block">
            Target Capaian KKTP: 70.0
          </span>
        </div>

        {/* TABLE CONTENT */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[11px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Modul 01</th>
                <th className="py-3 px-3 text-center">Modul 02</th>
                <th className="py-3 px-3 text-center">Modul 03</th>
                <th className="py-3 px-3 text-center">Rata-rata Kuis</th>
                <th className="py-3 px-3 text-center">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filtered.map((student) => {
                const isPassed = student.quizScore >= 70;

                return (
                  <tr key={student.id} className="transition hover:bg-white/30">
                    <td className="py-3.5 px-3">
                      <strong className="block font-bold text-[#20272d]">{student.name}</strong>
                      <span className="text-[11px] text-[#718086]">NISN: {student.nisn}</span>
                    </td>

                    {/* MODUL 1 CHECK */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#087b79] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                        <CheckCircle2 size={15} />
                      </span>
                    </td>

                    {/* MODUL 2 CHECK */}
                    <td className="py-3.5 px-3 text-center">
                      {student.m2 ? (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#087b79] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <CheckCircle2 size={15} />
                        </span>
                      ) : (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#b45309] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <AlertCircle size={15} />
                        </span>
                      )}
                    </td>

                    {/* MODUL 3 CHECK */}
                    <td className="py-3.5 px-3 text-center">
                      {student.m3 ? (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#087b79] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <CheckCircle2 size={15} />
                        </span>
                      ) : (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#94a3b8] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <span className="text-[10px] font-bold">—</span>
                        </span>
                      )}
                    </td>

                    {/* SKOR KUIS */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-extrabold text-[#17345b] text-sm">
                        {student.quizScore}
                      </span>
                    </td>

                    {/* STATUS PILL */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                          isPassed
                            ? "bg-[#dcebea] text-[#087b79]"
                            : "bg-[#fadbd8] text-[#c0392b]"
                        }`}
                      >
                        {isPassed ? "Tuntas KKTP" : "Perlu Remedial"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}