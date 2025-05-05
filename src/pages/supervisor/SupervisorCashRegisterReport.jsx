


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
  Chip,
  Box,
  TextField,
  Button,
} from "@mui/material";
import api from "../../services/api";

const SupervisorCashRegisterReport = () => {
  const [reportData, setReportData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get("/supervisor/cash-registers/reporting", { params });
      setReportData(res.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement du reporting :", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Reporting des Caisses du Superviseur
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Date de début"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date de fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={fetchReport}>Filtrer</Button>
      </Box>

      <Paper sx={{ overflowX: "auto" }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>N° Caisse</TableCell>
        <TableCell>Caissier</TableCell>
        <TableCell>Ville</TableCell>
        <TableCell>Ouverture</TableCell>
        <TableCell>Dépôts</TableCell>
        <TableCell>Retraits</TableCell>
        <TableCell>Fermeture</TableCell>
        <TableCell>Théorique</TableCell>
        <TableCell>Écart</TableCell>
        <TableCell>Statut</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {reportData.map((reg) => (
        <TableRow key={reg.registerNumber}>
          <TableCell>{reg.registerNumber}</TableCell>
          <TableCell>{reg.cashier.name} ({reg.cashier.phone})</TableCell>
          <TableCell>{reg.city}</TableCell>
          <TableCell>{reg.openingAmount.toLocaleString()} XOF</TableCell>
          <TableCell>{reg.totalDeposits.toLocaleString()} XOF</TableCell>
          <TableCell>{reg.totalWithdrawals.toLocaleString()} XOF</TableCell>
          <TableCell>
            {reg.status === "closed"
              ? `${reg.closingAmount.toLocaleString()} XOF`
              : "—"}
          </TableCell>
          <TableCell>{reg.theoreticalBalance.toLocaleString()} XOF</TableCell>
          <TableCell>
            <Typography color={reg.discrepancy !== 0 ? "error" : "green"}>
              {reg.discrepancy.toLocaleString()} XOF
            </Typography>
          </TableCell>
          <TableCell>
            <Chip
              label={reg.status === "closed" ? "Fermée" : "Ouverte"}
              color={reg.status === "closed" ? "default" : "success"}
              size="small"
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Paper>

    </Container>
  );
};

export default SupervisorCashRegisterReport;
