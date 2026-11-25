import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    ClipboardCheck,
    Clock,
    Search,
    CheckCircle2,
    X,
    Send,
    Award,
} from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/ui/page-title";

interface QuizOption {
    id: number;
    option_text: string;
}

interface QuizQuestion {
    id: number;
    type: "mcq" | "essay";
    question_text: string;
    points: number;
    options: QuizOption[];
}

interface QuizSubmission {
    id: number;
    mcq_score: number;
    essay_score: number | null;
    total_score: number | null;
    is_graded: boolean;
    feedback: string | null;
    submitted_at?: string | null;
}

interface QuizItem {
    id: number;
    title: string;
    type: string;
    duration: number;
    status: "Terbit" | "Draft";
    start_time?: string | null;
    end_time?: string | null;
    subject?: { id: number; name: string } | null;
    school_class?: { id: number; name: string } | null;
    questions?: QuizQuestion[];
    my_submission?: QuizSubmission | null;
}

interface KuisPageProps {
    dbQuizzes?: QuizItem[];
}

export default function KuisPage({ dbQuizzes = [] }: KuisPageProps = {}) {
    const [search, setSearch] = useState("");
    const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
    const [answers, setAnswers] = useState<Record<number, { option_id?: number; essay_answer?: string }>>({});
    const [submitting, setSubmitting] = useState(false);

    const openQuiz = (quiz: QuizItem) => {
        setActiveQuiz(quiz);
        const initialAnswers: Record<number, { option_id?: number; essay_answer?: string }> = {};
        quiz.questions?.forEach((q) => {
            initialAnswers[q.id] = q.type === "mcq" ? {} : { essay_answer: "" };
        });
        setAnswers(initialAnswers);
    };

    const submitQuiz = () => {
        if (!activeQuiz) return;
        
        toast.info("Kumpulkan jawaban sekarang? Jawaban tidak dapat diubah setelah dikirim.", {
            action: {
                label: "Ya, Kumpulkan",
                onClick: () => {
                    const payloadAnswers = Object.entries(answers).map(([qId, ans]) => ({
                        question_id: Number(qId),
                        option_id: ans.option_id ?? null,
                        essay_answer: ans.essay_answer ?? null,
                    }));

                    setSubmitting(true);
                    router.post(
                        `/siswa/kuis/${activeQuiz.id}/submit`,
                        { answers: payloadAnswers },
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setActiveQuiz(null);
                                setSubmitting(false);
                            },
                            onError: () => setSubmitting(false),
                        },
                    );
                },
            },
        });
    };

    const filtered = dbQuizzes.filter((quiz) => {
        const query = search.toLowerCase();
        return (
            quiz.title.toLowerCase().includes(query) ||
            (quiz.subject?.name ?? "").toLowerCase().includes(query)
        );
    });

    const completedCount = dbQuizzes.filter((q) => q.my_submission).length;

    return (
        <div className="space-y-6">
            <PageTitle
                eyebrow="ASESMEN & EVALUASI"
                title="Kuis & Ujian Online"
                description="Kerjakan kuis formatif dan ujian sumatif mata pelajaran sesuai jadwal kelas Anda."
            />

            <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                            <ClipboardCheck size={24} />
                        </span>
                        <div>
                            <h2 className="text-base font-extrabold tracking-tight text-[#20272d]">
                                Status Asesmen Anda
                            </h2>
                            <p className="mt-0.5 text-xs text-[#68777c]">
                                {completedCount} dari {dbQuizzes.length} kuis telah diselesaikan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                <Search size={16} className="text-[#68777c]" />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari kuis atau mata pelajaran..."
                    className="w-full bg-transparent text-xs text-[#20282d] outline-none placeholder:text-[#88989e]"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                    <ClipboardCheck size={36} className="text-[#88989e]" />
                    <h3 className="mt-3 text-sm font-bold text-[#20272d]">
                        Belum ada kuis tersedia
                    </h3>
                    <p className="mt-0.5 text-xs text-[#75848a]">
                        Kuis baru akan muncul di sini ketika diterbitkan oleh guru.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((quiz) => {
                        const submitted = Boolean(quiz.my_submission);
                        const mcqCount = quiz.questions?.filter((q) => q.type === "mcq").length ?? 0;
                        const essayCount = quiz.questions?.filter((q) => q.type === "essay").length ?? 0;

                        return (
                            <article
                                key={quiz.id}
                                className="flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] sm:p-6"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="flex items-start gap-4">
                                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                                            <ClipboardCheck size={22} />
                                        </span>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                                                    {quiz.subject?.name ?? "Mata Pelajaran"}
                                                </span>
                                                <span className="rounded-full bg-[#e2e8f0] px-2 py-0.5 text-[10px] font-bold uppercase text-[#475569]">
                                                    {quiz.type}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-extrabold tracking-tight text-[#20272d]">
                                                {quiz.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#68777c]">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock size={12} className="text-[#17345b]" />
                                                    Durasi: {quiz.duration} Menit
                                                </span>
                                                <span>&bull;</span>
                                                <span>
                                                    {mcqCount} Pilihan Ganda &middot; {essayCount} Esei
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {submitted ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#dcebea] px-3.5 py-1 text-xs font-extrabold text-[#087b79]">
                                                <CheckCircle2 size={14} /> Selesai &middot; Skor:{" "}
                                                {quiz.my_submission?.total_score !== null
                                                    ? `${quiz.my_submission?.total_score}`
                                                    : `${quiz.my_submission?.mcq_score} (Menunggu Koreksi)`}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-extrabold text-[#b45309]">
                                                Belum Dikerjakan
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-end border-t border-[#d8e1e8] pt-3.5">
                                    <button
                                        type="button"
                                        onClick={() => openQuiz(quiz)}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition ${
                                            submitted
                                                ? "bg-[#087b79] hover:bg-[#066361]"
                                                : "bg-[#17345b] hover:bg-[#102743]"
                                        }`}
                                    >
                                        <Award size={14} />
                                        {submitted ? "Lihat Hasil / Detail" : "Kerjakan Kuis"}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {activeQuiz && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-[#17345b]/35 p-4"
                    onClick={() => {
                        if (!activeQuiz.my_submission) {
                            if (!window.confirm("Tutup kuis? Jawaban belum dikumpulkan.")) return;
                        }
                        setActiveQuiz(null);
                    }}
                >
                    <div
                        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-[#d8e1e8] pb-4">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#087b79]">
                                    {activeQuiz.subject?.name} &middot; {activeQuiz.type}
                                </span>
                                <h2 className="text-xl font-bold text-[#17345b]">
                                    {activeQuiz.title}
                                </h2>
                                <p className="text-xs text-[#68777c]">
                                    Durasi: {activeQuiz.duration} Menit &middot;{" "}
                                    {activeQuiz.questions?.length ?? 0} Butir Soal
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveQuiz(null)}
                                className="rounded-full p-2 hover:bg-[#dce4e8]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4 flex-1 space-y-6 overflow-y-auto pr-2">
                            {activeQuiz.my_submission && (
                                <div className="rounded-2xl bg-[#dff4ed] p-4 text-xs font-semibold text-[#087b79]">
                                    Anda telah mengumpulkan kuis ini. Skor Pilihan Ganda:{" "}
                                    {activeQuiz.my_submission.mcq_score}, Nilai Esei:{" "}
                                    {activeQuiz.my_submission.essay_score ?? "Belum dikoreksi"}, Total:{" "}
                                    {activeQuiz.my_submission.total_score ?? "Pending"}.
                                    {activeQuiz.my_submission.feedback && (
                                        <p className="mt-1 font-normal">
                                            Feedback Guru: "{activeQuiz.my_submission.feedback}"
                                        </p>
                                    )}
                                </div>
                            )}

                            {activeQuiz.questions?.map((question, index) => (
                                <div
                                    key={question.id}
                                    className="rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-extrabold text-[#17345b]">
                                            Soal #{index + 1} ({question.type.toUpperCase()})
                                        </span>
                                        <span className="text-[11px] font-bold text-[#68777c]">
                                            Bobot: {question.points} Poin
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs font-bold leading-relaxed text-[#20272d]">
                                        {question.question_text}
                                    </p>

                                    {question.type === "mcq" ? (
                                        <div className="mt-3 space-y-2">
                                            {question.options.map((option) => {
                                                const selected =
                                                    answers[question.id]?.option_id === option.id;
                                                return (
                                                    <label
                                                        key={option.id}
                                                        className={`flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-semibold transition ${
                                                            selected
                                                                ? "bg-[#17345b] text-white shadow-sm"
                                                                : "bg-[#e9eef3] text-[#20272d] hover:bg-white/50"
                                                        } ${activeQuiz.my_submission ? "pointer-events-none opacity-80" : "cursor-pointer"}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${question.id}`}
                                                            checked={selected}
                                                            disabled={Boolean(activeQuiz.my_submission)}
                                                            onChange={() =>
                                                                setAnswers((prev) => ({
                                                                    ...prev,
                                                                    [question.id]: {
                                                                        ...prev[question.id],
                                                                        option_id: option.id,
                                                                    },
                                                                }))
                                                            }
                                                            className="accent-[#087b79]"
                                                        />
                                                        <span>{option.option_text}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <textarea
                                                disabled={Boolean(activeQuiz.my_submission)}
                                                value={answers[question.id]?.essay_answer ?? ""}
                                                onChange={(e) =>
                                                    setAnswers((prev) => ({
                                                        ...prev,
                                                        [question.id]: {
                                                            ...prev[question.id],
                                                            essay_answer: e.target.value,
                                                        },
                                                    }))
                                                }
                                                placeholder="Tuliskan jawaban essay Anda di sini..."
                                                className="min-h-24 w-full rounded-xl bg-[#e9eef3] p-3 text-xs text-[#20272d] outline-none disabled:opacity-80"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!activeQuiz.my_submission && (
                            <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#d8e1e8] pt-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveQuiz(null)}
                                    className="rounded-full px-4 py-2 text-xs font-bold text-[#68777c] hover:bg-[#dce4e8]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={submitQuiz}
                                    disabled={submitting}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-6 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#102743] disabled:opacity-50"
                                >
                                    <Send size={14} />
                                    {submitting ? "Mengirim..." : "Kumpulkan Jawaban"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
