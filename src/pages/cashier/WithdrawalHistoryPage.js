import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const WithdrawalHistoryPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const limit = 20;

  useEffect(() => {
    fetchWithdrawals();
  }, [currentPage]);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get(`/cashier/history/withdrawals?page=${currentPage}&limit=${limit}`);
      setWithdrawals(response.data);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des retraits :", err);
    }
  };

  return (
    <Container>
      <Button variant="contained" onClick={() => navigate("/cashier/dashboard")}>⬅ Retour</Button>
      <Typography variant="h4" sx={{ mt: 3, mb: 3, fontWeight: "bold" }}>📤 Historique des Retraits</Typography>

      <Paper sx={{ mt: 2 }}>
        <Table>
        <TableHead>
  <TableRow>
    <TableCell>Date</TableCell>
    <TableCell>Nom Utilisateur</TableCell>
    <TableCell>Téléphone</TableCell>    
    <TableCell>Montant</TableCell>
    <TableCell>Caissier</TableCell>
    <TableCell>Ville</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {withdrawals.map((withdrawal) => (
    <TableRow key={withdrawal._id}>
      <TableCell>{new Date(withdrawal.date).toLocaleString()}</TableCell>
      <TableCell>{withdrawal.user?.name || "-"}</TableCell>
      <TableCell>{withdrawal.user?.phone || "-"}</TableCell>
      <TableCell>{withdrawal.amount} XOF</TableCell>
      <TableCell>{withdrawal.cashier?.name || "-"}</TableCell>
       <TableCell>{withdrawal.cashier?.city?.name || "N/A"}</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </Paper>

      <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>⬅ Précédent</Button>
      <Button onClick={() => setCurrentPage(currentPage + 1)}>Suivant ➡</Button>
    </Container>
  );
};

export default WithdrawalHistoryPage;
