import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import api from "../../services/api";

const InternalSettlementPage = () => {
  const [settlements, setSettlements] = useState([]);
const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const res = await api.get("/admin/internal-settlements");
      setSettlements(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement des compensations :", error);
    }
  };

  const handleSettle = async (id) => {
    try {
      await api.put(`/admin/internal-settlements/${id}/settle`);
      fetchSettlements();
    } catch (error) {
      console.error("❌ Erreur lors de la validation :", error);
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Compensations internes entre caisses
        </Typography>

        <Box display="flex" gap={2} mb={2} mt={1}>
  <Button
    variant={filter === "pending" ? "contained" : "outlined"}
    color="warning"
    onClick={() => setFilter("pending")}
  >
    En attente
  </Button>
  <Button
    variant={filter === "settled" ? "contained" : "outlined"}
    color="success"
    onClick={() => setFilter("settled")}
  >
    Réglées
  </Button>
</Box>


        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Caisse d'envoi</TableCell>
                <TableCell>Caisse de réception</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {settlements
  .filter((s) => (filter === "pending" ? !s.settled : s.settled))
  .map((s) => (

                <TableRow key={s._id}>
                  <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{s.fromCashRegister?.registerNumber || "N/A"}</TableCell>
                  <TableCell>{s.toCashRegister?.registerNumber || "N/A"}</TableCell>
                  <TableCell>{s.amount.toLocaleString()} XOF</TableCell>
                  <TableCell>
                    {s.settled ? (
                      <Chip label="Réglée" color="success" />
                    ) : (
                      <Chip label="En attente" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>
                    {!s.settled && (
                      <Button variant="contained" onClick={() => handleSettle(s._id)}>
                        Valider
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default InternalSettlementPage;
