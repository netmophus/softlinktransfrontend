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

const types = [
  { key: "intercity", label: "Transferts Interville" },
  { key: "interuser", label: "Transferts Entre Utilisateurs" },
  { key: "tontine", label: "Tontines" },
];

const AdminCommissionsGlobalPage = () => {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchGlobalCommissions = async () => {
    setLoading(true);
    try {
      // On suppose que l'API retourne un objet { intercity: [...], interuser: [...], tontine: [...] }
      const res = await api.get(`/admin/commissions/reports/global?period=${period}`);
      setData(res.data);
    } catch (err) {
      console.error("❌ Erreur chargement global commissions/taxes :", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGlobalCommissions();
    // eslint-disable-next-line
  }, [period]);

  // Helper pour calculer les totaux globaux
  const getTotal = (type, key) => {
    if (!data[type]) return 0;
    return data[type].reduce((acc, row) => acc + (row[key] || 0), 0);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
        <Typography variant="h5" fontWeight="bold">
          Vue Globale des Commissions & Taxes ({period})
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

      {loading ? (
        <Box textAlign="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        types.map((type) => (
          <Paper sx={{ p: 2, mb: 5 }} key={type.key}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {type.label}
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ville</TableCell>
                  <TableCell align="right">Total Commission (XOF)</TableCell>
                  <TableCell align="right">Total Taxe (XOF)</TableCell>
                  <TableCell align="right">Nombre de transactions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data[type.key] || []).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row._id}</TableCell>
                    <TableCell align="right">{row.totalCommission.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.totalTax.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                  </TableRow>
                ))}
                {(data[type.key] || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Aucune donnée trouvée.
                    </TableCell>
                  </TableRow>
                )}
                {/* Ligne total */}
                {(data[type.key] || []).length > 0 && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {getTotal(type.key, "totalCommission").toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {getTotal(type.key, "totalTax").toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {getTotal(type.key, "count")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default AdminCommissionsGlobalPage;
