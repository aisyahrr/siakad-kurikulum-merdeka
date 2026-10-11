import { useState, useMemo, useCallback } from "react";

export interface Announcement {
  id: number;
  badgeText: string;
  badgeType: "primary" | "secondary";
  category: "Akademik" | "Ujian & Penilaian" | "Kegiatan Siswa" | "Penting / Mendesak";
  referenceCode: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isRead?: boolean;
  timeAgo?: string;
  title: string;
  date: string;
  author: string;
  readingEstimate?: string;
  targetAudience?: string;
  description: string;
  subDescription?: string;
  requirements?: {
    label: string;
    items: string;
  };
  attachment: {
    fileName: string;
    fileSize: string;
  };
  extraStatus?: {
    type: "verified" | "venue";
    text: string;
  };
  image: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    badgeText: "! PENTING • UJIAN AKHIR",
    badgeType: "primary",
    category: "Ujian & Penilaian",
    referenceCode: "SURAT EDARAN NO. 412/SMAN1/AKAD/2024",
    isPinned: true,
    isArchived: false,
    isRead: false,
    title: "Jadwal & Panduan Pelaksanaan Ujian Akhir Semester (UAS) Ganjil 2024/2025",
    date: "23 Oktober 2024",
    author: "Kurikulum & Akademik",
    readingEstimate: "4 menit",
    description:
      "Diberitahukan kepada seluruh siswa kelas X, XI, dan XII bahwa Ujian Akhir Semester akan diselenggarakan mulai tanggal 25 November hingga 6 Desember 2024 berbasis sistem CBT komputer sekolah. Seluruh siswa diharapkan telah menyelesaikan penuntasan portofolio tugas harian dan memastikan validasi akun akses portal ujian mandiri.",
    subDescription:
      "Kartu tanda peserta wajib dicetak melalui portal akademik mulai tanggal 18 November 2024 dengan stempel pengesahan wali kelas. Keterlambatan toleransi kehadiran sistem CBT adalah 10 menit setelah sesi dimulai.",
    attachment: {
      fileName: "Panduan_UAS_Ganjil_2024.pdf",
      fileSize: "1.8 MB",
    },
    extraStatus: {
      type: "verified",
      text: "Diverifikasi Kepala Sekolah",
    },
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    badgeText: "BEASISWA & PRESTASI",
    badgeType: "secondary",
    category: "Kegiatan Siswa",
    referenceCode: "BIMBINGAN KARIR KELAS XII",
    isArchived: false,
    isRead: false,
    timeAgo: "2 hari yang lalu",
    title: "Sosialisasi SNBP & Pendaftaran Jalur Beasiswa Prestasi Perguruan Tinggi Negeri",
    date: "21 Oktober 2024",
    author: "Bimbingan Konseling (BK)",
    targetAudience: "Khusus Angkatan XII",
    description:
      "Siswa kelas XII yang memenuhi kriteria kuota eligible (40% terbaik) diwajibkan menghadiri sesi pendampingan pengisian PDSS pada hari Sabtu mendatang di Ruang Auditorium Graha Cendekia. Agenda ini membahas strategi pemilihan program studi serta pendaftaran jalur KIP-Kuliah Merdeka 2025.",
    requirements: {
      label: "Syarat Berkas yang Wajib Dibawa:",
      items:
        "Fotokopi Rapor Semester 1–4 legalisir, sertifikat kejuaraan minimal tingkat Kota/Kabupaten, dan Surat Pernyataan Komitmen.",
    },
    attachment: {
      fileName: "Brosur_SNBP_2025.pdf",
      fileSize: "3.2 MB",
    },
    extraStatus: {
      type: "venue",
      text: "Auditorium Utama • 08.00 WIB",
    },
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80",
  },
];

export function useAnnouncements() {
  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<Announcement | null>(null);

  // Toggle bookmark / simpan warta
  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Filter Data
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchTab = activeTab === "active" ? !item.isArchived : item.isArchived;
      const matchCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTab && matchCategory && matchSearch;
    });
  }, [announcements, activeTab, selectedCategory, searchQuery]);

  // Statistik Kategori Terhitung
  const categories = useMemo(() => {
    const list = [
      { label: "Semua", dot: null },
      { label: "Akademik", dot: null },
      { label: "Ujian & Penilaian", dot: null },
      { label: "Kegiatan Siswa", dot: null },
      { label: "Penting / Mendesak", dot: "bg-red-500" },
    ];

    return list.map((cat) => {
      const count =
        cat.label === "Semua"
          ? announcements.length
          : announcements.filter((item) => item.category === cat.label).length;
      return { ...cat, count };
    });
  }, [announcements]);

  const unreadCount = useMemo(() => {
    return announcements.filter((item) => !item.isRead).length;
  }, [announcements]);

  return {
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
  };
}