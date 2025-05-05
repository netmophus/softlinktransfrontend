import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import api from "../../services/api";

const TontineCollectedReportPage = () => {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollected = async () => {
      try {
        const res = await api.get("/api/tontines/admin/tontines/collected");
        setTotal(res.data.totalCollected || 0);
      } catch (err) {
        console.error("❌ Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollected();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Montant total collecté dans toutes les tontines
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper
  elevation={3}
  sx={{
    p: 4,
    textAlign: "center",
    bgcolor: "#E3F2FD",
    fontSize: 24,
    fontWeight: "bold",
  }}
>
  <PaidIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
  {(total || 0).toLocaleString()} XOF
</Paper>

      )}
    </Container>
  );
};

export default TontineCollectedReportPage;
