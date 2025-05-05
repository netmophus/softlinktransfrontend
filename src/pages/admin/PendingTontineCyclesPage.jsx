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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import api from "../../services/api";

const PendingTontineCyclesPage = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get("/api/tontines/admin/tontines/pending-cycles");
        setCycles(res.data);
      } catch (err) {
        console.error("❌ Erreur chargement cycles à clôturer :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Cycles à clôturer
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
                <TableCell><strong>Tontine</strong></TableCell>
                <TableCell><strong>Cycle</strong></TableCell>
                <TableCell><strong>Date limite</strong></TableCell>
                <TableCell><strong>Initiateur</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Solde dispo (XOF)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cycles.map((cycle, index) => (
                <TableRow key={index}>
                  <TableCell>{cycle.tontineName}</TableCell>
                  <TableCell>Cycle {cycle.cycleNumber}</TableCell>
                  <TableCell>
                    {cycle.dueDate
                      ? new Date(cycle.dueDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {cycle.initiatorName} ({cycle.initiatorPhone})
                  </TableCell>
                  <TableCell>
                    <Chip label={cycle.status} color="warning" size="small" />
                  </TableCell>
                  <TableCell>{cycle.balance.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default PendingTontineCyclesPage;
