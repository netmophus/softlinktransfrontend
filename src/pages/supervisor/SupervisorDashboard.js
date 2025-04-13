// import React from "react";
// import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, Button, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// const SupervisorDashboard = () => {
//   const navigate = useNavigate();

//   const stats = {
//     totalCashiers: 5,
//     totalTransactions: 750,
//     totalAmount: 2500000,
//     pendingDeposits: 3,
//     pendingWithdrawals: 2,
//     recentActivities: [
//       { cashier: "Oumar Kane", action: "Dépôt", amount: "200,000 XOF", date: "03-03-2024" },
//       { cashier: "Fatou Ndiaye", action: "Retrait", amount: "150,000 XOF", date: "04-03-2024" },
//     ],
//   };

//   return (
//     <Container>
//       {/* En-tête avec bouton */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mt={15} mb={3}>
//         <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//           Tableau de bord Superviseur
//         </Typography>


      
//       </Box>


//       <Grid container spacing={3}>
//          {/* 🔹 Carte pour creer un caissiers */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3, textAlign: "center" }}>
//             <Typography variant="h6">Creer un Caissier</Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<GroupAddIcon />}
//               onClick={() => navigate("/supervisor/cashiers")}
//               sx={{ mt: 2 }}
//             >
//               Accéder
//             </Button>

          
//           </Paper>
//         </Grid>

//           {/* Carte Gestion des Caisses ouvrir une caisse */}
//           <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3, textAlign: "center" }}>
//             <Typography variant="h6">Ouvrir une caisse</Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{ mt: 2 }}
//               onClick={() => navigate("/supervisor/cash-registers")}
//             >
//               Accéder
//             </Button>
//           </Paper>
//         </Grid>
       
//       </Grid>

       
      
//     </Container>
//   );
// };

// export default SupervisorDashboard;



import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, CardActions, Typography, Button, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

import api from "../../services/api"; // Assure-toi d'avoir bien configuré ton API

const SupervisorDashboard = () => {
  const navigate = useNavigate();



  const [cashiers, setCashiers] = useState([]);
  const [totalOpenRegisters, setTotalOpenRegisters] = useState(0);
  const [totalClosedRegisters, setTotalClosedRegisters] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(5); // 🔥 Nombre d'éléments par page (modifiable)


// Pagination Logic
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentCashiers = cashiers.slice(indexOfFirstItem, indexOfLastItem);

// Fonction pour changer de page
const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const [supervisor, setSupervisor] = React.useState(null); // Stocke les infos du superviseur
  useEffect(() => {
    const fetchSupervisorInfo = async () => {
      try {
        const response = await api.get("/supervisor/me"); // Assure-toi que ton backend fournit bien ces données
        setSupervisor(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations du superviseur :", error);
      }
    };
  
    fetchSupervisorInfo();
  }, []);


    // 🔥 Fonction pour récupérer les caissiers avec leurs caisses ouvertes et fermées
    const fetchCashiers = async () => {
      try {
        const response = await api.get("/supervisor/cashiers");
        const cashiersData = response.data;
  
        setCashiers(cashiersData);
  
        // Calcul des totaux des caisses ouvertes et fermées
        let openCount = 0;
        let closedCount = 0;
  
        cashiersData.forEach(cashier => {
          openCount += cashier.openRegisters;
          closedCount += cashier.closedRegisters;
        });
  
        setTotalOpenRegisters(openCount);
        setTotalClosedRegisters(closedCount);
  
        console.log("✅ Caissiers récupérés avec succès :", cashiersData);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des caissiers :", error);
      }
    };
  
    useEffect(() => {
      fetchCashiers();
    }, []);
  

  return (
    <Container>
      {supervisor && (
  <Typography variant="h6" sx={{ mt: 3, mb: 3, color: "green", fontWeight: "bold" }}>
    Bienvenue, {supervisor.name} ({supervisor.phone}) !
  </Typography>
)}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={10} mb={3}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Tableau de bord Superviseur
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 📌 Carte Création de Caissier */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                Créer un Caissier
              </Typography>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<GroupAddIcon />}
                onClick={() => navigate("/supervisor/cashiers")}
                sx={{ mt: 2,  mb:2 }}
              >
                Accéder
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* 📌 Carte Ouvrir une Caisse */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                Ouvrir une Caisse
              </Typography>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MonetizationOnIcon />}
                onClick={() => navigate("/supervisor/cash-registers")}
                sx={{ mt: 2 , mb:2 }}
              >
                Accéder
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* 🔥 Carte Statistiques */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                Statistiques des Caisses
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">Caisses Ouvertes : {totalOpenRegisters}</Typography>
              <Typography variant="body1">Caisses Fermées : {totalClosedRegisters}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={5} mb= {20}>
    <Typography variant="h5">Détails par Caissier</Typography>
    <Divider sx={{ my: 2 }} />
    {currentCashiers.map(cashier => (
      <Card key={cashier._id} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{cashier.name} ({cashier.phone})</Typography>
        <Typography>Caisses Ouvertes : {cashier.openRegisters}</Typography>
        <Typography>Caisses Fermées : {cashier.closedRegisters}</Typography>
      </Card>
    ))}
    <Box display="flex" justifyContent="center" mt={3}>
      {Array.from({ length: Math.ceil(cashiers.length / itemsPerPage) }, (_, index) => (
        <Button
          key={index + 1}
          onClick={() => paginate(index + 1)}
          variant={currentPage === index + 1 ? "contained" : "outlined"}
          sx={{ mx: 0.5 }}
        >
          {index + 1}
        </Button>
      ))}
    </Box>
</Box>


     
    </Container>
  );
};

export default SupervisorDashboard;
