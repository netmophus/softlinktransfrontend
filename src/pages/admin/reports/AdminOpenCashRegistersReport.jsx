import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress,
} from "@mui/material";
import api from "../../../services/api";

const AdminOpenCashRegistersReport = () => {
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRegisters = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reports/open-cash-registers");
      setRegisters(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement ouvertures de caisse :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisters();
  }, []);

  return (
    <Container>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Ouvertures de Caisses par Superviseur
      </Typography>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° Caisse</TableCell>
                <TableCell>Caissier</TableCell>
                <TableCell>Ville</TableCell>
                <TableCell align="right">Montant d'ouverture</TableCell>
                <TableCell align="right">Solde initial</TableCell>
                <TableCell>Date d'ouverture</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registers.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.registerNumber}</TableCell>
                  <TableCell>{r.cashier?.name || "—"}</TableCell>
                  <TableCell>{r.cashier?.city?.name || "—"}</TableCell>
                  <TableCell align="right">{r.openingAmount.toLocaleString()} XOF</TableCell>
                  <TableCell align="right">{r.initialBalance.toLocaleString()} XOF</TableCell>
                  <TableCell>{new Date(r.openedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {registers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucune caisse ouverte trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default AdminOpenCashRegistersReport;
