

import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Card, CardContent, Grid, Alert, List, ListItem, ListItemText, Divider, Pagination, Box } from "@mui/material";
import api from "../../services/api";

const CityManagementPage = () => {
  const [cities, setCities] = useState([]);
  const [displayedCities, setDisplayedCities] = useState([]);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 10; // Nombre de villes par page

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await api.get("/admin/cities");
      setCities(response.data);
      setDisplayedCities(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des villes :", error);
      setErrorMessage("Erreur lors du chargement des villes.");
    }
  };

  const handleAddCity = async () => {
    if (!name || !region) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await api.post("/admin/cities", { name, region });
      fetchCities();
      setName("");
      setRegion("");
      setSuccessMessage("Ville ajoutée avec succès !");
      setErrorMessage("");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout :", error);
      setErrorMessage("Impossible d'ajouter la ville.");
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm) || 
      city.region.toLowerCase().includes(searchTerm)
    );

    setDisplayedCities(filteredCities);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastCity = currentPage * citiesPerPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const currentCities = displayedCities.slice(indexOfFirstCity, indexOfLastCity);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        🏙️ Gestion des Villes
      </Typography>

      {successMessage && <Alert severity="success" onClose={() => setSuccessMessage("")}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
      
      <Grid container spacing={4}>
        {/* 📌 Formulaire d'ajout */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>➕ Ajouter une Ville</Typography>
              
              <TextField 
                label="Nom de la Ville" 
                fullWidth 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                sx={{ mb: 2 }} 
              />
              
              <TextField 
                label="Région" 
                fullWidth 
                value={region} 
                onChange={(e) => setRegion(e.target.value)} 
                sx={{ mb: 2 }} 
              />
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleAddCity}
              >
                Ajouter
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 📌 Liste des villes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>📍 Liste des Villes</Typography>
              
              <TextField 
                label="Rechercher une ville" 
                fullWidth 
                value={search} 
                onChange={handleSearch} 
                sx={{ mb: 2 }}
              />

              <List>
                {currentCities.map((city) => (
                  <React.Fragment key={city._id}>
                    <ListItem>
                      <ListItemText primary={`${city.name} - Région : ${city.region}`} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>

              <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                <Pagination
                  count={Math.ceil(displayedCities.length / citiesPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CityManagementPage;
