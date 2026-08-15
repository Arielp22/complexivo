import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, Button, Stack, Table,
  TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress
} from "@mui/material";
import { type Flight, listFlightsPublicApi } from "../api/flights.api";
import { type Gate, listGatesApi } from "../api/gates.api";

const STATUS_COLORS: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  SCHEDULED: "default",
  BOARDING: "primary",
  DEPARTED: "success",
  DELAYED: "warning",
  CANCELLED: "error",
};

export default function PublicFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [flightsData, gatesData] = await Promise.all([
        listFlightsPublicApi(),
        listGatesApi(),
      ]);
      setFlights(flightsData.results);
      setGates(gatesData.results);
    } catch {
      setError("No se pudo cargar la información del aeropuerto. ¿Backend encendido?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Vuelos (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {loading && <CircularProgress sx={{ my: 2 }} />}

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Puertas de Embarque (SQL)</Typography>
        <Table size="small" sx={{ mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Terminal</TableCell>
              <TableCell>Disponible</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gates.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{g.id}</TableCell>
                <TableCell>{g.code}</TableCell>
                <TableCell>{g.terminal}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={g.is_available ? "success" : "error"}
                    label={g.is_available ? "Disponible" : "Ocupada"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Typography variant="h6" sx={{ mb: 1 }}>Vuelos (SQL)</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vuelo</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Puerta</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Salida</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell>{f.flight_number}</TableCell>
                <TableCell>{f.destination}</TableCell>
                <TableCell>{f.gate_code ?? f.gate}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={STATUS_COLORS[f.status] ?? "default"}
                    label={f.status}
                  />
                </TableCell>
                <TableCell>{new Date(f.departure_time).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}