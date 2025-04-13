// import React, { useState } from "react";
// import { Modal, Box, Typography, TextField, Button, Alert, InputAdornment } from "@mui/material";
// import axios from "axios";

// const ResetPinModal = ({ open, handleClose }) => {
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleResetPin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     // Formatage du numéro : s'il ne commence pas par "+", ajoute "+227"
//     const fullPhone = phone.startsWith("+")
//       ? phone 
//       : phone.startsWith("0")
//         ? `+227${phone.slice(1)}`
//         : `+227${phone}`;

//     try {
//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-pin`, { phone: fullPhone });
//       if (res.data && res.data.msg) {
//         setSuccess(res.data.msg);
//       }
//     } catch (err) {
//       setError(err.response?.data?.msg || "Erreur lors du reset du PIN");
//     } finally {
//       setLoading(false);
//     }
//   };



  

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           bgcolor: "background.paper",
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//           width: { xs: "90%", sm: "400px" },
//         }}
//       >
//         <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
//           Réinitialiser le PIN
//         </Typography>
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
//         <form onSubmit={handleResetPin}>
//           <TextField
//             label="Téléphone"
//             fullWidth
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             required
//             sx={{ mb: 2 }}
//             InputProps={{
//               startAdornment: <InputAdornment position="start">+227</InputAdornment>,
//             }}
//           />
//           <Button type="submit" variant="contained" fullWidth disabled={loading}>
//             {loading ? "Envoi en cours..." : "Envoyer nouveau PIN"}
//           </Button>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default ResetPinModal;



import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Alert, InputAdornment } from "@mui/material";
import axios from "axios";

const ResetPinModal = ({ open, handleClose }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Formatage du numéro avec le préfixe +227
    const fullPhone = phone.startsWith("+")
      ? phone 
      : phone.startsWith("0")
        ? `+227${phone.slice(1)}`
        : `+227${phone}`;

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-pin`, { phone: fullPhone });
      if (res.data && res.data.msg) {
        setSuccess(res.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur lors du reset du PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: { xs: "90%", sm: "400px" }
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Réinitialiser le PIN
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleResetPin}>
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
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ResetPinModal;
