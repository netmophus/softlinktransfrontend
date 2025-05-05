

import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const WithdrawalHistoryPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 20;

  useEffect(() => {
    fetchWithdrawals();
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get(`/cashier/history/withdrawals?page=${currentPage}&limit=${limit}`);
      setWithdrawals(response.data.withdrawals || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des retraits :", err);
      setWithdrawals([]);
      setTotalPages(1);
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
    <TableCell>Origine / Motif</TableCell> {/* <-- Ajout */}
  </TableRow>
</TableHead>
<TableBody>
  {Array.isArray(withdrawals) && withdrawals.map((withdrawal) => (
    <TableRow key={withdrawal._id}>
      <TableCell>{new Date(withdrawal.date).toLocaleString()}</TableCell>
      <TableCell>{withdrawal.clientFirstName || "-"}</TableCell>
      <TableCell>{withdrawal.clientPhone || "-"}</TableCell>
      <TableCell>{withdrawal.amount?.toLocaleString()} XOF</TableCell>
      <TableCell>{withdrawal.performedBy?.name || "-"}</TableCell>
      <TableCell>{withdrawal.performedBy?.city?.name || "N/A"}</TableCell>
      <TableCell>
        {withdrawal.note || "-"}
        {withdrawal.reference && (
          <div style={{ fontSize: "0.85em", color: "#888" }}>
            Ref: {withdrawal.reference}
          </div>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </Paper>

      <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>⬅ Précédent</Button>
      <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Suivant ➡</Button>
    </Container>
  );
};

export default WithdrawalHistoryPage;
