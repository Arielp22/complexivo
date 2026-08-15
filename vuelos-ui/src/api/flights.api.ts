import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Flight = {
  id: number;
  gate: number;
  gate_code?: string;
  flight_number: string;
  destination: string;
  status: string;
  departure_time: string;
  created_at?: string;
};

export async function listFlightsPublicApi() {
  const { data } = await http.get<Paginated<Flight>>("/api/flights/");
  return data;
}

export async function listFlightsAdminApi() {
  const { data } = await http.get<Paginated<Flight>>("/api/flights/");
  return data;
}

export async function createFlightApi(payload: Omit<Flight, "id">) {
  const { data } = await http.post<Flight>("/api/flights/", payload);
  return data;
}

export async function updateFlightApi(id: number, payload: Partial<Flight>) {
  const { data } = await http.put<Flight>(`/api/flights/${id}/`, payload);
  return data;
}

export async function deleteFlightApi(id: number) {
  await http.delete(`/api/flights/${id}/`);
}