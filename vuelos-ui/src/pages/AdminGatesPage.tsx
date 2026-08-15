import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControlLabel, Switch, Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesApi, createGateApi, updateGateApi, deleteGateApi } from "../api/gates.api";

export default function AdminGatesPage() {
  const [items, setItems] = useState<Gate[]>([]);
  const [code, setCode] = useState("");
  const [terminal, setTerminal] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listGatesApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar puertas. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!code.trim()) return setError("Código requerido");
      if (!terminal.trim()) return setError("Terminal requerida");

      const payload = { code: code.trim(), terminal: terminal.trim(), is_available: isAvailable };

      if (editId) await updateGateApi(editId, payload);
      else await createGateApi(payload);

      setCode("");
      setTerminal("");
      setIsAvailable(true);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar puerta. ¿Token admin?");
    }
  };

  const startEdit = (g: Gate) => {
    setEditId(g.id);
    setCode(g.code);
    setTerminal(g.terminal);
    setIsAvailable(g.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteGateApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar puerta. ¿Vuelos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Puertas de Embarque (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Código puerta" value={code} onChange={(e) => setCode(e.target.value)} />
          <TextField label="Terminal" value={terminal} onChange={(e) => setTerminal(e.target.value)} />
          <FormControlLabel
            control={<Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />}
            label={isAvailable ? "Disponible" : "Ocupada"}
          />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setCode(""); setTerminal(""); setIsAvailable(true); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Terminal</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((g) => (
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
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(g)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(g.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}