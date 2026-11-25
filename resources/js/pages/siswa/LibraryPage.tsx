import { Head } from "@inertiajs/react";
import { BookOpen, Search, Download, FileText } from "lucide-react";
import { useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  file_path: string;
}

interface LibraryProps {
  books?: {
    data: Book[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function LibraryPage({ books }: LibraryProps) {
  const [search, setSearch] = useState("");
  const allBooks = books?.data ?? [];

  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head title="Perpustakaan Digital - Siswa" />
      <div className="space-y-6 max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Perpustakaan Digital
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Akses e-book referensi, buku pegangan Kurikulum Merdeka, dan literasi mandiri
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari buku atau pengarang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Belum ada buku tersedia
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Buku elektronik dan modul literasi digital akan segera ditambahkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {book.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Penulis: {book.author}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <FileText className="w-3.5 h-3.5" />
                    <span>E-Book PDF</span>
                  </div>
                  <a
                    href={book.file_path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
