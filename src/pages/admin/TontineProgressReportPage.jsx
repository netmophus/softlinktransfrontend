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
  Chip,
} from "@mui/material";
import api from "../../services/api";

const TontineProgressReportPage = () => {
  const [tontines, setTontines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/api/tontines/admin/tontines/progress");
        setTontines(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "pending":
        return "default";
      default:
        return "error";
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Progression des cycles des tontines actives
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
                <TableCell><strong>Cycle</strong></TableCell>
                <TableCell><strong>Statut actuel</strong></TableCell>
                <TableCell><strong>Prochaine échéance</strong></TableCell>
                <TableCell><strong>Solde virtuel (XOF)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tontines.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.initiator?.name} ({t.initiator?.phone})</TableCell>
                  <TableCell>{t.currentCycle} / {t.totalCycles}</TableCell>
                  <TableCell>
                    <Chip label={t.cycleStatus} color={getStatusColor(t.cycleStatus)} size="small" />
                  </TableCell>
                  <TableCell>
                    {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>{t.virtualBalance.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default TontineProgressReportPage;
