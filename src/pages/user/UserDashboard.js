




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Typography, List, ListItem, 
  ListItemText, Button, 
  Stack, 
  TableCell, 
  TablePagination, 
  TableBody, 
  TableRow,
  Table,
  TableHead,
  TableContainer,

} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupsIcon from "@mui/icons-material/Groups";
import { useAuth } from "../../context/AuthContext"; // 🔹 Import du contexte d'authentification
import api from "../../services/api";

const UserDashboard = () => {
  const navigate = useNavigate();
 // const { user } = useAuth(); // 🔹 Récupérer l'utilisateur connecté
  const [activeTontines, setActiveTontines] = useState(0);
 // const [balance, setBalance] = useState(user?.virtualAccount?.balance || 0); // ✅ Stocker le solde localement





const { user , setUser} = useAuth(); // ✅ Supprime `setUser`
const [balance, setBalance] = useState(user?.virtualAccount?.balance || 0);



const [cityTransfers, setCityTransfers] = useState([]);  // 🔹 Historique des transferts vers une ville
const [userTransfers, setUserTransfers] = useState([]);  // 🔹 Historique des transferts entre utilisateurs

// États pour la pagination
const [cityPage, setCityPage] = useState(0);
const [cityRowsPerPage, setCityRowsPerPage] = useState(5);
const [userPage, setUserPage] = useState(0);
const [userRowsPerPage, setUserRowsPerPage] = useState(5);



// ✅ Met à jour le solde à chaque fois que `user` change
useEffect(() => {
  setBalance(user?.virtualAccount?.balance || 0);
}, [user]); // 🔥 Écoute `user` pour rafraîchir le solde









useEffect(() => {
  const fetchUserTransfers = async () => {
    try {
      const res = await api.get("/intrausertranfer/transfer/history?type=user");
      console.log("✅ Historique des transferts entre utilisateurs :", res.data);
      setUserTransfers(res.data || []);
    } catch (err) {
      console.error("❌ Erreur chargement transferts entre utilisateurs :", err);
    }
  };

  fetchUserTransfers();
}, []);


  

  // ✅ Fonction pour recharger le solde après un transfert
  const refreshBalance = async () => {
    try {
      const response = await api.get("/intrausertranfer/balance");

      setBalance(response.data.balance); // ✅ Met à jour le solde local
  
      // 🔹 Forcer la mise à jour de l'utilisateur dans `AuthContext`
      setUser((prevUser) => ({
        ...prevUser,
        virtualAccount: {
          ...prevUser.virtualAccount,
          balance: response.data.balance, // ✅ Met à jour le solde globalement
        }
      }));
      
      console.log("✅ Solde mis à jour :", response.data.balance);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du solde :", error);
    }
  };
  


  useEffect(() => {
    const fetchActiveTontines = async () => {
      try {
        console.log("📡 Chargement du nombre de tontines actives...");
        const response = await api.get("/api/tontines/active-count");
        console.log("✅ Nombre de tontines actives récupéré :", response.data.activeTontinesCount);
        setActiveTontines(response.data.activeTontinesCount);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des tontines actives :", error.response?.data || error.message);
      }
    };
  
    fetchActiveTontines();
  }, []);




  useEffect(() => {
    const fetchInterCityTransfers = async () => {
      try {
        const res = await api.get("/user/transfer/history"); // ✅ bonne route
        console.log("✅ Historique des transferts vers une ville :", res.data);
        setCityTransfers(res.data);
      } catch (err) {
        console.error("❌ Erreur chargement transferts interville :", err);
      }
    };
    
  
    fetchInterCityTransfers();
  }, []);
  
  

  return (
    <Container sx={{ mb:16 }}>
      {/* ✅ Titre mis à jour avec nom et téléphone */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Tableau de bord de {user?.name || "Utilisateur"} ({user?.phone || "N/A"})
      </Typography>

      <Grid container spacing={3}>
        {/* ✅ Solde du Compte */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">💰 Solde du Compte</Typography>
            <Typography variant="h5">{balance.toLocaleString()} XOF</Typography> {/* ✅ Utilisation du solde mis à jour */}
          </Paper>
        </Grid>

        {/* ✅ Nombre de Tontines Actives */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">📌 Tontines Actives</Typography>
            <Typography variant="h5">{activeTontines}</Typography>
          </Paper>
        </Grid>

        {/* ✅ Boutons de Transfert */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Effectuer un Transfert ou une Tontine</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={async () => {
                  await navigate("/user/inter-city-transfer");
                  refreshBalance(); // ✅ Appelé après navigation
                }}
                
                startIcon={<LocationCityIcon />}
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#9c27b0",
                  "&:hover": { backgroundColor: "#7b1fa2" },
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                Transférer vers une ville
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/user/transfer");
                  refreshBalance(); // ✅ Mise à jour du solde après un transfert
                }}
                startIcon={<SendIcon />}
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#115293" },
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                Transférer vers un utilisateur
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/user/tontine")}
                startIcon={<GroupsIcon />}
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#ff9800",
                  "&:hover": { backgroundColor: "#f57c00" },
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                Tontine
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* ✅ Transactions Récentes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📝 Transactions récentes</Typography>
            <List>
              {user?.virtualAccount?.transactions?.map((transaction, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${transaction.recipient} - ${transaction.type} - ${transaction.amount} XOF`}
                    secondary={transaction.date}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>






<Grid item xs={12}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
      👥 Historique des Transferts entre Utilisateurs
    </Typography>

    <TableContainer>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell><strong>📅 Date</strong></TableCell>
            <TableCell><strong>📤 Expéditeur</strong></TableCell>
            <TableCell><strong>📥 Bénéficiaire</strong></TableCell>
            <TableCell><strong>💸 Montant</strong></TableCell>
            <TableCell><strong>📌 Statut</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {userTransfers
            .slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage)
            .map((transfer, index) => (
              <TableRow key={index}>
                <TableCell>
                  {transfer.createdAt
                    ? new Date(transfer.createdAt).toLocaleString("fr-FR")
                    : "Date invalide"}
                </TableCell>

                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {transfer.sender?.name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transfer.sender?.phone || "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {transfer.receiver?.name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transfer.receiver?.phone || "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {transfer.amount.toLocaleString()} XOF
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        transfer.status === "completed"
                          ? "green"
                          : transfer.status === "pending"
                          ? "orange"
                          : "red",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {transfer.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={userTransfers.length}
      page={userPage}
      onPageChange={(event, newPage) => setUserPage(newPage)}
      rowsPerPage={userRowsPerPage}
      onRowsPerPageChange={(event) =>
        setUserRowsPerPage(parseInt(event.target.value, 10))
      }
    />
  </Paper>
</Grid>


<Grid item xs={12}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
      🏙️ Historique des Transferts vers une Ville
    </Typography>

    <TableContainer>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell><strong>📅 Date</strong></TableCell>
            <TableCell><strong>🏙️ Ville de Retrait</strong></TableCell>
            <TableCell><strong>📞 Bénéficiaire</strong></TableCell>
            <TableCell><strong>💸 Montant</strong></TableCell>
            <TableCell><strong>📌 Statut</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cityTransfers
            .slice(cityPage * cityRowsPerPage, cityPage * cityRowsPerPage + cityRowsPerPage)
            .map((transfer, index) => (
              <TableRow key={index}>
                <TableCell>
                  {transfer.createdAt
                    ? new Date(transfer.createdAt).toLocaleString("fr-FR")
                    : "Date invalide"}
                </TableCell>

                <TableCell>
                  {transfer.receiverCity?.name || "N/A"}
                </TableCell>

                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {transfer.receiverName || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transfer.receiverPhone || "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  {transfer.amount?.toLocaleString()} XOF
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        transfer.status === "completed"
                          ? "green"
                          : transfer.status === "pending"
                          ? "orange"
                          : "red",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {transfer.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={cityTransfers.length}
      page={cityPage}
      onPageChange={(event, newPage) => setCityPage(newPage)}
      rowsPerPage={cityRowsPerPage}
      onRowsPerPageChange={(event) =>
        setCityRowsPerPage(parseInt(event.target.value, 10))
      }
    />
  </Paper>
</Grid>





      </Grid>
    </Container>
  );
};

export default UserDashboard;

