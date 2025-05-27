import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Ton instance axios

const AdminAgentsPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
   
  });

  const [agents, setAgents] = useState([]);

  // Charger les agents existants
  const fetchAgents = async () => {
    try {
      const res = await api.get("/admin/agents");
      setAgents(res.data);
    } catch (err) {
      console.error("Erreur chargement agents :", err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Données envoyées :", form); // Ajoute ceci
    try {
      await api.post("/admin/agents", { ...form });
      setForm({ name: "", phone: "", password: "" });
      fetchAgents();
    } catch (err) {
      console.error("Erreur création agent :", err);
    }
  };

  return (
    <Container sx={{mb:40}}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 4, mb: 3 }}>
        Gérer les agents du service client
      </Typography>

      <Button variant="outlined" onClick={() => navigate("/admin/dashboard")}>
        ← Retour au tableau de bord
      </Button>

      <Paper sx={{ p: 3, mt: 4, mb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Ajouter un nouvel agent
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Grid>
          
          <Grid item xs={12} mt={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Créer l'agent
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Liste des agents créés
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Créé le</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent._id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.phone}</TableCell>
                <TableCell>{new Date(agent.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminAgentsPage;
