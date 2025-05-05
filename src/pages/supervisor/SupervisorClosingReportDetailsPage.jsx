import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Button, Paper, Box, Divider, Table, TableHead, TableRow, TableCell, TableBody,
} from "@mui/material";
import api from "../../services/api";

const SupervisorClosingReportDetailsPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/supervisor/reports/closing/${reportId}`);
        setReport(res.data);
      } catch (err) {
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  if (loading) return <Container><Typography>Chargement…</Typography></Container>;
  if (!report) return <Container><Typography>Rapport introuvable.</Typography></Container>;

  return (
    <Container>
      <Button onClick={() => navigate(-1)} sx={{ mb: 3 }}>⬅ Retour</Button>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Détail Rapport Caisse {report.registerNumber}
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography><strong>Caissier :</strong> {report.cashier?.name} ({report.cashier?.phone})</Typography>
        <Typography><strong>Ouverture :</strong> {report.openedAt ? new Date(report.openedAt).toLocaleString() : "-"}</Typography>
        <Typography><strong>Fermeture :</strong> {report.closedAt ? new Date(report.closedAt).toLocaleString() : "-"}</Typography>
        <Typography><strong>Montant Ouverture :</strong> {report.openingAmount} XOF</Typography>
        <Typography><strong>Montant Fermeture :</strong> {report.actualClosingAmount ?? report.closingAmount} XOF</Typography>
        <Typography><strong>Dépôts :</strong> {report.totalDeposits} XOF</Typography>
        <Typography><strong>Retraits :</strong> {report.totalWithdrawals} XOF</Typography>
        <Typography><strong>Solde Théorique :</strong> {report.expectedClosingAmount} XOF</Typography>
        <Typography><strong>Écart :</strong> {report.discrepancy} XOF</Typography>
        <Typography><strong>Note :</strong> {report.note || "-"}</Typography>
      </Paper>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>Mouvements de la caisse</Typography>
      <Paper sx={{ p: 2 }}>
        {report.movements?.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Opérateur</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.movements.map((mvt) => (
                <TableRow key={mvt._id}>
                  <TableCell>
                    {new Date(mvt.date).toLocaleString()}
                  </TableCell>
                  <TableCell>{mvt.type === "deposit" ? "Dépôt" : "Retrait"}</TableCell>
                  <TableCell>{mvt.amount.toLocaleString()} XOF</TableCell>
                  <TableCell>
                    {mvt.performedBy
                      ? mvt.performedBy.name || mvt.performedBy.toString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {mvt.note || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>Aucun mouvement trouvé pour cette caisse.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default SupervisorClosingReportDetailsPage;
