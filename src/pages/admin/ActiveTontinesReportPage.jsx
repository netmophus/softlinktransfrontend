import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import api from "../../services/api"; // 🔄 Assure-toi que ton instance axios est bien configurée

const ActiveTontinesReportPage = () => {
  const [tontines, setTontines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTontines = async () => {
      try {
        const res = await api.get("/api/tontines/admin/tontines/active");
        setTontines(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des tontines :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTontines();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Tontines actives
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Initiateur</strong></TableCell>
                <TableCell><strong>Montant / cycle</strong></TableCell>
                <TableCell><strong>Cycles</strong></TableCell>
                <TableCell><strong>Membres</strong></TableCell>
                <TableCell><strong>Solde (XOF)</strong></TableCell>
                <TableCell><strong>Démarrage</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tontines.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.initiator?.name} ({t.initiator?.phone})</TableCell>
                  <TableCell>{t.contributionAmount.toLocaleString()} XOF</TableCell>
                  <TableCell>{t.currentCycle} / {t.totalCycles}</TableCell>
                  <TableCell>{t.memberCount}</TableCell>
                  <TableCell>{t.virtualBalance.toLocaleString()}</TableCell>
                  <TableCell>{new Date(t.startDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default ActiveTontinesReportPage;
