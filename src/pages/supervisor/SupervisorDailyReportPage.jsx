

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import { formatDate } from "../../utils/dateUtils";
import api from "../../services/api";
import AssessmentIcon from "@mui/icons-material/Assessment";

const SupervisorDailyReportPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format YYYY-MM-DD
  });

  const [reportData, setReportData] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [selectedCashierId, setSelectedCashierId] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/supervisor/daily-reports?date=${selectedDate}`);
      console.log("Données reçues du backend :", response.data);
      setReportData(response.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du rapport :", error);
      setLoading(false);
    }
  };

  const fetchCashiers = async () => {
    try {
      const res = await api.get("/supervisor/cashiers");
      setCashiers(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des caissiers", err);
    }
  };

  useEffect(() => {
    fetchCashiers();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const filteredData =
    selectedCashierId === "all"
      ? reportData
      : reportData.filter((entry) => entry.cashierId === selectedCashierId);

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Rapport Journalier - Caisses
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Filtrer par caissier"
            value={selectedCashierId}
            onChange={(e) => setSelectedCashierId(e.target.value)}
          >
            <MenuItem value="all">Tous les caissiers</MenuItem>
            {cashiers.map((cashier) => (
              <MenuItem key={cashier._id} value={cashier._id}>
                {cashier.name} ({cashier.phone})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredData.map((entry, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 5,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="center" mb={2}>
                    <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
  {entry.cashier?.name}
</Typography>
<Typography variant="body2" align="center" color="text.secondary">
  {entry.cashier?.phone}
</Typography>

                  <Divider sx={{ my: 2 }} />
                  <Typography>💰 Dépôts : {entry.totalDeposits.toLocaleString()} XOF</Typography>
                  <Typography>💸 Retraits : {entry.totalWithdrawals.toLocaleString()} XOF</Typography>
                  <Typography>🚚 Transferts Interville : {entry.totalIntercity.toLocaleString()} XOF</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" align="center" sx={{ color: "gray" }}>
                    {formatDate(new Date(selectedDate))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SupervisorDailyReportPage;
