import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, CardActions, Typography, Button, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import AssessmentIcon from "@mui/icons-material/Assessment"; // 🧠 Ajout de 

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



    const handleCloseCashRegister = async (cashRegisterId) => {
      const montantFermeture = window.prompt("Entrez le montant de fermeture de la caisse :");
    
      if (!montantFermeture || isNaN(montantFermeture)) {
        alert("Montant invalide.");
        return;
      }
    
      try {
        const res = await api.put(`/cash-registers/close/${cashRegisterId}`, {
          closingAmount: parseFloat(montantFermeture),
        });
        alert("✅ Caisse fermée avec succès !");
        fetchCashiers(); // 🔁 Mettre à jour la liste
      } catch (err) {
        console.error("❌ Erreur fermeture de caisse :", err);
        alert("Erreur lors de la fermeture de la caisse.");
      }
    };
    


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

      {/* 📊 Carte Reporting des caisses */}
<Grid item xs={12} md={4}   sx={{ mt:5 }}>
  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
        Reporting des Caisses
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Visualisez les transactions de caisse, les soldes et les écarts
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: "center" }}>
      <Button
        variant="contained"
        color="success"
        startIcon={<LockIcon />}
        onClick={() => navigate("/supervisor/reports/cash-registers")}
        sx={{ mt: 1, mb: 2 }}
      >
        Consulter
      </Button>
    </CardActions>
  </Card>
</Grid>

<Grid item xs={12} md={4} sx={{ mt: 5 }}>
  <Card
    sx={{
      borderRadius: 4,
      boxShadow: 6,
      transition: "transform 0.3s",
      "&:hover": {
        transform: "scale(1.03)",
        marginTop: 5,
      },
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <AssessmentIcon color="warning" sx={{ fontSize: 40 }} />
      </Box>
      <Typography
        variant="h6"
        sx={{ textAlign: "center", fontWeight: "bold", color: "text.primary" }}
      >
        Rapports de Fermeture de Caisses
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
        Consultez les rapports de fermeture pour contrôler les soldes, écarts et justifications des caissiers.
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: "center" }}>
      <Button
        variant="contained"
        color="warning"
        onClick={() => navigate("/supervisor/reports/closing")}
        sx={{ mt: 1, mb: 2, px: 4 }}
      >
        Voir les rapports
      </Button>
    </CardActions>
  </Card>
</Grid>


{/* 📊 Carte Rapport Journalier */}
<Grid item xs={12} md={4}   sx={{ mt:5}}>
  <Card
    sx={{
      borderRadius: 4,
      boxShadow: 6,
      transition: "transform 0.3s",
      "&:hover": {
        transform: "scale(1.03)",
        marginTop:5,
      },
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2} >
        <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
      </Box>
      <Typography
        variant="h6"
        sx={{ textAlign: "center", fontWeight: "bold", color: "text.primary" }}
      >
        Rapport Journalier par Caissier
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
        Visualisez les opérations par caissier pour une date donnée
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: "center" }}>
      <Button
        variant="contained"
        color="info"
        onClick={() => navigate("/supervisor/reports/daily")}
        sx={{ mt: 1, mb: 2, px: 4 }}
      >
        Voir rapport
      </Button>
    </CardActions>
  </Card>
</Grid>

      <Box mt={5} mb= {20}>
    <Typography variant="h5">Détails par Caissier</Typography>
    <Divider sx={{ my: 2 }} />
    {/* {currentCashiers.map(cashier => (
      <Card key={cashier._id} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{cashier.name} ({cashier.phone})</Typography>
        <Typography>Caisses Ouvertes : {cashier.openRegisters}</Typography>
        <Typography>Caisses Fermées : {cashier.closedRegisters}</Typography>
      </Card>
    ))} */}

{currentCashiers.map(cashier => (
  <Card key={cashier._id} sx={{ mb: 2, p: 2 }}>
    <Typography variant="h6">{cashier.name} ({cashier.phone})</Typography>
    <Typography>Caisses Ouvertes : {cashier.openRegisters}</Typography>
    <Typography>Caisses Fermées : {cashier.closedRegisters}</Typography>

    {cashier.latestOpenRegister && (
      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          📍 Dernière caisse ouverte : {cashier.latestOpenRegister.registerNumber}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleCloseCashRegister(cashier.latestOpenRegister._id)}
          sx={{ mt: 1 }}
        >
          Fermer la caisse
        </Button>
      </Box>
    )}
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
