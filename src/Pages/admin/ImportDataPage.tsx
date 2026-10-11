import { useState, useMemo } from "react";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  Database,
} from "lucide-react";

type ImportTarget = "siswa" | "guru" | "rombel";

interface ParsedRowPreview {
  id: string;
  col1: string; // Nama
  col2: string; // NISN / NIP / Kode
  col3: string; // Rombel / Mapel / Tingkat
  col4: string; // Gender / Status / Wali
  isValid: boolean;
  errorNote?: string;
}

export function ImportDataPage() {
  const [targetType, setTargetType] = useState<ImportTarget>("siswa");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRowPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");

  const targetConfigs: Record<
    ImportTarget,
    {
      label: string;
      templateName: string;
      columns: string[];
      sampleData: ParsedRowPreview[];
    }
  > = {
    siswa: {
      label: "Buku Induk Siswa",
      templateName: "template_import_siswa.csv",
      columns: [
        "Nama Lengkap",
        "NISN (10 Digit)",
        "Rombel Sasaran",
        "Jenis Kelamin (L/P)",
      ],
      sampleData: [
        {
          id: "1",
          col1: "Ahmad Rizky Pratama",
          col2: "0064928121",
          col3: "XII MIPA 1",
          col4: "L",
          isValid: true,
        },
        {
          id: "2",
          col2: "0064928122",
          col1: "Bella Safitri",
          col3: "XII MIPA 1",
          col4: "P",
          isValid: true,
        },
        {
          id: "3",
          col1: "Cahyo Utomo",
          col2: "006492",
          col3: "XII MIPA 1",
          col4: "L",
          isValid: false,
          errorNote: "NISN kurang dari 10 digit",
        },
        {
          id: "4",
          col1: "Dinda Kirana",
          col2: "0064928124",
          col3: "XII MIPA 1",
          col4: "P",
          isValid: true,
        },
      ],
    },
    guru: {
      label: "Data Pendidik (Guru)",
      templateName: "template_import_guru.csv",
      columns: [
        "Nama Lengkap & Gelar",
        "NIP (18 Digit)",
        "Mata Pelajaran Utama",
        "Status Kepegawaian",
      ],
      sampleData: [
        {
          id: "1",
          col1: "Rahmat Hidayat, M.Kom",
          col2: "198802142014031002",
          col3: "Informatika",
          col4: "PNS",
          isValid: true,
        },
        {
          id: "2",
          col1: "Nurul Aini, S.Pd",
          col2: "199205112020122005",
          col3: "Sosiologi",
          col4: "PPPK",
          isValid: true,
        },
      ],
    },
    rombel: {
      label: "Rombongan Belajar (Rombel)",
      templateName: "template_import_rombel.csv",
      columns: [
        "Nama Rombel",
        "Tingkat / Fase",
        "Jurusan / Peminatan",
        "Kapasitas Kursi",
      ],
      sampleData: [
        {
          id: "1",
          col1: "XII MIPA 2",
          col2: "Fase F (Kelas 12)",
          col3: "MIPA",
          col4: "36 Siswa",
          isValid: true,
        },
        {
          id: "2",
          col1: "XI IPS 2",
          col2: "Fase F (Kelas 11)",
          col3: "IPS",
          col4: "36 Siswa",
          isValid: true,
        },
      ],
    },
  };

  const currentConfig = targetConfigs[targetType];

  const validCount = useMemo(
    () => parsedRows.filter((r) => r.isValid).length,
    [parsedRows],
  );
  const invalidCount = useMemo(
    () => parsedRows.filter((r) => !r.isValid).length,
    [parsedRows],
  );

  const handleSimulatedUpload = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);

    setTimeout(() => {
      setParsedRows(currentConfig.sampleData);
      setIsProcessing(false);
      setFeedback(
        `Berkas "${file.name}" berhasil dibaca. Silakan telaah pratinjau data.`,
      );
    }, 600);
  };

  const handleDownloadTemplate = () => {
    const csvContent = `${currentConfig.columns.join(",")}\n`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", currentConfig.templateName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCommitImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setFeedback(
        `Berhasil mengimpor ${validCount} baris data ke dalam database akademik.`,
      );
      setParsedRows([]);
      setSelectedFile(null);
      setTimeout(() => setFeedback(""), 4000);
    }, 800);
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Database Pipeline • Integrasi Berkas Massal
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Bulk Import Data Akademik
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Unggah dan sinkronkan data siswa, guru, serta rombel secara massal
            via format CSV atau Excel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] transition hover:text-[#102743] sm:self-auto"
        >
          <Download size={14} />
          Unduh Template {currentConfig.label}
        </button>
      </div>

      {/* TOP TARGET SELECTION CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(["siswa", "guru", "rombel"] as ImportTarget[]).map((type) => {
          const cfg = targetConfigs[type];
          const isSelected = targetType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                setTargetType(type);
                setSelectedFile(null);
                setParsedRows([]);
              }}
              className={`rounded-2xl p-4 text-left transition-all ${
                isSelected
                  ? "bg-[#17345b] text-white shadow-[4px_4px_10px_#cbd3db]"
                  : "bg-[#e9eef3] text-[#20272d] shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet
                  size={22}
                  className={isSelected ? "text-[#93c5fd]" : "text-[#17345b]"}
                />
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#dbe8f5] text-[#17345b]"
                  }`}
                >
                  {type}
                </span>
              </div>
              <strong className="mt-3 block text-sm font-extrabold">
                {cfg.label}
              </strong>
              <span
                className={`text-[11px] ${isSelected ? "text-slate-300" : "text-[#718086]"}`}
              >
                Format CSV / XLSX Terstruktur
              </span>
            </button>
          );
        })}
      </div>

      {/* FEEDBACK ALERT */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* DRAG & DROP FILE UPLOAD AREA */}
      <div className="rounded-[28px] bg-[#e9eef3] p-6 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-8">
        <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#b8c6cf] bg-[#edf2f6] p-8 text-center shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] cursor-pointer transition hover:border-[#17345b]">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
            <Upload size={24} />
          </div>
          <strong className="mt-3 text-sm font-extrabold text-[#20272d]">
            Pilih berkas CSV atau seret ke area ini
          </strong>
          <span className="mt-0.5 text-xs text-[#68777c]">
            Target Impor: <b>{currentConfig.label}</b> (Maksimal 5MB per berkas)
          </span>

          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleSimulatedUpload(e.target.files[0]);
              }
            }}
          />
        </label>

        {selectedFile && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#e9eef3] p-3 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-[#087b79]" />
              <div>
                <strong className="block text-xs font-bold text-[#20272d]">
                  {selectedFile.name}
                </strong>
                <span className="text-[10px] text-[#68777c]">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Siap diproses
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setParsedRows([]);
              }}
              className="text-[#c0392b] hover:text-[#991b1b]"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* PRATINJAU DATA HASIL PARSE */}
      {parsedRows.length > 0 && (
        <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7 space-y-4">
          <div className="flex flex-col gap-2 pb-4 border-b border-[#d8e1e8] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#17345b]">
                Pratinjau & Validasi Baris Data ({parsedRows.length} Baris
                Terdeteksi)
              </h2>
              <span className="text-[11px] text-[#68777c]">
                Baris bertanda merah wajib diperbaiki di berkas sumber sebelum
                diimpor.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#dcebea] px-2.5 py-0.5 text-[10px] font-bold text-[#087b79]">
                {validCount} Siap Impor
              </span>
              {invalidCount > 0 && (
                <span className="rounded-full bg-[#fadbd8] px-2.5 py-0.5 text-[10px] font-bold text-[#c0392b]">
                  {invalidCount} Galat Validasi
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                  <th className="py-2.5 px-3">{currentConfig.columns[0]}</th>
                  <th className="py-2.5 px-3">{currentConfig.columns[1]}</th>
                  <th className="py-2.5 px-2 text-center">
                    {currentConfig.columns[2]}
                  </th>
                  <th className="py-2.5 px-2 text-center">
                    {currentConfig.columns[3]}
                  </th>
                  <th className="py-2.5 px-3 text-center">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce4ea] text-xs">
                {parsedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition ${row.isValid ? "hover:bg-white/30" : "bg-[#fadbd8]/40"}`}
                  >
                    <td className="py-3 px-3 font-bold text-[#20272d]">
                      {row.col1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#17345b]">
                      {row.col2}
                    </td>
                    <td className="py-3 px-2 text-center font-medium text-[#68777c]">
                      {row.col3}
                    </td>
                    <td className="py-3 px-2 text-center font-medium text-[#68777c]">
                      {row.col4}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#dcebea] px-2 py-0.5 text-[10px] font-bold text-[#087b79]">
                          <CheckCircle2 size={11} /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fadbd8] px-2 py-0.5 text-[10px] font-bold text-[#c0392b]">
                          <AlertTriangle size={11} /> {row.errorNote}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* COMMIT ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-[#d8e1e8]">
            <span className="text-[11px] text-[#68777c]">
              Hanya {validCount} baris valid yang akan dimasukkan ke database.
            </span>

            <button
              type="button"
              disabled={validCount === 0 || isProcessing}
              onClick={handleCommitImport}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-6 py-2.5 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] disabled:opacity-50"
            >
              <Database size={14} />
              {isProcessing
                ? "Menyimpan ke Database..."
                : `Eksekusi Impor (${validCount} Baris)`}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
