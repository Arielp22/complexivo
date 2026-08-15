import { Container, Paper, Typography, Stack } from "@mui/material";

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h5">Examen Frontend — Airport UI</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          SPA React + TypeScript + MUI + Router. Consume la API del examen
          (DRF paginado): embarque (SQL) y vuelos (SQL + eventos Mongo).
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Flujo: Pantalla pública de vuelos → Login → Admin (Panel) → CRUD Gates / Flights.
        </Typography>
      </Paper>
    </Container>
  );
}