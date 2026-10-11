import { useState } from "react";
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
import { student } from "../../constants/dummy/student";
import { PageTitle } from "@/Components/ui/PageTitle";

export function ProfilePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const studentDetails = [
    { label: "Nomor Induk Siswa Nasional (NISN)", value: student.nisn, icon: IdCard, copyable: true },
    { label: "Nomor Induk Sekolah (NIS)", value: student.nis || "212210045", icon: Fingerprint, copyable: true },
    { label: "Rombongan Belajar (Kelas)", value: student.className, icon: School },
    { label: "Jurusan / Peminatan", value: "MIPA (Matematika & Ilmu Alam)", icon: GraduationCap },
    { label: "Tahun Masuk / Angkatan", value: "2022 / 2023 (Tingkat XII)", icon: Calendar },
    { label: "Status Registrasi Dapodik", value: "Aktif Terdata", icon: UserCheck, isStatus: true },
  ];

  const personalData = [
    { label: "Tempat, Tanggal Lahir", value: "Surabaya, 14 Mei 2007" },
    { label: "Jenis Kelamin", value: "Laki-laki" },
    { label: "Agama", value: "Islam" },
    { label: "Alamat Domisili", value: "Jl. Ketintang Baru No. 42, Gayungan, Surabaya" },
  ];

  const guardianInfo = [
    { label: "Wali Kelas Pengampu", value: student.homeroomTeacher, sub: "NIP. 19740512 199903 2 001" },
    { label: "Nama Orang Tua / Wali", value: "H. Hendra Rahardjo, S.E.", sub: "Ayah Kandung" },
    { label: "Nomor Kontak Darurat", value: "+62 812-3456-7890", sub: "WhatsApp Aktif" },
  ];

  return (
    <div className="space-y-7">
      {/* =========================================================
          PAGE TITLE
      ========================================================= */}
      <PageTitle
        eyebrow="AKUN & IDENTITAS SISWA"
        title="Profil Akademik"
        description="Informasi data diri, status administrasi Dapodik, dan kredensial peserta didik terdaftar."
      />

      {/* =========================================================
          HERO PROFILE CARD (NEUMORPHISM WITH ORNAMENT)
      ========================================================= */}
      <div className="relative overflow-hidden rounded-[34px] bg-[#e9eef3] p-6 shadow-[9px_9px_22px_#cbd3db,-9px_-9px_22px_#fff] sm:p-9">
        {/* CORNER EMBOSSED WATERMARK */}
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full border-[32px] border-white/40" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* AVATAR & BASIC IDENTIFICATION */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="h-28 w-28 overflow-hidden rounded-[28px] bg-[#dfe6ec] p-1.5 shadow-[inset_3px_3px_6px_#cbd3db,inset_-3px_-3px_6px_#fff]">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
                  alt={student.name}
                  className="h-full w-full rounded-[22px] object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#17345b] text-white shadow-[2px_2px_5px_#cbd3db]">
                <ShieldCheck size={16} />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#dbe8f5] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                  Siswa Reguler
                </span>
                <span className="rounded-full bg-[#e9eef3] px-3 py-1 text-[10px] font-bold text-[#087b79] shadow-[inset_1px_1px_3px_#cbd3db,inset_-1px_-1px_3px_#fff]">
                  ● Terverifikasi Dapodik
                </span>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-[#17345b] sm:text-3xl">
                {student.name}
              </h2>

              <p className="text-xs font-semibold text-[#68777c]">
                NISN: <span className="font-bold text-[#20272d]">{student.nisn}</span> • {student.className}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#5f6f76]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} className="text-[#17345b]" />
                  {student.email || "ahmad.rayhan@student.lentera.sch.id"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} className="text-[#17345b]" />
                  +62 821-4402-9981
                </span>
              </div>
            </div>
          </div>

          {/* QUICK ACADEMIC BADGES */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-[#edf2f6] p-3.5 shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9eef3] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <Award size={18} />
              </span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
                  IPK Kumulatif
                </span>
                <strong className="text-base font-extrabold text-[#17345b]">
                  {student.gpa} <small className="text-xs font-normal text-[#68777c]">/ 100</small>
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#edf2f6] p-3.5 shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9eef3] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <Sparkles size={18} />
              </span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
                  Peringkat Kelas
                </span>
                <strong className="text-base font-extrabold text-[#20272d]">
                  #{student.rank} <small className="text-xs font-normal text-[#68777c]">dari 36</small>
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN CONTENT GRID: DATA AKADEMIK & KEPENDUDUKAN
      ========================================================= */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* LEFT COLUMN: IDENTITAS RESMI SEKOLAH */}
        <div className="space-y-6">
          <div className="rounded-[32px] bg-[#e9eef3] p-6 shadow-[8px_8px_18px_#cbd3db,-8px_-8px_18px_#fff] sm:p-8">
            <div className="flex items-center justify-between border-b border-[#d4dde1] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#17345b]">Data Pokok Pendidikan (Dapodik)</h3>
                <p className="text-xs text-[#75848a]">Nomor registrasi identitas siswa aktif nasional</p>
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
                      <b className={`text-sm font-extrabold ${item.isStatus ? "text-[#087b79]" : "text-[#20272d]"}`}>
                        {item.value}
                      </b>

                      {item.copyable && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.value, item.label)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:scale-105 active:scale-95"
                          title="Salin ke clipboard"
                        >
                          {copiedKey === item.label ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
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
                <h3 className="text-base font-bold text-[#17345b]">Biodata Pribadi & Kependudukan</h3>
                <p className="text-xs text-[#75848a]">Sesuai Kartu Keluarga & Akta Kelahiran</p>
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
                  <span className="block text-[10px] font-semibold text-[#68777c]">{d.label}</span>
                  <b className="mt-1 block text-sm font-bold text-[#20272d]">{d.value}</b>
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
                <span className="text-[10px] font-bold tracking-widest text-[#93b3d8]">KARTU PELAJAR DIGITAL</span>
                <h4 className="text-sm font-extrabold tracking-tight">SMA LENTERA NUSANTARA</h4>
              </div>
              <School size={20} className="text-[#93b3d8]" />
            </div>

            <div className="my-6 flex items-center justify-between">
              <div>
                <strong className="block text-lg font-bold">{student.name}</strong>
                <p className="text-xs font-mono text-[#cbd9ea]">NISN. {student.nisn}</p>
                <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold">
                  {student.className}
                </span>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white p-1 text-[#17345b] shadow-md">
                <QrCode size={46} />
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/15 pt-3 text-[10px] text-[#cbd9ea]">
              <span>Masa Berlaku: 2024/2025</span>
              <span className="font-semibold text-emerald-400">● RFID SMART PASS AKTIF</span>
            </div>
          </div>

          {/* INFORMASI WALI & KONTAK DARURAT */}
          <div className="rounded-[32px] bg-[#e9eef3] p-6 shadow-[8px_8px_18px_#cbd3db,-8px_-8px_18px_#fff]">
            <h3 className="text-base font-bold text-[#17345b]">Pengampu & Kontak Darurat</h3>
            <p className="text-xs text-[#75848a]">Pihak wali terdaftar dalam sistem akademik</p>

            <div className="mt-4 space-y-3">
              {guardianInfo.map((g) => (
                <div
                  key={g.label}
                  className="rounded-2xl bg-[#edf2f6] p-3.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]"
                >
                  <span className="text-[10px] font-semibold text-[#68777c]">{g.label}</span>
                  <b className="mt-0.5 block text-xs font-bold text-[#20272d]">{g.value}</b>
                  <small className="text-[10px] text-[#78888f]">{g.sub}</small>
                </div>
              ))}
            </div>
          </div>

          {/* SECURITY & QUICK ACTION BUTTONS */}
          <div className="rounded-[32px] bg-[#e9eef3] p-6 shadow-[8px_8px_18px_#cbd3db,-8px_-8px_18px_#fff]">
            <h3 className="text-base font-bold text-[#17345b]">Keamanan & Berkas</h3>

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#17345b] px-5 py-3 text-xs font-bold text-white shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff] transition hover:bg-[#102743] hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download size={14} /> Unduh Surat Keterangan Aktif (PDF)
              </button>

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e9eef3] px-5 py-3 text-xs font-bold text-[#17345b] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff] transition hover:-translate-y-0.5 active:translate-y-0"
              >
                <KeyRound size={14} /> Ganti Kata Sandi Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}