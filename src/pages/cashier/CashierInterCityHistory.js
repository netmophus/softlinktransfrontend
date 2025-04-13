import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip } from "@mui/material";
import api from "../../services/api";

const CashierInterCityHistory = () => {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await api.get("/cashier/history/intercity");
        setTransfers(res.data);
      } catch (err) {
        console.error("❌ Erreur chargement :", err);
      }
    };

    fetchTransfers();
  }, []);

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Historique des Transferts Inter-Ville
      </Typography>

      <Paper sx={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expéditeur</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Bénéficiaire</TableCell>
              <TableCell>Ville de retrait</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfers.map((t) => (
              <TableRow key={t._id}>
                <TableCell>{`${t.senderFirstName} ${t.senderLastName}`}</TableCell>
                <TableCell>{t.senderPhone}</TableCell>
                <TableCell>{t.receiverName}</TableCell>
                <TableCell>{t.receiverCity?.name || "—"}</TableCell>

                <TableCell>{t.amount.toLocaleString()} XOF</TableCell>
                <TableCell>
                  <Chip
                    label={t.status}
                    color={
                      t.status === "completed"
                        ? "success"
                        : t.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default CashierInterCityHistory;
