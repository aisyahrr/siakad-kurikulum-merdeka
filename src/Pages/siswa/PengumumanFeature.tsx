import {
  Bell,
  CalendarDays,
  Search,
  Eye,
  Archive,
  Clock,
  Pin,
  Download,
  ShieldCheck,
  Info,
  MapPin,
  Bookmark,
  ArrowRight,
  X,
} from "lucide-react";
import { useAnnouncements } from "@/Hooks/siswa/useAnnouncements";

export function AnnouncementsPage() {
  const {
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    unreadCount,
    filteredAnnouncements,
    bookmarkedIds,
    toggleBookmark,
    activeModalItem,
    setActiveModalItem,
  } = useAnnouncements();

  return (
    <div className="space-y-6">
      {/* =========================================================
          TOP BAR HEADER & STATS CARDS
      ========================================================= */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            <span className="h-2 w-2 rounded-full bg-[#17345b]" />
            <span>Warta Resmi Sekolah</span>
            <span>•</span>
            <span>Tahun Ajaran 2024/2025</span>
          </div>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#17345b] sm:text-4xl">
            Pengumuman Sekolah
          </h1>

          <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#75848a]">
            Pemberitahuan akademik, agenda sekolah, dan informasi kegiatan siswa terpadu.
          </p>
        </div>

        {/* 2 COUNTER CARDS */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#e9eef3] px-5 py-3 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#edf2f6] shadow-[inset_2px_2px_4px_#cbd3db,inset_-2px_-2px_4px_#fff]">
              <Bell size={18} className="text-[#17345b]" />
            </span>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#75848a]">
                Belum Dibaca
              </span>
              <strong className="text-sm font-bold text-[#17345b]">
                {unreadCount} Warta Baru
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl bg-[#e9eef3] px-5 py-3 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#edf2f6] shadow-[inset_2px_2px_4px_#cbd3db,inset_-2px_-2px_4px_#fff]">
              <CalendarDays size={18} className="text-[#17345b]" />
            </span>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#75848a]">
                Batas Agenda Terdekat
              </span>
              <strong className="text-sm font-bold text-[#17345b]">25 Nov 2024</strong>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          SEARCH INPUT & TOGGLE PILLS
      ========================================================= */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* INPUT PENCARIAN */}
        <div className="flex flex-1 items-center gap-3 rounded-full bg-[#e9eef3] px-5 py-3 shadow-[inset_3px_3px_7px_#cbd3db,inset_-3px_-3px_7px_#fff]">
          <Search size={17} className="text-[#68777c]" />
          <input
            type="text"
            className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88979d]"
            placeholder="Cari pengumuman, nomor surat, atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* TOGGLE TAB AKTIF / ARSIP */}
        <div className="flex items-center gap-1 rounded-full bg-[#e9eef3] p-1.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition ${
              activeTab === "active"
                ? "bg-[#edf2f6] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]"
                : "text-[#68777c] hover:text-[#17345b]"
            }`}
          >
            <Eye size={13} className="text-[#17345b]" />
            Aktif Saat Ini
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("archive")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition ${
              activeTab === "archive"
                ? "bg-[#edf2f6] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]"
                : "text-[#68777c] hover:text-[#17345b]"
            }`}
          >
            <Archive size={13} className="text-[#68777c]" />
            Arsip Surat
          </button>
        </div>
      </div>

      {/* =========================================================
          CATEGORY FILTER CHIPS
      ========================================================= */}
      <div className="flex flex-wrap items-center gap-2.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold transition shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff] ${
                isActive
                  ? "bg-[#17345b] text-white"
                  : "bg-[#e9eef3] text-[#55636a] hover:text-[#17345b]"
              }`}
            >
              {cat.dot && <span className={`h-2 w-2 rounded-full ${cat.dot}`} />}
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-[#dce4ea] text-[#607178]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          ANNOUNCEMENT CARDS
      ========================================================= */}
      <div className="space-y-6">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-[32px] bg-[#e9eef3] p-6 shadow-[9px_9px_20px_#cad3db,-9px_-9px_20px_#fff] sm:p-9"
              >
                {/* CORNER ACCENT IF PINNED */}
                {item.isPinned && (
                  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-white/40" />
                )}

                {/* HEADER METADATA */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${
                        item.badgeType === "primary"
                          ? "bg-[#17345b] text-white"
                          : "bg-[#d9e5ef] text-[#17345b]"
                      }`}
                    >
                      {item.badgeText}
                    </span>

                    <span className="text-[11px] font-bold tracking-wider text-[#6d7c82]">
                      {item.referenceCode}
                    </span>
                  </div>

                  {item.isPinned ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6d7c82]">
                      <Pin size={13} className="rotate-45 text-[#17345b]" />
                      Disematkan
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] text-[#78888f]">
                      <Clock size={13} />
                      {item.timeAgo}
                    </span>
                  )}
                </div>

                {/* TITLE */}
                <h2 className="relative z-10 mt-4 max-w-4xl text-2xl font-extrabold leading-snug tracking-tight text-[#17345b] sm:text-[27px]">
                  {item.title}
                </h2>

                {/* SUB INFO */}
                <div className="relative z-10 mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6a7980]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarDays size={14} className="text-[#17345b]" />
                    {item.date}
                  </span>
                  <span>•</span>
                  <span>Oleh: {item.author}</span>
                  {item.readingEstimate && (
                    <>
                      <span>•</span>
                      <span>Estimasi baca: {item.readingEstimate}</span>
                    </>
                  )}
                  {item.targetAudience && (
                    <>
                      <span>•</span>
                      <span>{item.targetAudience}</span>
                    </>
                  )}
                </div>

                {/* MAIN CONTENT + IMAGE SECTION */}
                <div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-[1fr_290px] lg:items-start">
                  <div className="space-y-3.5 text-xs leading-relaxed text-[#49575e] sm:text-sm">
                    <p>{item.description}</p>
                    {item.subDescription && (
                      <p className="text-[#64747b]">{item.subDescription}</p>
                    )}

                    {/* INSET REQUIREMENT BOX */}
                    {item.requirements && (
                      <div className="flex gap-3 rounded-2xl bg-[#dfe7ee] p-4 text-xs shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                        <Info size={16} className="mt-0.5 shrink-0 text-[#17345b]" />
                        <div>
                          <strong className="block font-bold text-[#17345b]">
                            {item.requirements.label}
                          </strong>
                          <p className="mt-0.5 text-[#526067]">{item.requirements.items}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* IMAGE WITH NEUMORPHIC FRAME */}
                  <div className="h-44 w-full overflow-hidden rounded-[24px] bg-[#dfe6ec] p-1.5 shadow-[inset_3px_3px_6px_#cbd3db,inset_-3px_-3px_6px_#fff]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full rounded-[20px] object-cover"
                    />
                  </div>
                </div>

                {/* FOOTER ACTION BAR */}
                <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#d5dee4] pt-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* ATTACHMENT PILL */}
                    <button
                      type="button"
                      onClick={() => alert(`Mengunduh berkas: ${item.attachment.fileName}`)}
                      className="flex items-center gap-2 rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-semibold text-[#29363d] shadow-[inset_2px_2px_4px_#cbd3db,inset_-2px_-2px_4px_#fff] transition hover:text-[#17345b]"
                    >
                      <Download size={14} className="text-[#17345b]" />
                      <span>{item.attachment.fileName}</span>
                      <span className="text-[#75848a]">({item.attachment.fileSize})</span>
                    </button>

                    {/* EXTRA BADGE */}
                    {item.extraStatus && (
                      <span className="flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-2 text-xs font-medium text-[#49575e] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                        {item.extraStatus.type === "verified" ? (
                          <ShieldCheck size={14} className="text-[#17345b]" />
                        ) : (
                          <MapPin size={14} className="text-[#17345b]" />
                        )}
                        {item.extraStatus.text}
                      </span>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(item.id)}
                      aria-label="Bookmark"
                      className={`grid h-10 w-10 place-items-center rounded-full transition hover:-translate-y-0.5 active:translate-y-0 ${
                        isBookmarked
                          ? "bg-[#17345b] text-white shadow-md"
                          : "bg-[#e9eef3] text-[#17345b] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]"
                      }`}
                    >
                      <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModalItem(item)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#17345b] px-5 py-2.5 text-xs font-bold text-white shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#fff] transition hover:bg-[#0f233d] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Baca Selengkapnya
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* EMPTY STATE */
          <div className="rounded-[32px] bg-[#e9eef3] p-12 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <Bell size={36} className="mx-auto text-[#75848a] opacity-40" />
            <h3 className="mt-3 text-base font-bold text-[#17345b]">Tidak ada pengumuman ditemukan</h3>
            <p className="mt-1 text-xs text-[#75848a]">
              Silakan periksa kata kunci pencarian Anda atau sesuaikan filter kategori di atas.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL BACA LENGKAP PENGUMUMAN
      ========================================================= */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-[#d5dee4] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#17345b]">
                  {activeModalItem.referenceCode}
                </span>
                <h3 className="mt-1 text-lg font-bold text-[#17345b]">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-[#64748b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-1 text-xs text-[#49575e]">
              <p className="leading-relaxed">{activeModalItem.description}</p>
              {activeModalItem.subDescription && (
                <p className="leading-relaxed">{activeModalItem.subDescription}</p>
              )}
              {activeModalItem.requirements && (
                <div className="rounded-2xl bg-[#dfe7ee] p-4 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                  <strong className="block text-[#17345b]">{activeModalItem.requirements.label}</strong>
                  <p className="mt-1">{activeModalItem.requirements.items}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#d5dee4] pt-4">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="rounded-full bg-[#e9eef3] px-5 py-2 text-xs font-semibold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => alert(`Mengunduh ${activeModalItem.attachment.fileName}...`)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow"
              >
                <Download size={13} />
                Unduh Lampiran PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}