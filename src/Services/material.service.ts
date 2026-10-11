import { api } from "@/Services/api";
import { materials as dummyMaterials } from "@/data/siswa/materials.data";
import type { Material } from "@/Types/siswa/material.types";

const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export const materialService = {
  list: () => useMockData ? Promise.resolve(dummyMaterials) : api<Material[]>("/materials"),
  get: (id: string) => useMockData ? Promise.resolve(dummyMaterials.find((item) => item.id === id) ?? null) : api<Material>(`/materials/${id}`),
  create: (payload: Omit<Material, "id">) => useMockData ? Promise.resolve({ ...payload, id: crypto.randomUUID() }) : api<Material>("/materials", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: Partial<Material>) => useMockData ? Promise.resolve({ ...dummyMaterials.find((item) => item.id === id), ...payload, id } as Material) : api<Material>(`/materials/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id: string) => useMockData ? Promise.resolve(id) : api<void>(`/materials/${id}`, { method: "DELETE" }),
};
