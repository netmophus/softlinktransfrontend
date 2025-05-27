import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import api from "../../services/api";

const AdminCompensationReport = () => {
  const [perCity, setPerCity] = useState({});
  const [perCash, setPerCash] = useState({});

  useEffect(() => {
    api.get("/admin/reports/compensations")
      .then((res) => {
        setPerCity(res.data.perCity);
        setPerCash(res.data.perCash);
      })
      .catch((err) => console.error("Erreur chargement :", err));
  }, []);

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Rapport des Compensations Internes
        </Typography>

        {/* 🔸 Section par ville */}
        <Typography variant="h6" mt={4}>Par Ville</Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ville</TableCell>
                <TableCell>Montant Payé (XOF)</TableCell>
                <TableCell>Montant Reçu (XOF)</TableCell>
                <TableCell>Solde</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(perCity).map(([ville, data]) => (
                <TableRow key={ville}>
                  <TableCell>{ville}</TableCell>
                  <TableCell>{data.paid.toLocaleString()}</TableCell>
                  <TableCell>{data.received.toLocaleString()}</TableCell>
                  <TableCell>{(data.received - data.paid).toLocaleString()} XOF</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* 🔹 Section par caisse */}
        <Typography variant="h6" mt={6}>Par Caisse</Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Caisse</TableCell>
                <TableCell>Montant Payé</TableCell>
                <TableCell>Montant Reçu</TableCell>
                <TableCell>Solde</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(perCash).map(([caisse, data]) => (
                <TableRow key={caisse}>
                  <TableCell>{caisse}</TableCell>
                  <TableCell>{data.paid.toLocaleString()}</TableCell>
                  <TableCell>{data.received.toLocaleString()}</TableCell>
                  <TableCell>{(data.received - data.paid).toLocaleString()} XOF</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminCompensationReport;
