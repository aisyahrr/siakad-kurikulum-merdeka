import { useState} from "react";
import {
  Megaphone,
  Search,
  ArrowRight,
  X,
} from "lucide-react";

interface ParentAnnouncement {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  attachmentName?: string;
}

export function PengumumanOrangTuaPage() {
  const [announcements] = useState<ParentAnnouncement[]>([
    {
      id: "1",
      title: "Undangan Rapat Evaluasi Capaian Belajar Tengah Semester (STS)",
      category: "Pertemuan Ortu",
      date: "26 Oktober 2024",
      excerpt: "Mengundang bapak/ibu orang tua/wali murid XII MIPA 1 dalam rangka koordinasi hasil belajar dan penguatan karakter siswa.",
      content: "Yth. Bapak/Ibu Orang Tua/Wali Murid kelas XII MIPA 1, sehubungan dengan berakhirnya masa asesmen Sumatif Tengah Semester (STS) Ganjil, kami mengundang kehadiran Bapak/Ibu pada hari Sabtu, 2 November 2024 pukul 09.00 WIB bertempat di Ruang Kelas XII MIPA 1.",
      attachmentName: "Undangan_Rapat_Wali_Murid_XII_MIPA1.pdf",
    },
    {
      id: "2",
      title: "Kalender Libur Semester Ganjil & Jadwal Pembagian Rapor",
      category: "Akademik",
      date: "20 Oktober 2024",
      excerpt: "Informasi jadwal asesmen akhir semester dan tanggal pembagian rapor digital tahun ajaran 2024/2025.",
      content: "Diberitahukan kepada seluruh orang tua siswa, pelaksanaan SAS akan dimulai tanggal 2–12 Desember 2024. Pembagian lembar rapor dilaksanakan pada 20 Desember 2024.",
      attachmentName: "Kalender_Akademik_2024_2025.pdf",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ParentAnnouncement | null>(null);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="space-y-6">
      <div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
          Portal Informasi Orang Tua
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
          Warta & Edaran Resmi Sekolah
        </h1>
        <p className="mt-0.5 text-xs text-[#68777c]">
          Pemberitahuan agenda resmi sekolah, undangan pertemuan, dan kalender akademik.
        </p>
      </div>

      <div className="flex items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
        <Search size={16} className="text-[#68777c]" />
        <input
          type="text"
          placeholder="Cari pengumuman..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <Megaphone size={20} />
              </span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#17345b]">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-[#68777c]">{item.date}</span>
                </div>
                <h2 className="text-base font-extrabold text-[#20272d]">{item.title}</h2>
                <p className="text-xs text-[#5a6a72] leading-relaxed">{item.excerpt}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#d8e1e8] pt-3">
              {item.attachmentName ? (
                <span className="text-[11px] font-semibold text-[#17345b]">
                  Lampiran: {item.attachmentName}
                </span>
              ) : (
                <span className="text-[11px] text-[#86959c]">Tidak ada berkas</span>
              )}
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-1.5 text-[11px] font-bold text-white shadow transition hover:bg-[#102743]"
              >
                Baca Lengkap <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#17345b]">
                  {selectedItem.category}
                </span>
                <h3 className="mt-2 text-base font-extrabold text-[#17345b]">{selectedItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-4 rounded-2xl bg-[#edf2f6] p-4 text-xs leading-relaxed text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
              {selectedItem.content}
            </p>
            {selectedItem.attachmentName && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#e9eef3] p-3 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                <span className="text-xs font-bold text-[#17345b]">{selectedItem.attachmentName}</span>
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh ${selectedItem.attachmentName}...`)}
                  className="rounded-full bg-[#087b79] px-3 py-1 text-xs font-bold text-white shadow"
                >
                  Unduh PDF
                </button>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}