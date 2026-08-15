import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem, Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesApi } from "../api/gates.api";
import {
  type Flight, listFlightsAdminApi, createFlightApi, updateFlightApi, deleteFlightApi
} from "../api/flights.api";

const STATUS_OPTIONS = ["SCHEDULED", "BOARDING", "DEPARTED", "DELAYED", "CANCELLED"];

const STATUS_COLORS: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  SCHEDULED: "default",
  BOARDING: "primary",
  DEPARTED: "success",
  DELAYED: "warning",
  CANCELLED: "error",
};

export default function AdminFlightsPage() {
  const [items, setItems] = useState<Flight[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [gate, setGate] = useState<number>(0);
  const [flightNumber, setFlightNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("SCHEDULED");
  const [departureTime, setDepartureTime] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listFlightsAdminApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar vuelos. ¿Login? ¿Token admin?");
    }
  };

  const loadGates = async () => {
    try {
      const data = await listGatesApi();
      setGates(data.results);
      if (!gate && data.results.length > 0) setGate(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadGates(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!gate) return setError("Seleccione una puerta");
      if (!flightNumber.trim() || !destination.trim()) return setError("Vuelo y destino son requeridos");
      if (!departureTime) return setError("Fecha de salida requerida");

      const payload = {
        gate: Number(gate),
        flight_number: flightNumber.trim(),
        destination: destination.trim(),
        status,
        departure_time: new Date(departureTime).toISOString(),
      };

      if (editId) await updateFlightApi(editId, payload);
      else await createFlightApi(payload as any);

      setEditId(null);
      setFlightNumber("");
      setDestination("");
      setStatus("SCHEDULED");
      setDepartureTime("");
      await load();
    } catch {
      setError("No se pudo guardar vuelo. ¿Token admin?");
    }
  };

  const startEdit = (f: Flight) => {
    setEditId(f.id);
    setGate(f.gate);
    setFlightNumber(f.flight_number);
    setDestination(f.destination);
    setStatus(f.status);
    setDepartureTime(f.departure_time);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteFlightApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vuelo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vuelos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 180 }}>
              <InputLabel id="gate-label">Puerta</InputLabel>
              <Select
                labelId="gate-label"
                label="Puerta"
                value={gate}
                onChange={(e) => setGate(Number(e.target.value))}
              >
                {gates.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.code} (T{g.terminal}) #{g.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Número vuelo" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} fullWidth />
            <TextField label="Destino" value={destination} onChange={(e) => setDestination(e.target.value)} fullWidth />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 220 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                label="Estado"
                value={status}
                onChange={(e) => setStatus(String(e.target.value))}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Fecha/hora salida"
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              sx={{ width: 280 }}
              InputLabelProps={{ shrink: true }}
            />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setFlightNumber(""); setDestination(""); setStatus("SCHEDULED"); setDepartureTime(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadGates(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vuelo</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Puerta</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Salida</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell>{f.flight_number}</TableCell>
                <TableCell>{f.destination}</TableCell>
                <TableCell>{f.gate_code ?? f.gate}</TableCell>
                <TableCell>
                  <Chip size="small" color={STATUS_COLORS[f.status] ?? "default"} label={f.status} />
                </TableCell>
                <TableCell>{new Date(f.departure_time).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(f)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(f.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}