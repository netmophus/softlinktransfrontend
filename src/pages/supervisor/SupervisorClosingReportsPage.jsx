import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const SupervisorClosingReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();



  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/supervisor/reports/closing");
      console.log("✅ Rapports reçus :", res.data); // Ajoute ce log !
      setReports(res.data || []);
    } catch (err) {
      console.error("❌ Erreur chargement rapports :", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };
  

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container  mb= {20}>
      <Box mt={4} mb={3}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          ⬅ Retour
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Rapports de Fermeture de Caisse
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro de Caisse</TableCell>
              <TableCell>Caissier</TableCell>
              <TableCell>Ouverture</TableCell>
              <TableCell>Clôture</TableCell>
              <TableCell>Montant Ouverture</TableCell>
              <TableCell>Montant Fermeture</TableCell>
              <TableCell>Dépôts</TableCell>
              <TableCell>Retraits</TableCell>
              <TableCell>Solde Théorique</TableCell>
              <TableCell>Écart</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="center">Détails</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Aucun rapport trouvé.
                </TableCell>
              </TableRow>
            ) : (
              reports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell>{rep.registerNumber || "-"}</TableCell>
                    <TableCell>
                      {rep.cashier?.name || "-"}
                      <br />
                      <small>{rep.cashier?.phone}</small>
                    </TableCell>
                    <TableCell>
                      {rep.openedAt
                        ? new Date(rep.openedAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {rep.closedAt
                        ? new Date(rep.closedAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {rep.openingAmount?.toLocaleString()} XOF
                    </TableCell>
                    <TableCell>
                      {rep.closingAmount?.toLocaleString()} XOF
                    </TableCell>
                    <TableCell>
                      {rep.totalDeposits?.toLocaleString()} XOF
                    </TableCell>
                    <TableCell>
                      {rep.totalWithdrawals?.toLocaleString()} XOF
                    </TableCell>
                    <TableCell>
                      {rep.theoreticalBalance?.toLocaleString()} XOF
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${rep.gap >= 0 ? "+" : ""}${rep.gap?.toLocaleString()} XOF`}
                        color={rep.gap === 0 ? "success" : rep.gap > 0 ? "warning" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {rep.closingNote || <span style={{ color: "#999" }}>-</span>}
                    </TableCell>
                     {/* 🔽 NOUVEAU : Colonne détails */}
          {/* <TableCell align="center">
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => navigate(`/supervisor/reports/closing/${rep.id}`)}
            >
              Détails
            </Button>
          </TableCell> */}

<TableCell align="center">
  <Button
    variant="contained"
    color="info"
    size="small"
    onClick={() => navigate(`/supervisor/reports/closing/${rep.id}`)}
  >
    Détails
  </Button>
</TableCell>




                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={reports.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Container>
  );
};

export default SupervisorClosingReportsPage;
