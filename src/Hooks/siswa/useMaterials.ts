import { useCallback, useEffect, useMemo, useState } from "react";
import { materialService } from "@/Services/material.service";
import type { Material, MaterialFilters } from "@/Types/siswa/material.types";

const initialFilters: MaterialFilters = {
  type: "Semua Materi",
  semester: "Semester Ganjil",
  subject: "Semua Mata Pelajaran",
};

export function useMaterials() {
  const [items, setItems] = useState<Material[]>([]);
  const [filters, setFilters] = useState<MaterialFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setItems(await materialService.list());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat materi");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (filters.type === "Semua Materi" || item.type === filters.type) &&
          item.semester === filters.semester &&
          (filters.subject === "Semua Mata Pelajaran" ||
            item.category === filters.subject),
      ),
    [filters, items],
  );

  const updateFilters = <K extends keyof MaterialFilters>(
    key: K,
    value: MaterialFilters[K],
  ) => setFilters((current) => ({ ...current, [key]: value }));
  return {
    items,
    filteredItems,
    filters,
    updateFilters,
    isLoading,
    error,
    reload: load,
  };
}
