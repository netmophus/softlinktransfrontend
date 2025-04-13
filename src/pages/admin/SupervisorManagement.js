import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Box, Alert, Typography, Pagination, Divider, Button, Table, TableBody, TableCell, FormControl, MenuItem, Select, InputLabel,TableHead, TableRow, Paper, TextField } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { InputAdornment } from "@mui/material";

const SupervisorManagement = () => {
  // const { isAuthenticated } = useAuth();
  const [supervisors, setSupervisors] = useState([]);
  const [newSupervisor, setNewSupervisor] = useState({ name: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();



  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const supervisorsPerPage = 10; // Nombre de superviseurs par page


  const [cities, setCities] = useState([]);


  const [successMessage, setSuccessMessage] = useState(""); // ✅ État pour afficher le message de succès


  useEffect(() => {
    fetchSupervisors();
  }, []);



 // Filtrer les superviseurs en fonction de la recherche
  const filteredSupervisors = supervisors.filter((supervisor) =>
    supervisor.name.toLowerCase().includes(search.toLowerCase()) ||
    supervisor.phone.toLowerCase().includes(search.toLowerCase()) ||
    (supervisor.city && supervisor.city.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const indexOfLastSupervisor = currentPage * supervisorsPerPage;
  const indexOfFirstSupervisor = indexOfLastSupervisor - supervisorsPerPage;
  const currentSupervisors = filteredSupervisors.slice(indexOfFirstSupervisor, indexOfLastSupervisor);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


const handleCreateSupervisor = async () => {
  setLoading(true);
  setError("");

  console.log("📌 Vérification avant envoi :", newSupervisor);

  if (!newSupervisor.city) {
      console.error("❌ Ville non sélectionnée !");
      setError("Veuillez sélectionner une ville.");
      setLoading(false);
      return;
  }

  try {

    const formattedPhone = newSupervisor.phone.startsWith("+227")
    ? newSupervisor.phone
    : `+227${newSupervisor.phone}`;
  
  const payload = { ...newSupervisor, phone: formattedPhone };
  


  const response = await api.post("/admin/create-supervisor", payload, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});


      console.log("✅ Réponse backend :", response.data);
      fetchSupervisors();
      setNewSupervisor({ name: "", phone: "", password: "", city: "" });


       // ✅ Afficher le message de succès
       setSuccessMessage("✅ Superviseur créé avec succès !");
       setTimeout(() => setSuccessMessage(""), 3000); // Le message disparaît après 3 secondes


  } catch (err) {
      console.error("❌ Erreur lors de la création :", err.response?.data);
      setError("Erreur lors de la création : " + (err.response?.data?.msg || "Erreur inconnue"));
  } finally {
      setLoading(false);
  }
};




const fetchCities = async () => {
  try {
      const response = await api.get("/admin/cities"); // ✅ Assure-toi que cette route est bien accessible
      setCities(response.data);
  } catch (err) {
      console.error("❌ Erreur lors de la récupération des villes :", err);
  }
};
useEffect(() => {
  fetchCities();
}, []);


  const fetchSupervisors = async () => {
    try {
      console.log("📥 Chargement des superviseurs...");
      
      const response = await api.get("/admin/supervisors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log("✅ Liste des superviseurs reçue :", response.data);
      setSupervisors(response.data);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des superviseurs :", err.response?.data || err);
    }
  };
  
  useEffect(() => {
    fetchSupervisors();
  }, []);


  const handleToggleSupervisorStatus = async (id) => {
    try {
      const response = await api.put(`/admin/toggle-supervisor-status/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log(`✅ Superviseur mis à jour: ${response.data.isActive ? "Actif" : "Inactif"}`);
  
      // Mise à jour locale des superviseurs après le changement
      setSupervisors((prev) =>
        prev.map((sup) => (sup._id === id ? { ...sup, isActive: response.data.isActive } : sup))
      );
    } catch (err) {
      console.error("❌ Erreur lors du changement de statut :", err.response?.data || err);
    }
  };
  

  const handleGoBack = () => {
    navigate("/admin/dashboard"); // Redirige vers le tableau de bord admin
  };
  
  return (
    <Container>

<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
  <Button
    variant="contained"
    color="secondary"
    startIcon={<ArrowBackIcon />}
    onClick={handleGoBack}
  >
    Retour au Dashboard
  </Button>
</Box>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Gestion des superviseurs
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Créer un nouveau superviseur</Typography>
        <Card sx={{ maxWidth: 500, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Création d'un nouveau superviseur
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nom"
            variant="outlined"
            value={newSupervisor.name}
            onChange={(e) => setNewSupervisor({ ...newSupervisor, name: e.target.value })}
            fullWidth
          />

<TextField
  label="Téléphone"
  variant="outlined"
  value={newSupervisor.phone}
  onChange={(e) => {
    const phoneNumber = e.target.value.replace(/\D/g, ""); // On supprime tous les caractères non numériques
    setNewSupervisor({ ...newSupervisor, phone: phoneNumber });
  }}
  fullWidth
  placeholder="96648383"
  InputProps={{
    startAdornment: <InputAdornment position="start">+227</InputAdornment>,
  }}
/>

          <FormControl fullWidth>
            <InputLabel>Ville</InputLabel>
            <Select
              value={newSupervisor.city || ""}
              onChange={(e) => setNewSupervisor({ ...newSupervisor, city: e.target.value })}
              required
            >
              {cities.map((city) => (
                <MenuItem key={city._id} value={city._id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            value={newSupervisor.password}
            onChange={(e) => setNewSupervisor({ ...newSupervisor, password: e.target.value })}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateSupervisor}
            disabled={loading}
            fullWidth
          >
            Ajouter
          </Button>
        </Box>
      </CardContent>
    </Card>
      </Paper>

      <Paper sx={{ p: 3, mb: 15 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Liste des superviseurs
      </Typography>
      
      <TextField
        label="Recherche"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Divider sx={{ mb: 2 }} />
      {successMessage && (
  <Alert severity="success" sx={{ mb: 2 }}>
    {successMessage}
  </Alert>
)}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Ville</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentSupervisors.map((supervisor) => (
            <TableRow key={supervisor._id}>
              <TableCell>{supervisor.name}</TableCell>
              <TableCell>{supervisor.phone}</TableCell>
              <TableCell>{supervisor.city ? supervisor.city.name : "Non défini"}</TableCell>
              <TableCell>{supervisor.isActive ? "✅ Actif" : "❌ Inactif"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color={supervisor.isActive ? "error" : "success"}
                  startIcon={supervisor.isActive ? <CheckIcon /> : <AddIcon />}
                  onClick={() => handleToggleSupervisorStatus(supervisor._id)}
                >
                  {supervisor.isActive ? "Désactiver" : "Activer"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredSupervisors.length / supervisorsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Paper>





    </Container>
  );
};

export default SupervisorManagement;
