import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import api from "../../../services/api";

const AdminCommissionsTontinePage = () => {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/commissions-taxes/tontine?period=${period}`);
      setData(res.data);
    } catch (err) {
      setData(null);
      console.error("❌ Erreur chargement commissions/taxes :", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommissions();
    // eslint-disable-next-line
  }, [period]);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
        <Typography variant="h5" fontWeight="bold">
          Commissions & Taxes – Tontines ({period})
        </Typography>
        <TextField
          select
          size="small"
          label="Période"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="day">Jour</MenuItem>
          <MenuItem value="week">Semaine</MenuItem>
          <MenuItem value="month">Mois</MenuItem>
        </TextField>
      </Box>
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box textAlign="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Synthèse</TableCell>
                <TableCell align="right">Total Commission (XOF)</TableCell>
                <TableCell align="right">Total Taxe (XOF)</TableCell>
                <TableCell align="right">Nombre de transactions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data ? (
                <TableRow>
                  <TableCell>Global</TableCell>
                  <TableCell align="right">{data.totalCommission?.toLocaleString() ?? 0}</TableCell>
                  <TableCell align="right">{data.totalTax?.toLocaleString() ?? 0}</TableCell>
                  <TableCell align="right">{data.count ?? 0}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucune donnée trouvée.
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

export default AdminCommissionsTontinePage;
