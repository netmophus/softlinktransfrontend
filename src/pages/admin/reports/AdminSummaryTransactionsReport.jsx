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

const AdminSummaryTransactionsReport = () => {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/summary-transactions?period=${period}`);
      setData(res.data);
    } catch (err) {
      console.error("❌ Erreur chargement résumé :", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [period]);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
        <Typography variant="h5" fontWeight="bold">
          Résumé Transactions par Ville ({period})
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
                <TableCell>Ville</TableCell>
                <TableCell align="right">Montant Dépôts</TableCell>
                <TableCell align="right">Montant Retraits</TableCell>
                <TableCell align="right">Total Transactions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row._id}</TableCell>
                  <TableCell align="right">{row.deposits.toLocaleString()} XOF</TableCell>
                  <TableCell align="right">{row.withdrawals.toLocaleString()} XOF</TableCell>
                  <TableCell align="right">{row.totalTransactions}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucune transaction trouvée.
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

export default AdminSummaryTransactionsReport;
