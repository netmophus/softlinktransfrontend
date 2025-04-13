
// import React, { useState } from "react";
// import { TextField, Button, Container, Typography, Box, Alert, MenuItem, Grid, IconButton, InputAdornment } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     password: "",
//     role: "",
//   });
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState(""); // ✅ Pour afficher le message de succès
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "phone") {
//       const cleanedPhone = value.replace(/\D/g, ""); 
//       setFormData({ ...formData, phone: cleanedPhone });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMessage("");

//     const formattedPhone = formData.phone.startsWith("+227") ? formData.phone : `+227${formData.phone}`;

//     const payload = { ...formData, phone: formattedPhone };

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, payload);
//       console.log("Inscription réussie :", response.data);

//       // ✅ Affichage du message de succès
//       setSuccessMessage("Inscription réussie ! Votre compte a été créé avec succès. Un SMS contenant votre PIN vous a été envoyé.");
      
//       // Rediriger vers la page de connexion après une courte pause (par exemple, 3 secondes)
//       setTimeout(() => navigate("/login"), 3000); 
      
//     } catch (err) {
//       setError(err.response?.data?.msg || "Une erreur est survenue");
//     }

//     setLoading(false);
//   };

//   const handleTogglePassword = () => setShowPassword(!showPassword);

//   return (
//     <Container maxWidth="md">
//       <Box 
//         sx={{ 
//           mt: 8, 
//           p: 4, 
//           boxShadow: 3, 
//           borderRadius: 3, 
//           textAlign: "center", 
//           backgroundColor: "#F9FAFB",
//         }}
//       >
//         <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
//           Inscription
//         </Typography>

//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>} {/* ✅ Message de succès */}

//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {/* Nom complet & Téléphone */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Nom complet"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Téléphone (96648383)"
//                 name="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 placeholder="96648383"
//               />
//             </Grid>

//             {/* Email & Mot de passe */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Email (optionnel)"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Mot de passe"
//                 name="password"
//                 type={showPassword ? "text" : "password"} 
//                 value={formData.password}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={handleTogglePassword}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>

//             {/* Rôle */}
//             <Grid item xs={12}>
//               <TextField
//                 select
//                 label="Rôle"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               >
//                 <MenuItem value="user">Utilisateur</MenuItem>
//                 <MenuItem value="admin">Administrateur</MenuItem>
//                 <MenuItem value="supervisor">Superviseur</MenuItem>
//                 <MenuItem value="cashier">Caissier</MenuItem>
//               </TextField>
//             </Grid>

//             {/* Bouton d'inscription */}
//             <Grid item xs={12}>
//               <Button 
//                 type="submit" 
//                 variant="contained" 
//                 color="primary" 
//                 fullWidth 
//                 sx={{ mt: 2 }}
//                 disabled={loading}
//               >
//                 {loading ? "Inscription en cours..." : "S'inscrire"}
//               </Button>
//             </Grid>
//           </Grid>
//         </form>

//         <Typography variant="body2" sx={{ mt: 2 }}>
//           Déjà un compte ? <Link to="/login">Se connecter</Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default RegisterPage;




import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Alert, MenuItem, Grid, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleanedPhone = value.replace(/\D/g, "");
      setFormData({ ...formData, phone: cleanedPhone });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formattedPhone = formData.phone.startsWith("+227") ? formData.phone : `+227${formData.phone}`;

    const payload = { ...formData, phone: formattedPhone };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, payload);
      console.log("Inscription réussie :", response.data);

      setSuccessMessage("Inscription réussie ! Votre compte a été créé avec succès. Un SMS contenant votre PIN vous a été envoyé.");

      setTimeout(() => navigate("/login"), 3000); 
      
    } catch (err) {
      if (err.response) {
        // Erreurs renvoyées par le backend
        setError(err.response.data.msg || "Une erreur est survenue.");
      } else if (err.request) {
        // Erreurs de réseau
        setError("Impossible de contacter le serveur. Veuillez vérifier votre connexion.");
      } else {
        // Erreur inattendue
        setError("Une erreur inattendue s'est produite.");
      }
    }

    setLoading(false);
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const isFormValid = formData.name && formData.phone && formData.password && formData.role;

  return (
    <Container maxWidth="md">
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
        <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
          Inscription
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom complet"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone (96648383)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
                placeholder="96648383"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email (optionnel)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mot de passe"
                name="password"
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Rôle"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="user">Utilisateur</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="supervisor">Superviseur</MenuItem>
                <MenuItem value="cashier">Caissier</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                disabled={loading || !isFormValid}
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
