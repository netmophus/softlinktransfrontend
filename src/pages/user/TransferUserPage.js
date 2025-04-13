


import React, { useState, useEffect } from "react";
import { 
  Container, TextField, Button, Typography, Box, Alert, Divider 
} from "@mui/material";
import api from "../../services/api";
import { InputAdornment } from "@mui/material";


const TransferUserPage = () => {
  const [transfer, setTransfer] = useState({
    recipientPhone: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [balance, setBalance] = useState(0);

  // Récupérer le solde de l'utilisateur connecté via l'endpoint /intrausertranfer/balance
  const fetchBalance = async () => {
    try {
      const response = await api.get("/intrausertranfer/balance");
      setBalance(response.data.balance);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération du solde :", err);
      setError("Erreur lors de la récupération du solde.");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransfer((prev) => ({ ...prev, [name]: value }));
  };

  // Vérifier si le destinataire existe (utilise désormais l'endpoint /intrausertranfer/check/)
  const checkRecipient = async () => {
    const cleanedPhone = transfer.recipientPhone.replace(/\D/g, ""); // Garde uniquement les chiffres
  
    if (cleanedPhone.length !== 8) {
      setRecipient(null);
      setError("⚠️ Le numéro doit contenir exactement 8 chiffres.");
      return;
    }
  
    const fullPhone = `+227${cleanedPhone}`;
  
    try {
      const response = await api.get(`/intrausertranfer/check/${fullPhone}`);
      if (response.data.exists) {
        setRecipient(response.data.user);
        setError("");
      } else {
        setRecipient(null);
        setError("⚠️ L'utilisateur avec ce numéro n'existe pas.");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la vérification du destinataire :", err);
      setError("❌ Erreur lors de la vérification du destinataire.");
    }
  };
  

  const handleTransfer = async () => {
    setError("");
    setSuccess("");

    if (!transfer.recipientPhone.trim() || !transfer.amount.trim()) {
      setError("⚠️ Tous les champs sont requis.");
      return;
    }

    const numericAmount = parseFloat(transfer.amount);
    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > balance) {
      setError("⚠️ Montant invalide ou solde insuffisant.");
      return;
    }

    try {
      // Utilise l'endpoint POST /intrausertranfer/transfer
      await api.post("/intrausertranfer/transfer", {
        recipientPhone: `+227${transfer.recipientPhone.trim()}`,
        amount: numericAmount,
      });
      
      setSuccess("✅ Transfert effectué avec succès !");
      // Rafraîchir le solde depuis le serveur après transfert
      await fetchBalance();
      // Réinitialiser le formulaire
      setTransfer({ recipientPhone: "", amount: "" });
      setRecipient(null);
    } catch (err) {
      console.error("❌ Erreur lors du transfert :", err.response?.data || err);
      setError(err.response?.data?.msg || "❌ Erreur lors du transfert.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Transfert d'argent vers un utilisateur
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Affichage du solde de l'utilisateur */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Solde actuel : {balance.toLocaleString()} XOF
        </Typography>

        <Divider sx={{ my: 3 }} />

        <TextField
  label="Numéro du destinataire"
  name="recipientPhone"
  fullWidth
  required
  value={transfer.recipientPhone}
  inputProps={{
    maxLength: 8,
    pattern: "[0-9]{8}",
  }}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, ""); // Supprime tout sauf chiffres
    setTransfer((prev) => ({
      ...prev,
      recipientPhone: raw,
    }));
  }}
  onBlur={checkRecipient}
  InputProps={{
    startAdornment: <InputAdornment position="start">+227</InputAdornment>,
  }}
  helperText="+227 est automatiquement ajouté au numéro"
/>


        {recipient && (
          <Alert severity="info" sx={{ mb: 2 }}>
            ✅ Destinataire : {recipient.name}
          </Alert>
        )}

        <TextField
          label="Montant (XOF)"
          name="amount"
          type="number"
          fullWidth
          value={transfer.amount}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleTransfer}
          sx={{ mt: 2 }}
        >
          Effectuer le Transfert
        </Button>
      </Box>
    </Container>
  );
};

export default TransferUserPage;
