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

const AdminUserToUserTransfersReport = () => {
  const [period, setPeriod] = useState("month");
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/user-to-user?period=${period}`);
      setTransfers(res.data);
    } catch (err) {
      console.error("❌ Erreur de chargement :", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransfers();
  }, [period]);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
        <Typography variant="h5" fontWeight="bold">
          Transferts entre Utilisateurs ({period})
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
                <TableCell>Expéditeur</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Bénéficiaire</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell align="right">Montant (XOF)</TableCell>
                <TableCell align="right">Reçu (Net)</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.sender?.name || "—"}</TableCell>
                  <TableCell>{t.senderPhone}</TableCell>
                  <TableCell>{t.receiver?.name || "—"}</TableCell>
                  <TableCell>{t.receiverPhone}</TableCell>
                  <TableCell align="right">{t.amount.toLocaleString()}</TableCell>
                  <TableCell align="right">{t.netAmount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {transfers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucun transfert trouvé.
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

export default AdminUserToUserTransfersReport;
