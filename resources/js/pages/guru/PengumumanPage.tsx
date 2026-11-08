import { useState, useMemo } from "react";
import {
  Megaphone,
  Search,
  Calendar,
  FileText,
  Download,
  ArrowRight,
  AlertCircle,
  X,
} from "lucide-react";
import { Header } from "./shared";
import { announcements as initialAnnouncements } from "./data";

interface AnnouncementItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content?: string;
  author?: string;
  attachmentName?: string;
  isUrgent?: boolean;
}

export function PengumumanPage() {
  const [items] = useState<AnnouncementItem[]>(() =>
    initialAnnouncements.map((item, idx) => ({
      id: item.id ?? `ann-${idx + 1}`,
      title: item.title,
      category: item.category || (idx % 2 === 0 ? "Akademik" : "Ujian & Asesmen"),
      date: item.date || "24 Oktober 2024",
      excerpt: item.excerpt,
      content:
        item.excerpt +
        " Sehubungan dengan agenda kurikulum merdeka tahun ajaran aktif, seluruh bapak/ibu guru diharapkan menyelesaikan rekapitulasi data tepat waktu melalui SIAKAD.",
      author: "Waka Kurikulum",
      attachmentName: idx % 2 === 0 ? "Surat_Edaran_Pelaksanaan_STS.pdf" : undefined,
      isUrgent: idx === 0,
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeTab, setActiveTab] = useState<"Aktif" | "Arsip">("Aktif");
  const [selectedItem, setSelectedItem] = useState<AnnouncementItem | null>(null);

  const categories = ["Semua", "Akademik", "Ujian & Asesmen", "Kegiatan Guru", "Mendesak"];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === "Semua" ||
        (selectedCategory === "Mendesak" ? item.isUrgent : item.category === selectedCategory);
      return matchSearch && matchCat;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <section className="space-y-6">
      {/* HEADER UTAMA */}
      <Header
        title="Warta & Surat Edaran Akademik"
        description="Pusat informasi resmi sekolah, pengumuman jadwal STS/SAS, dan edaran operasional guru."
      />

      {/* FILTER SEARCH BAR & CATEGORY CHIPS */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* SEARCH INPUT */}
          <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <Search size={16} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari judul warta atau kata kunci..."
              className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* TAB AKTIF VS ARSIP */}
          <div className="flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] sm:self-auto">
            {(["Aktif", "Arsip"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1 text-[11px] font-bold transition ${
                  activeTab === tab
                    ? "bg-[#17345b] text-white shadow-sm"
                    : "text-[#68777c] hover:text-[#17345b]"
                }`}
              >
                {tab === "Aktif" ? "Warta Aktif" : "Arsip Surat"}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                selectedCategory === cat
                  ? "bg-[#087b79] text-white shadow-sm"
                  : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ANNOUNCEMENTS LIST */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6 ${
              item.isUrgent
                ? "shadow-[5px_5px_14px_#cbd3db,-5px_-5px_14px_#fff] border-l-4 border-[#ef4444]"
                : "shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {/* ICON BADGE */}
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] ${
                  item.isUrgent
                    ? "bg-[#fadbd8] text-[#c0392b]"
                    : "bg-[#edf2f6] text-[#17345b]"
                }`}
              >
                <Megaphone size={20} strokeWidth={2.2} />
              </span>

              {/* CONTENT AREA */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                    {item.category}
                  </span>

                  {item.isUrgent && (
                    <span className="rounded-full bg-[#fadbd8] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#c0392b]">
                      Penting
                    </span>
                  )}

                  <span className="text-[#a8b5bc]">•</span>

                  <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#68777c]">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>

                  <span className="text-[#a8b5bc]">•</span>
                  <span className="text-[11px] font-bold text-[#68777c]">
                    Oleh: {item.author ?? "Admin"}
                  </span>
                </div>

                <h2 className="text-base font-extrabold leading-snug tracking-tight text-[#20272d]">
                  {item.title}
                </h2>

                <p className="max-w-3xl text-xs leading-relaxed text-[#5a6a72]">
                  {item.excerpt}
                </p>
              </div>
            </div>

            {/* BOTTOM BAR: LAMPIRAN & BACA DETAIL */}
            <div className="mt-4 flex flex-col gap-3 border-t border-[#d8e1e8] pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {item.attachmentName ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2f6] px-3.5 py-1 text-[11px] font-semibold text-[#5a6a72] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                    <FileText size={13} className="text-[#17345b]" />
                    <span>Lampiran: {item.attachmentName}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#86959c]">Tidak ada berkas lampiran</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="inline-flex items-center gap-1.5 self-end rounded-full bg-[#17345b] px-4 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_5px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
              >
                Baca Lengkap
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <AlertCircle size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada warta atau edaran ditemukan
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Coba sesuaikan kata kunci pencarian atau ganti kategori warta.
          </p>
        </div>
      )}

      {/* MODAL DETAIL BACA WARTA NEUMORPHIC */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-[#e9eef3] p-6 shadow-[10px_10px_25px_#b8c2cc,-10px_-10px_25px_#ffffff] sm:p-7">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-[#d8e1e8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#17345b]">
                    {selectedItem.category}
                  </span>
                  <span className="text-[11px] font-semibold text-[#68777c]">
                    {selectedItem.date}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-extrabold text-[#17345b]">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
              >
                <X size={16} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-[#edf2f6] p-4 text-xs leading-relaxed text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <p>{selectedItem.content}</p>
              </div>

              {/* LAMPIRAN DOKUMEN RESMI JIKA ADA */}
              {selectedItem.attachmentName && (
                <div className="flex items-center justify-between rounded-2xl bg-[#e9eef3] p-3 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
                  <div className="flex items-center gap-2.5">
                    <FileText size={18} className="text-[#087b79]" />
                    <div>
                      <strong className="block text-xs font-bold text-[#20272d]">
                        {selectedItem.attachmentName}
                      </strong>
                      <span className="text-[11px] text-[#68777c]">Dokumen Edaran Resmi (PDF)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Mengunduh ${selectedItem.attachmentName}...`)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#087b79] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#066361]"
                  >
                    <Download size={13} />
                    Unduh
                  </button>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="mt-6 flex justify-end border-t border-[#d8e1e8] pt-3.5">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#102743]"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}