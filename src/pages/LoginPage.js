import React, { useState } from "react";
import { Container, TextField, Button, Typography, InputAdornment,  Box, Alert, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Link } from "react-router-dom";
import ResetPinModal from "../components/user/ResetPinModal"; // ajuste le chemin si besoin

const LoginPage = () => {
  //const { step, requestOTP, verifyOTP, setUser, setAuthenticated , setIsAuthenticated } = useAuth();

  const { step, requestOTP, verifyOTP, setUser, setIsAuthenticated } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("otp");
  const navigate = useNavigate();

// État pour contrôler l'ouverture du modal ResetPin
const [openResetModal, setOpenResetModal] = useState(false);


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  
  const fullPhone = phone.startsWith("+")
    ? phone 
    : phone.startsWith("0")
      ? `+227${phone.slice(1)}`
      : `+227${phone}`;

  try {
    if (loginMethod === "otp") {  // 🔑 Connexion par OTP
      await requestOTP(fullPhone, password);
    } 
    else if (loginMethod === "password") {  // 🔑 Connexion par mot de passe uniquement
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { 
        phone: fullPhone, 
        password,
        method: "password" 
      });

      if (response.data.token) { 
        console.log("✅ Connexion réussie par mot de passe.");
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate(`/${response.data.user.role}/dashboard`);
      } 
      else if (response.data.forceChangePIN) { 
        console.log("⚠️ Votre compte n'est pas activé. Veuillez changer votre PIN temporaire.");
        navigate("/change-pin", { state: { phone: fullPhone } }); // 🔥 Redirection vers `ChangePinPage`
      }
    } 
    else if (loginMethod === "pin") {  // 🔑 Connexion par PIN
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { 
        phone: fullPhone, 
        pin, 
        method: "pin" 
      });

      if (response.data.forceChangePIN) { 
        console.log("⚠️ PIN temporaire détecté. Redirection vers la page de changement de PIN.");
        navigate("/change-pin", { state: { phone: fullPhone } }); // 🔥 Redirection vers `ChangePinPage`
      } 
      else if (response.data.token) { // Connexion normale
        console.log("✅ Connexion réussie par PIN.");
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate(`/${response.data.user.role}/dashboard`);
      }
    }
  } catch (err) {
    const errorMsg = err.response?.data?.msg || "Une erreur s'est produite !";
    console.log("❌ Erreur lors de la connexion :", errorMsg);
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};

  
  const handleOTPValidation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await verifyOTP(otp);
  
      if (response && response.data && response.data.token) { 
        localStorage.setItem("token", response.data.token); 
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate("/admin/dashboard"); 
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Une erreur s'est produite !";
      
      // 🔥 Gestion des erreurs spécifiques
      if (errorMsg.includes("désactivé")) {
        setError("Votre compte est désactivé. Veuillez contacter votre superviseur ou administrateur.");
      } else if (errorMsg.includes("pas activé")) {
        setError("Votre compte n'est pas activé. Veuillez contacter votre superviseur pour l'activer.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
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
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          {step === 1 ? "Connexion" : "Validation OTP"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {step === 1 ? (
          <form onSubmit={handleLogin}>

<TextField
  label="Téléphone"
  fullWidth
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
  sx={{ mb: 2 }}
  InputProps={{
    startAdornment: <InputAdornment position="start">+227</InputAdornment>,
  }}
/>


            {/* Choix de la méthode de connexion */}
            {/* <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Méthode de connexion</InputLabel>
              <Select
                value={loginMethod}
                label="Méthode de connexion"
                onChange={(e) => setLoginMethod(e.target.value)}
              >
                <MenuItem value="otp">Connexion par OTP</MenuItem>
                <MenuItem value="pin">Connexion par PIN</MenuItem>
              </Select>
            </FormControl> */}


<FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel>Méthode de connexion</InputLabel>
  <Select
    value={loginMethod}
    label="Méthode de connexion"
    onChange={(e) => setLoginMethod(e.target.value)}
  >
    <MenuItem value="otp">Connexion par OTP</MenuItem>
    <MenuItem value="pin">Connexion par PIN</MenuItem>
    <MenuItem value="password">Connexion par Mot de Passe</MenuItem>
  </Select>
</FormControl>




            
              {/* Affichage dynamique du champ de saisie selon la méthode choisie */}
{loginMethod === "otp" && (
  <TextField 
    label="Mot de passe" 
    type="password" 
    fullWidth 
    value={password} 
    onChange={(e) => setPassword(e.target.value)} 
    required 
    sx={{ mb: 2 }}
  />
)}

{loginMethod === "pin" && (
  <TextField 
    label="PIN" // ✅ On affiche bien "PIN" si c'est le mode "pin"
    type="password" 
    fullWidth 
    value={pin} 
    onChange={(e) => setPin(e.target.value)} 
    required 
    sx={{ mb: 2 }}
  />
)}

{loginMethod === "password" && (
  <TextField 
    label="Mot de passe" // ✅ On affiche bien "Mot de passe" si c'est le mode "password"
    type="password" 
    fullWidth 
    value={password} 
    onChange={(e) => setPassword(e.target.value)} 
    required 
    sx={{ mb: 2 }}
  />
)}
          

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Se connecter"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPValidation}>
            <TextField 
              label="Code OTP" 
              fullWidth 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
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
              {loading ? <CircularProgress size={24} /> : "Valider OTP"}
            </Button>
          </form>
        )}

<Typography variant="body2" sx={{ mt: 2 }}>
  Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link>
</Typography>

 {/* Bouton pour ouvrir le modal */}
 <Button onClick={() => setOpenResetModal(true)}>
        Réinitialiser PIN
      </Button>


      {/* Intégration du modal */}
      <ResetPinModal
        open={openResetModal}
        handleClose={() => setOpenResetModal(false)}
      />

      </Box>
    </Container>
  );
};

export default LoginPage;
