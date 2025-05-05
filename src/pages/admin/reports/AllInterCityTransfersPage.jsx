import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import api from "../../../services/api"; // 🔁 adapte selon ton arborescence

const AllInterCityTransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste complète des transferts interville
    api
      .get("/admin/reports/intercity-all")
      .then((res) => {
        setTransfers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setTransfers([]);
      });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold" }}>
        Liste complète des transferts interville
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Expéditeur</TableCell>
                <TableCell>Tél. expéditeur</TableCell>
                <TableCell>Bénéficiaire</TableCell>
                <TableCell>Tél. bénéficiaire</TableCell>
                <TableCell>Ville retrait</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Commission</TableCell>
                <TableCell>Taxe</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Code secret</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.map((tr, i) => (
                <TableRow key={tr._id || i}>
                  <TableCell>
                    {new Date(tr.createdAt).toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {tr.senderFirstName} {tr.senderLastName}
                  </TableCell>
                  <TableCell>{tr.senderPhone}</TableCell>
                  <TableCell>{tr.receiverName}</TableCell>
                  <TableCell>{tr.receiverPhone}</TableCell>
                  <TableCell>
                    {tr.receiverCity?.name || "N/A"}
                  </TableCell>
                  <TableCell>{tr.amount.toLocaleString()} XOF</TableCell>
                  <TableCell>{tr.commission.toLocaleString()} XOF</TableCell>
                  <TableCell>{tr.tax.toLocaleString()} XOF</TableCell>
                  <TableCell>
                    <Chip
                      label={tr.status}
                      color={
                        tr.status === "completed"
                          ? "success"
                          : tr.status === "pending"
                          ? "warning"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <strong>{tr.secretCode}</strong>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AllInterCityTransfersPage;
