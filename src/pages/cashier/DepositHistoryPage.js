import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const DepositHistoryPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const limit = 20; // Nombre de transactions par page
  
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchDeposits();
  }, [currentPage]);


  const fetchDeposits = async () => {
    try {
      const response = await api.get(`/cashier/history/deposits?page=${currentPage}&limit=${limit}`);
      setDeposits(response.data.deposits || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des dépôts :", err);
    }
  };

  return (
    <Container>
      <Button variant="contained" onClick={() => navigate("/cashier/dashboard")}>⬅ Retour</Button>
      <Typography variant="h4" sx={{ mt: 3, mb: 3, fontWeight: "bold" }}>📥 Historique des Dépôts</Typography>

      <Paper sx={{ mt: 2 }}>
        <Table>
        <TableHead>
  <TableRow>
    <TableCell>Date</TableCell>
    <TableCell>Nom du Client</TableCell>
    <TableCell>Téléphone du Client</TableCell>
    {/* <TableCell>Ville du Client</TableCell> */}
    <TableCell>Montant</TableCell>
    <TableCell>Caissier</TableCell>
    <TableCell>Ville Caissier</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {deposits.map((deposit) => (
    <TableRow key={deposit._id}>
      <TableCell>{new Date(deposit.date).toLocaleString()}</TableCell>
      <TableCell>{deposit.clientFirstName || "-"}</TableCell>
      <TableCell>{deposit.clientPhone || "-"}</TableCell>
      <TableCell>{deposit.amount?.toLocaleString()} XOF</TableCell>
      <TableCell>{deposit.performedBy?.name || "-"}</TableCell>
      <TableCell>{deposit.performedBy?.city?.name || "N/A"}</TableCell>
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

export default DepositHistoryPage;
