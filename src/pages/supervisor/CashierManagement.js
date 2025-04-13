// import React, { useEffect, useState } from "react";
// import { 
//   Container, Typography, Button, Table, TableBody, TableCell, 
//   TableHead, TableRow, Paper, TextField, Box 
// } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../services/api";
// import CheckIcon from "@mui/icons-material/Check";
// import BlockIcon from "@mui/icons-material/Block";
// import AddIcon from "@mui/icons-material/Add";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";

// const CashierManagement = () => {
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const [cashiers, setCashiers] = useState([]);
//   const [newCashier, setNewCashier] = useState({ name: "", phone: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchCashiers();
//   }, []);

//   const fetchCashiers = async () => {
//     try {
//       const response = await api.get("/supervisor/cashiers", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       setCashiers(response.data);
//     } catch (err) {
//       console.error("Erreur lors de la récupération des caissiers :", err);
//     }
//   };

//   const handleCreateCashier = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       await api.post("/supervisor/create-cashier", newCashier, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       fetchCashiers();
//       setNewCashier({ name: "", phone: "", password: "" });
//     } catch (err) {
//       setError("Erreur lors de la création.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleCashierStatus = async (id, isActive) => {
//     try {
//       await api.put(`/supervisor/toggle-cashier/${id}`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       fetchCashiers();
//     } catch (err) {
//       console.error("Erreur lors du changement de statut :", err);
//     }
//   };


//   const handleGoBack = () => {
//     navigate("/supervisor/dashboard"); // Redirige vers le tableau de bord admin
//   };

//   return (
//     <Container>
   
// <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//   <Button
//     variant="contained"
//     color="secondary"
//     startIcon={<ArrowBackIcon />}
//     onClick={handleGoBack}
//   >
//     Retour au Dashboard
//   </Button>
// </Box>


//       {/* 📌 Formulaire de création d'un caissier */}
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6">Créer un nouveau caissier</Typography>
//         <Box display="flex" gap={2} sx={{ mt: 2 }}>
//           <TextField
//             label="Nom"
//             variant="outlined"
//             value={newCashier.name}
//             onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
//           />
//           <TextField
//             label="Téléphone"
//             variant="outlined"
//             value={newCashier.phone}
//             onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })}
//           />
//           <TextField
//             label="Mot de passe"
//             type="password"
//             variant="outlined"
//             value={newCashier.password}
//             onChange={(e) => setNewCashier({ ...newCashier, password: e.target.value })}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={handleCreateCashier}
//             disabled={loading}
//           >
//             Ajouter
//           </Button>
//         </Box>
//       </Paper>

//       {/* 📌 Liste des caissiers */}
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>Liste des caissiers</Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Nom</TableCell>
//               <TableCell>Téléphone</TableCell>
//               <TableCell>Statut</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {cashiers.map((cashier) => (
//               <TableRow key={cashier._id}>
//                 <TableCell>{cashier.name}</TableCell>
//                 <TableCell>{cashier.phone}</TableCell>
//                 <TableCell>{cashier.isActive ? "✅ Actif" : "❌ Inactif"}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     color={cashier.isActive ? "error" : "success"}
//                     startIcon={cashier.isActive ? <BlockIcon /> : <CheckIcon />}
//                     onClick={() => handleToggleCashierStatus(cashier._id, cashier.isActive)}
//                   >
//                     {cashier.isActive ? "Désactiver" : "Activer"}
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Container>
//   );
// };

// export default CashierManagement;






import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableHead, TableRow, Paper, TextField, Box, Card, CardContent, Alert, Divider, Pagination
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { InputAdornment } from "@mui/material";

const CashierManagement = () => {
  const navigate = useNavigate();
  const [cashiers, setCashiers] = useState([]);
  const [newCashier, setNewCashier] = useState({ name: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCashiers();
  }, []);

  const fetchCashiers = async () => {
    try {
      const response = await api.get("/supervisor/cashiers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCashiers(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des caissiers :", err);
    }
  };

  const handleCreateCashier = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const formattedPhone = newCashier.phone.startsWith("+227")
        ? newCashier.phone
        : `+227${newCashier.phone}`;

      await api.post("/supervisor/create-cashier", { ...newCashier, phone: formattedPhone }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      fetchCashiers();
      setNewCashier({ name: "", phone: "", password: "" });
      setSuccessMessage("✅ Caissier créé avec succès !");
    } catch (err) {
      setError("❌ Erreur lors de la création du caissier.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCashierStatus = async (id, isActive) => {
    try {
      await api.put(`/supervisor/toggle-cashier/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchCashiers();
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCashiers = cashiers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/supervisor/dashboard")}
        >
          Retour au Dashboard
        </Button>
      </Box>

      <Box display="flex" gap={3}>
        {/* Formulaire de création d'un caissier */}
        <Card sx={{ width: "35%", borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
              Créer un Nouveau Caissier
            </Typography>
            <Divider sx={{ my: 2 }} />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nom"
                variant="outlined"
                value={newCashier.name}
                onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Téléphone"
                variant="outlined"
                value={newCashier.phone}
                onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">+227</InputAdornment>
                }}
                placeholder="96648383"
              />
              <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                value={newCashier.password}
                onChange={(e) => setNewCashier({ ...newCashier, password: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateCashier}
                disabled={loading}
                fullWidth
              >
                Ajouter
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Liste des caissiers */}
        <Paper sx={{ p: 3, width: "65%", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Liste des Caissiers</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentCashiers.map((cashier) => (
                <TableRow key={cashier._id}>
                  <TableCell>{cashier.name}</TableCell>
                  <TableCell>{cashier.phone}</TableCell>
                  <TableCell>{cashier.isActive ? "✅ Actif" : "❌ Inactif"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={cashier.isActive ? "error" : "success"}
                      startIcon={cashier.isActive ? <BlockIcon /> : <CheckIcon />}
                      onClick={() => handleToggleCashierStatus(cashier._id, cashier.isActive)}
                    >
                      {cashier.isActive ? "Désactiver" : "Activer"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(cashiers.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CashierManagement;
