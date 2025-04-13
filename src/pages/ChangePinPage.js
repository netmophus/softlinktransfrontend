import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Alert, Box, CircularProgress } from "@mui/material";
import axios from "axios";

const ChangePinPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [phone] = useState(location.state?.phone || ""); // 📌 Récupère le numéro de téléphone passé via navigate()
  const [tempPin, setTempPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (newPin !== confirmPin) {
      setError("Le nouveau PIN et la confirmation ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (newPin.length < 4) {
      setError("Le PIN doit contenir au moins 4 chiffres.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/change-pin`, {
        phone,
        tempPin,
        newPin
      });

      if (response.data.msg === "Votre PIN a été changé avec succès.") {
        setSuccessMessage(response.data.msg);
        setTimeout(() => navigate("/login"), 3000); // Redirige vers la page de connexion après 3 secondes
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Une erreur est survenue lors du changement de PIN.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Changer votre PIN
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <form onSubmit={handleChangePin}>
          <TextField
            label="Téléphone"
            value={phone}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="PIN temporaire"
            type="password"
            value={tempPin}
            onChange={(e) => setTempPin(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nouveau PIN"
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirmer Nouveau PIN"
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Changer le PIN"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePinPage;
