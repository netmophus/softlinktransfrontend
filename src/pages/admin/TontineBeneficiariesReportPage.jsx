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
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import api from "../../services/api";

const TontineBeneficiariesReportPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await api.get("/api/tontines/admin/tontines/beneficiaries");
        setBeneficiaries(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Historique des bénéficiaires de tontines
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
                <TableCell><strong>Bénéficiaire</strong></TableCell>
                <TableCell><strong>Téléphone</strong></TableCell>
                <TableCell><strong>Date de réception</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beneficiaries.map((b, index) => (
                <TableRow key={index}>
                  <TableCell>{b.tontineName}</TableCell>
                  <TableCell>Cycle {b.cycleNumber}</TableCell>
                  <TableCell>{b.beneficiaryName}</TableCell>
                  <TableCell>{b.beneficiaryPhone}</TableCell>
                  <TableCell>
                    {b.date ? new Date(b.date).toLocaleDateString() : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default TontineBeneficiariesReportPage;
