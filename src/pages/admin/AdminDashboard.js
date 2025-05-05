
import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PaidIcon from "@mui/icons-material/Paid";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const cardStyle = {
  p: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: 3,
  boxShadow: 4,
  height: "100%",
  background: "linear-gradient(to right, #F0F4FF, #FFFFFF)",
  transition: "0.3s",
  "&:hover": {
    boxShadow: 8,
    transform: "scale(1.02)",
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const renderCard = (title, icon, path) => (
    <Paper sx={cardStyle}>
      <Avatar sx={{ bgcolor: "#1976D2", mb: 2 }}>{icon}</Avatar>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      <Button variant="contained" onClick={() => navigate(path)}>
        Voir
      </Button>
    </Paper>
  );

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mt:4 }}>
          Tableau de bord administrateur
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </Box>

      {/* Section 1 : Superviseurs */}
      <Typography variant="h5" sx={{ mb:5 }}>
        Supervision
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          {renderCard("Gérer les superviseurs", <GroupAddIcon />, "/admin/supervisors")}
        </Grid>
      </Grid>

      {/* Section 2 : Transactions de caisse */}
      <Typography variant="h5" sx={{ mb:5,  mt:8 }}>
        Reporting : Transactions de caisse
      </Typography>
      <Grid container spacing={3} sx={{ mb:10}}>
        <Grid item xs={12} md={4}>
          {renderCard("Dépôts par superviseur", <PaidIcon />, "/admin/reports/deposits")}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderCard("Retraits par superviseur", <AccountBalanceWalletIcon />, "/admin/reports/withdrawals")}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderCard("Total Dépôts & Retraits", <ReceiptLongIcon />, "/admin/reports/summary-transactions")}
        </Grid>
      </Grid>

      {/* Section 3 : Transferts interville */}
      <Typography variant="h5" sx={{ mt:8, mb: 2 }}>
        Reporting : Transferts interville
      </Typography>
      <Grid container spacing={3} sx={{ mb:10}}>
        <Grid item xs={12} md={4}>
          {renderCard("Par superviseur (ville, caisse)", <CompareArrowsIcon />, "/admin/reports/intercity-by-supervisor")}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderCard("Par ville de retrait", <SwapHorizIcon />, "/admin/reports/intercity-by-city")}
        </Grid>
        <Grid item xs={12} md={4}>
    {renderCard("Tous les transferts interville (clients inclus)", <ReceiptLongIcon />, "/admin/reports/intercity-all")}
  </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb:10, mt:10 }}>
  <Grid item xs={12} md={4}>
    {renderCard("Commissions Interville", <ShowChartIcon />, "/admin/commissions/intercity")}
  </Grid>
  <Grid item xs={12} md={4}>
    {renderCard("Commissions Entre Utilisateurs", <ShowChartIcon />, "/admin/commissions/interuser")}
  </Grid>
  <Grid item xs={12} md={4}>
    {renderCard("Commissions Tontine", <ShowChartIcon />, "/admin/commissions/tontine")}
  </Grid>
  <Grid item xs={12} md={12} sx={{  mt:10 }}>
    {renderCard("Vue Globale des Commissions", <ReceiptLongIcon />, "/admin/commissions/global")}
  </Grid>
</Grid>



      {/* Section 4 : Ouverture / Fermeture de caisses */}
      <Typography variant="h5" sx={{ mt:8, mb: 2 }}>
        Reporting : Gestion des caisses
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderCard("Ouvertures de caisses", <AccountTreeIcon />, "/admin/reports/open-cash-registers")}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderCard("Fermetures de caisses", <AccountTreeIcon />, "/admin/reports/closings")}
        </Grid>
      </Grid>


      {/* Section 6 : Tontines */}
<Typography variant="h5" sx={{ mt:8, mb:5 }}>
  Reporting : Gestion des tontines
</Typography>
<Grid container spacing={3}>
  <Grid item xs={12} md={4}  sx={{  mb:10 }}>
    {renderCard("Tontines actives", <AccountTreeIcon />, "/admin/reports/tontines/active")}
    </Grid>
  <Grid item xs={12} md={4}  sx={{  mb:10 }}>
    {renderCard("Membres enrôlés", <GroupAddIcon />, "/admin/reports/tontines/members")}
  </Grid>
  <Grid item xs={12} md={4}  sx={{  mb:10 }}>
    {renderCard("Montant total collecté", <PaidIcon />, "/admin/reports/tontines/collected")}
  </Grid>
  <Grid item xs={12} md={4} >
    {renderCard("Progression des cycles", <ShowChartIcon />, "/admin/reports/tontines/progress")}
  </Grid>
  <Grid item xs={12} md={4}>
    {renderCard("Historique des bénéficiaires", <ReceiptLongIcon />, "/admin/reports/tontines/beneficiaries")}
  </Grid>
  <Grid item xs={12} md={4}>
    {renderCard("Cycles à clôturer", <AccessTimeIcon />, "/admin/reports/tontines/pending")}
  </Grid>
</Grid>


      {/* Section 5 : Transactions entre utilisateurs */}
      <Typography variant="h5" sx={{ mt:8, mb:3 }}>
        Reporting : Transferts entre utilisateurs
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} sx={{mb:25 }}>
          {renderCard("Historique des transferts entre utilisateurs", <SwapHorizIcon />, "/admin/reports/user-to-user")}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
