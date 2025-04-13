



import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, MenuItem } from "@mui/material";
import api from "../../services/api";

const CreateTontineForm = ({ onTontineCreated }) => {
  const [tontineData, setTontineData] = useState({
    name: "",
    contributionAmount: "",
    totalCycles: "",
    startDate: "",
    frequency: "weekly",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTontineData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log("📡 Données envoyées :", tontineData); // 🔍 Vérifier les données envoyées
  
      await api.post("/api/tontines/create", tontineData);
      onTontineCreated(); // 🔄 Actualise la liste
      setTontineData({ name: "", contributionAmount: "", totalCycles: "", startDate: "", frequency: "weekly" });
    } catch (error) {
      console.error("❌ Erreur lors de la création :", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Erreur lors de la création de la tontine.");
    }
  };
  

  return (
    <Container>
      <Box sx={{ mt: 5, p: 3 }}>
        <Typography variant="h6">➕ Créer une Tontine</Typography>
        <TextField
          label="Nom de la Tontine"
          name="name"
          fullWidth
          sx={{ mt: 2 }}
          value={tontineData.name}
          onChange={handleChange}
        />
        <TextField
          label="Montant de Contribution (XOF)"
          name="contributionAmount"
          fullWidth
          sx={{ mt: 2 }}
          value={tontineData.contributionAmount}
          onChange={handleChange}
        />
        <TextField
          label="Nombre total de cycles"
          name="totalCycles"
          fullWidth
          sx={{ mt: 2 }}
          value={tontineData.totalCycles}
          onChange={handleChange}
        />
        <TextField
          label="Date de début de cotisation"
          name="startDate"
          type="date"
          fullWidth
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
          value={tontineData.startDate}
          onChange={handleChange}
        />
        <TextField
          select
          label="Fréquence des cycles"
          name="frequency"
          fullWidth
          sx={{ mt: 2 }}
          value={tontineData.frequency}
          onChange={handleChange}
        >
          <MenuItem value="weekly">Hebdomadaire</MenuItem>
          <MenuItem value="monthly">Mensuelle</MenuItem>
        </TextField>

        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleSubmit}>
          Créer la Tontine
        </Button>
      </Box>
    </Container>
  );
};

export default CreateTontineForm;
