

import React, { useState, useEffect } from "react";
import { 
  Container, Grid, Paper, Typography, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField,
} from "@mui/material";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";  // Import du contexte d'auth
import { InputAdornment } from "@mui/material"; // en haut si ce n'est pas encore importé

const CashierDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [transactionType, setTransactionType] = useState(""); // "deposit" ou "withdraw"
  const [userAccount, setUserAccount] = useState("");
  const [amount, setAmount] = useState("");



  const [totals, setTotals] = useState({ completed: 0, pending: 0 });


  const [userName, setUserName] = useState("");

  const handlePhoneChange = async (e) => {
    const input = e.target.value;
    setUserAccount(input);
  
    const fullPhone = input.startsWith("+") ? input : `+227${input}`;
  
    try {
      const response = await api.get(`/cashier/find-by-phone/${fullPhone}`);
      setUserName(response.data.name);
    } catch (error) {
      setUserName(""); // Réinitialise si utilisateur non trouvé
    }
  };
  
  // const [applyCommission, setApplyCommission] = useState(true);
  const navigate = useNavigate();

  // Récupération de l'utilisateur depuis le contexte
  const { user } = useAuth();

  // États pour la caisse
  const [cashRegister, setCashRegister] = useState({
    initialBalance: 0,
    openingAmount: 0,
    currentBalance: 0,
  });
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  // Récupérer les totaux Dépôts / Retraits
  const fetchTotalTransactions = async () => {
    try {
      const response = await api.get("/cashier/total-transactions");
      console.log("✅ [FRONTEND] Totaux récupérés :", response.data);
      setTotalDeposits(response.data.totalDeposits);
      setTotalWithdrawals(response.data.totalWithdrawals);
    } catch (error) {
      console.error("❌ [FRONTEND] Erreur lors de la récupération des totaux :", error);
    }
  };
  
  useEffect(() => {
    fetchTotalTransactions();
  }, []);

  // Fonction pour récupérer les informations de la caisse
  const fetchCashRegister = async () => {
    try {
      const response = await api.get("/cashier/cash-register");
      console.log("✅ [FRONTEND] Caisse récupérée :", response.data);
      setCashRegister(response.data);
    } catch (error) {
      console.error("❌ [FRONTEND] Erreur lors de la récupération de la caisse :", error);
    }
  };
  
  useEffect(() => {
    fetchCashRegister();
  }, []);

  const handleOpenModal = (type) => {
    setTransactionType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUserAccount("");
    setAmount("");
    // setApplyCommission(true);
  };



  const handleSubmitTransaction = async () => {
    // Supprimer les espaces dans le numéro de téléphone et le montant
    const sanitizedUserAccount = `+227${userAccount.replace(/\s/g, "")}`;

    const sanitizedAmountStr = amount.replace(/\s/g, "");
    const numericAmount = parseFloat(sanitizedAmountStr);
  
    if (!sanitizedUserAccount || !sanitizedAmountStr || numericAmount <= 0) {
      if (transactionType === "deposit") {
        alert("Veuillez entrer un numéro de téléphone et un montant valide pour le dépôt.");
      } else {
        alert("Veuillez entrer un numéro de téléphone et un montant valide pour le retrait.");
      }
      return;
    }
  
    try {
      const endpoint = transactionType === "deposit" ? "/cashier/deposit" : "/cashier/withdraw";
      const requestBody = { 
        phone: sanitizedUserAccount,  
        amount: numericAmount, 
        // applyCommission 
      };
  
      console.log("📌 [FRONTEND] Envoi de la requête à :", endpoint);
      console.log("📦 [FRONTEND] Corps de la requête :", requestBody);
  
      const response = await api.post(endpoint, requestBody);
  
      console.log("✅ [FRONTEND] Réponse reçue :", response.data);
  
      alert(`${transactionType === "deposit" ? "Dépôt" : "Retrait"} effectué avec succès !`);
      handleCloseModal();
      fetchCashRegister(); // Rafraîchir la caisse
      fetchTotalTransactions(); // ✅ Rafraîchir les totaux dépôts/retraits !
    } catch (err) {
      console.error("❌ [FRONTEND] Erreur lors de la transaction :", err.response ? err.response.data : err);
      alert(`Erreur lors de la transaction : ${err.response ? err.response.data.msg : "Problème inconnu."}`);
    }
  };
  


  const fetchTotals = async () => {
    const res = await api.get("/cashier/total-intercity-transfers");
    setTotals(res.data);
  };
  
  useEffect(() => {
    fetchTotals();
  }, []);
  

  return (
    <Container sx={{ mb: 13 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Tableau de bord Guichetier
      </Typography>
      
      {/* Affichage du nom et du numéro du caissier */}
      {user && (
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Bienvenue, {user.name} ({user.phone})
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} sx={{ mt: 5, mb: 8 }}>
          <Button variant="contained" color="success" fullWidth onClick={() => handleOpenModal("deposit")}>
            ➕ Effectuer un Dépôt
          </Button>
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 5, mb: 8 }}>
          <Button variant="contained" color="error" fullWidth onClick={() => handleOpenModal("withdraw")}>
            ➖ Effectuer un Retrait
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {cashRegister ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">💰 Solde Initial</Typography>
                <Typography variant="h5">{cashRegister?.initialBalance?.toLocaleString() || 0} XOF</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">🏦 Montant d'Ouverture</Typography>
                <Typography variant="h5">{cashRegister?.openingAmount?.toLocaleString() || 0} XOF</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#f5f5f5" }}>
                <Typography variant="h6">🔄 Solde Actuel</Typography>
                <Typography variant="h5" sx={{ color: "green", fontWeight: "bold" }}>
                  {cashRegister?.currentBalance?.toLocaleString() || 0} XOF
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h6" color="error" sx={{ mt: 3 }}>
            ⚠ Aucune caisse trouvée.
          </Typography>
        )}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center", cursor: "pointer" }} onClick={() => navigate("/cashier/history/deposits")}>
            <Typography variant="h6">📥 Total Dépôts</Typography>
            <Typography variant="h5">{totalDeposits.toLocaleString()} XOF</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center", cursor: "pointer" }} onClick={() => navigate("/cashier/history/withdrawals")}>
            <Typography variant="h6">📤 Total Retraits</Typography>
            <Typography variant="h5">{totalWithdrawals.toLocaleString()} XOF</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
        <Paper
          sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/cashier/history/inter-city-transfers")}
        >
          <Typography variant="h6">🏙️ Transferts Inter-villes</Typography>
          <Typography variant="h6" color="green">  Effectués : {totals.completed.toLocaleString()} XOF </Typography>
          <Typography variant="body2" color="orange">  En attente : {totals.pending.toLocaleString()} XOF </Typography>
        </Paper>
      </Grid>

      </Grid>

      {/* Modal pour Dépôt/Retrait */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{transactionType === "deposit" ? "Dépôt d'Argent" : "Retrait d'Argent"}</DialogTitle>
        <DialogContent>
        <TextField
  label="Téléphone (ex : 96 64 83 83)"
  variant="outlined"
  fullWidth
  value={userAccount}
  onChange={handlePhoneChange}
  sx={{ mb: 2 }}
  InputProps={{
    startAdornment: <span style={{ marginRight: 8 }}>+227</span>,
  }}
/>
<Typography variant="subtitle2" sx={{ mb: 2, color: userName ? "green" : "gray" }}>
  {userName ? `👤 Nom : ${userName}` : "Utilisateur non trouvé"}
</Typography>

          <TextField
            label="Montant"
            type="number"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          {/* <FormControlLabel
            control={<Switch checked={applyCommission} onChange={(e) => setApplyCommission(e.target.checked)} />}
            label="Appliquer Commission et Taxe"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Annuler</Button>
          <Button onClick={handleSubmitTransaction} color="primary">Confirmer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CashierDashboard;
