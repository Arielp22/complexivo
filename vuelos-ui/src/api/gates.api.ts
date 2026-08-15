import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Gate = {
  id: number;
  code: string;
  terminal: string;
  is_available: boolean;
  created_at?: string;
};

export async function listGatesApi() {
  const { data } = await http.get<Paginated<Gate>>("/api/gates/");
  return data;
}

export async function createGateApi(payload: Omit<Gate, "id">) {
  const { data } = await http.post<Gate>("/api/gates/", payload);
  return data;
}

export async function updateGateApi(id: number, payload: Partial<Gate>) {
  const { data } = await http.put<Gate>(`/api/gates/${id}/`, payload);
  return data;
}

export async function deleteGateApi(id: number) {
  await http.delete(`/api/gates/${id}/`);
}