import { useState } from "react";
import { usePage } from "@inertiajs/react";
import {
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  School,
  IdCard,
  KeyRound,
  Download,
  Copy,
  Check,
  GraduationCap,
  Award,
  Sparkles,
  QrCode,
  Fingerprint,
} from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";

interface SharedData {
  auth: {
    user: {
      name: string;
      email: string;
      student?: {
        id: number;
        nisn: string;
        nis: string;
        gender: string;
        birth_place: string;
        birth_date: string;
        religion: string;
        address: string;
        parent_name: string;
        parent_phone: string;
        entry_year: string;
        school_class?: {
          name: string;
        };
      } | null;
    };
  };
}

export default function ProfilePage() {
  const { auth } = usePage<SharedData>().props;
  const student = auth.user.student;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const studentDetails = [
    {
      label: "Nomor Induk Siswa Nasional (NISN)",
      value: student?.nisn ?? "-",
      icon: IdCard,
      copyable: true,
    },
    {
      label: "Nomor Induk Sekolah (NIS)",
      value: student?.nis ?? "-",
      icon: Fingerprint,
      copyable: true,
    },
    {
      label: "Jurusan / Peminatan",
      value: "MIPA (Matematika & Ilmu Alam)",
      icon: GraduationCap,
    },
    {
      label: "Tahun Masuk / Angkatan",
      value: student?.entry_year ?? "-",
      icon: Calendar,
    },
    {
      label: "Status Registrasi Dapodik",
      value: "Aktif Terdata",
      icon: UserCheck,
      isStatus: true,
    },
  ];

  const personalData = [
    { label: "Tempat, Tanggal Lahir", value: `${student?.birth_place ?? "-"}, ${student?.birth_date ?? "-"}` },
    { label: "Jenis Kelamin", value: student?.gender === "L" ? "Laki-laki" : "Perempuan" },
    { label: "Agama", value: student?.religion ?? "-" },
    {
      label: "Alamat Domisili",
      value: student?.address ?? "-",
    },
  ];

  const guardianInfo = [
    {
      label: "Nama Orang Tua / Wali",
      value: student?.parent_name ?? "-",
      sub: "Ayah/Ibu/Wali",
    },
    {
      label: "Nomor Kontak Darurat",
      value: student?.parent_phone ?? "-",
      sub: "WhatsApp Aktif",
    },
  ];

  return (
    <div className="space-y-7">
      <PageTitle
        eyebrow="AKUN & IDENTITAS SISWA"
        title="Profil Akademik"
        description="Informasi data diri, status administrasi Dapodik, dan kredensial peserta didik terdaftar."
      />

      {/* HERO PROFILE CARD */}
      <div className="relative overflow-hidden rounded-[34px] bg-[#e9eef3] p-6 shadow-[9px_9px_22px_#cbd3db,-9px_-9px_22px_#fff] sm:p-9">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="h-28 w-28 overflow-hidden rounded-[28px] bg-[#dfe6ec] p-1.5 shadow-[inset_3px_3px_6px_#cbd3db,inset_-3px_-3px_6px_#fff]">
                <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#17345b] text-3xl font-bold text-white">
                  {auth.user.name?.[0] ?? "S"}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#17345b] text-white shadow-[2px_2px_5px_#cbd3db]">
                <ShieldCheck size={16} />
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#17345b] sm:text-3xl">
                {auth.user.name}
              </h2>
              <p className="text-xs font-semibold text-[#68777c]">
                NISN: <span className="font-bold text-[#20272d]">{student?.nisn ?? "-"}</span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#5f6f76]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} className="text-[#17345b]" />
                  {auth.user.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} className="text-[#17345b]" />
                  {student?.parent_phone ?? "+62 821-4402-9981"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID: DATA AKADEMIK & KEPENDUDUKAN */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* LEFT COLUMN: IDENTITAS RESMI SEKOLAH */}
        <div className="space-y-6">
          <div className="rounded-[32px] bg-[#e9eef3] p-6 shadow-[8px_8px_18px_#cbd3db,-8px_-8px_18px_#fff] sm:p-8">
            <div className="flex items-center justify-between border-b border-[#d4dde1] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#17345b]">
                  Data Pokok Pendidikan (Dapodik)
                </h3>
                <p className="text-xs text-[#75848a]">
                  Nomor registrasi identitas siswa aktif nasional
                </p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <IdCard size={15} />
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {studentDetails.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex flex-col justify-between rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#68777c]">
                        {item.label}
                      </span>
                      <Icon size={14} className="shrink-0 text-[#17345b]" />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <b
                        className={`text-sm font-extrabold ${item.isStatus ? "text-[#087b79]" : "text-[#20272d]"}`}
                      >
                        {item.value}
                      </b>

                      {item.copyable && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.value, item.label)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:scale-105 active:scale-95"
                          title="Salin ke clipboard"
                        >
                          {copiedKey === item.label ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BIODATA PRIBADI */}
          <div className="rounded-[32px] bg-[#e9eef3] p-6 shadow-[8px_8px_18px_#cbd3db,-8px_-8px_18px_#fff] sm:p-8">
            <div className="flex items-center justify-between border-b border-[#d4dde1] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#17345b]">
                  Biodata Pribadi & Kependudukan
                </h3>
                <p className="text-xs text-[#75848a]">
                  Sesuai Kartu Keluarga & Akta Kelahiran
                </p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <Fingerprint size={15} />
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {personalData.map((d) => (
                <div
                  key={d.label}
                  className="rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]"
                >
                  <span className="block text-[10px] font-semibold text-[#68777c]">
                    {d.label}
                  </span>
                  <b className="mt-1 block text-sm font-bold text-[#20272d]">
                    {d.value}
                  </b>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WALI & DIGITAL SMART CARD */}
        <div className="space-y-6">
          {/* DIGITAL STUDENT CARD SIMULATION */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#17345b] to-[#0f233d] p-6 text-white shadow-[8px_8px_18px_#cbd3db,-8px_-8px_18px_#fff]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-8 border-white/10" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#93b3d8]">
                  KARTU PELAJAR DIGITAL
                </span>
                <h4 className="text-sm font-extrabold tracking-tight">
                  SIAKAD KURIKULUM MERDEKA
                </h4>
              </div>
              <School size={20} className="text-[#93b3d8]" />
            </div>

            <div className="my-6 flex items-center justify-between">
              <div>
                <strong className="block text-lg font-bold">
                  {auth.user.name}
                </strong>
                <p className="text-xs font-mono text-[#cbd9ea]">
                  NISN. {student?.nisn ?? "-"}
                </p>
                <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold">
                  {student?.school_class?.name ?? "Siswa Aktif"}
                </span>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white p-1 text-[#17345b] shadow-md">
                <QrCode size={46} />
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/15 pt-3 text-[10px] text-[#cbd9ea]">
              <span>Status: Terverifikasi</span>
              <span className="font-semibold text-emerald-400">
                ● SMART PASS AKTIF
              </span>
            </div>
          </div>

          {/* INFORMASI WALI & KONTAK DARURAT */}
          <div className="rounded-[32px] bg-[#e9eef3] p-6 shadow-[8px_8px_18px_#cbd3db,-8px_-8px_18px_#fff]">
            <h3 className="text-base font-bold text-[#17345b]">
              Pengampu & Kontak Darurat
            </h3>
            <p className="text-xs text-[#75848a]">
              Pihak wali terdaftar dalam sistem akademik
            </p>

            <div className="mt-4 space-y-3">
              {guardianInfo.map((g) => (
                <div
                  key={g.label}
                  className="rounded-2xl bg-[#edf2f6] p-3.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]"
                >
                  <span className="text-[10px] font-semibold text-[#68777c]">
                    {g.label}
                  </span>
                  <b className="mt-0.5 block text-xs font-bold text-[#20272d]">
                    {g.value}
                  </b>
                  <small className="text-[10px] text-[#78888f]">{g.sub}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
