import React, { useState, useEffect } from "react";
import { Container, TextField, Button, MenuItem, Typography, Box, Alert, Grid, Divider } from "@mui/material";
import { useAuth } from "../../context/AuthContext"; // ✅ Importation du contexte
import api from "../../services/api";
import { InputAdornment } from "@mui/material";
const UserInterCityTransferPage = () => {
  const { user, setUser, isAuthenticated } = useAuth(); // ✅ Fusionne en une seule ligne

  const [cities, setCities] = useState([]);
  const [transfer, setTransfer] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverCity: "",
    amount: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ✅ Appel API pour charger les villes (toujours appelé)
  useEffect(() => {
    api.get("/admin/cities")
      .then((res) => {
        setCities(res.data);
        if (res.data.length > 0) {
          setTransfer((prevState) => ({
            ...prevState,
            senderCity: res.data[0]._id || "",
            receiverCity: res.data[0]._id || "",
          }));
        }
      })
      .catch((err) => console.error("❌ Erreur chargement des villes :", err));
  }, []);

  // ✅ Vérifier que l'utilisateur est bien chargé AVANT d'afficher le formulaire
  if (!isAuthenticated || !user) {
    return (
      <Container>
        <Alert severity="error">🔴 Erreur : Vous devez être connecté pour effectuer un transfert.</Alert>
      </Container>
    );
  }

  // ✅ Mise à jour des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransfer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ✅ Effectuer le transfert
   const handleTransfer = async () => {
    setError("");
    setSuccess("");
  
    if (!transfer.receiverName || !transfer.receiverPhone || !transfer.receiverCity || !transfer.amount) {
      setError("⚠️ Tous les champs sont requis.");
      return;
    }
  
    try {
      const response = await api.post("/user/intercitytransfer", {
        senderFirstName: user.name.split(" ")[0],
        senderLastName: user.name.split(" ")[1] || "N/A",
        senderPhone: user.phone,
        receiverName: transfer.receiverName,
        receiverPhone: `+227${transfer.receiverPhone}`,
        receiverCity: transfer.receiverCity,
        amount: transfer.amount,
        deductFeesFromAmount: false,
      });
  
      setSuccess("✅ Transfert effectué avec succès !");
  
      // ✅ Mettre à jour le solde de l'utilisateur en temps réel
      setUser((prevUser) => ({
        ...prevUser,
        virtualAccount: {
          ...prevUser.virtualAccount,
          balance: response.data.newBalance, // 🔥 Met à jour le solde
        },
      }));
  
      console.log("✅ Nouveau solde mis à jour :", response.data.newBalance);
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Erreur lors du transfert.");
    }
  };
  

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, p: 3, marginBottom: 17, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Transférer vers une ville
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Grid container spacing={2}>
        

          <Divider sx={{ my: 3, width: "100%" }} />

          <Grid item xs={12}>
            <Typography variant="h6">Bénéficiaire</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
          <TextField
  label="Téléphone Bénéficiaire"
  name="receiverPhone"
  fullWidth
  required
  value={transfer.receiverPhone}
  inputProps={{
    maxLength: 8,
    pattern: "[0-9]{8}",
  }}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, ""); // Supprime tout sauf chiffres
    setTransfer((prev) => ({
      ...prev,
      receiverPhone: raw,
    }));
  }}
  InputProps={{
    startAdornment: <InputAdornment position="start">+227</InputAdornment>,
  }}
  helperText="Saisissez les 8 chiffres. Le +227 est ajouté automatiquement."
/>






          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Nom Bénéficiaire" name="receiverName" fullWidth onChange={handleChange} required />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              select
              label="Ville de retrait"
              name="receiverCity"
              fullWidth
              value={transfer.receiverCity || ""}
              onChange={handleChange}
              required
            >
              {cities.length > 0 ? (
                cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>Aucune ville disponible</MenuItem>
              )}
            </TextField>
          </Grid>

          <Divider sx={{ my: 3, width: "100%" }} />

          <Grid item xs={12}>
            <Typography variant="h6">Montant</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Montant (XOF)" name="amount" type="number" fullWidth onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleTransfer}>
              Effectuer le Transfert
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserInterCityTransferPage;
