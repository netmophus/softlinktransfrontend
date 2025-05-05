// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Paper,
//   Box,
//   Alert,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../services/api";

// const frequencies = [
//   { value: "weekly", label: "Hebdomadaire" },
//   { value: "monthly", label: "Mensuel" },
// ];

// const EditTontinePage = () => {
//   const { tontineId } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     contributionAmount: "",
//     totalCycles: "",
//     frequency: "",
//     startDate: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchTontine = async () => {
//       if (!tontineId || tontineId === "undefined") {
//         setError("Tontine invalide ou non trouvée.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await api.get(`/api/tontines/${tontineId}`);

//         const tontine = res.data?.tontine || res.data;

//         const formattedStartDate = tontine.startDate
//           ? new Date(tontine.startDate).toISOString().split("T")[0]
//           : "";

//         setFormData({
//           name: tontine.name || "",
//           contributionAmount: tontine.contributionAmount || "",
//           totalCycles: tontine.totalCycles || "",
//           frequency: tontine.frequency || "",
//           startDate: formattedStartDate,
//         });
//       } catch (err) {
//         console.error("❌ Erreur lors du chargement :", err);
//         setError("Impossible de charger les informations de la tontine.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTontine();
//   }, [tontineId]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     setError("");

//     try {
//       await api.put(`/api/tontines/${tontineId}/update`, formData);
//       setMsg("✅ Tontine modifiée avec succès.");
//     } catch (err) {
//       setError(err.response?.data?.msg || "Erreur lors de la modification.");
//     }
//   };

//   if (loading) return <Typography>Chargement...</Typography>;

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h5" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
//         Modifier la tontine
//       </Typography>

//       {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Paper sx={{ p: 3 }}>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Nom de la tontine"
//             fullWidth
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Montant par cycle"
//             fullWidth
//             name="contributionAmount"
//             type="number"
//             value={formData.contributionAmount}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             label="Nombre total de cycles"
//             fullWidth
//             name="totalCycles"
//             type="number"
//             value={formData.totalCycles}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <TextField
//             select
//             label="Fréquence"
//             fullWidth
//             name="frequency"
//             value={formData.frequency}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           >
//             {frequencies.map((opt) => (
//               <MenuItem key={opt.value} value={opt.value}>
//                 {opt.label}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             label="Date de départ"
//             type="date"
//             fullWidth
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             sx={{ mb: 3 }}
//             InputLabelProps={{ shrink: true }}
//           />

//           <Box display="flex" justifyContent="flex-end">
//             <Button type="submit" variant="contained" color="primary">
//               Enregistrer les modifications
//             </Button>
//           </Box>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default EditTontinePage;



import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const frequencies = [
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
];

const EditTontinePage = () => {
  const { tontineId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contributionAmount: "",
    totalCycles: "",
    frequency: "",
    startDate: "",
  });

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTontine = async () => {
      if (!tontineId || tontineId === "undefined") {
        setError("Tontine invalide ou non trouvée.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/tontines/${tontineId}/edit-info`);

        const { tontine, members } = res.data;
        const formattedStartDate = tontine.startDate
          ? new Date(tontine.startDate).toISOString().split("T")[0]
          : "";

        setFormData({
          name: tontine.name || "",
          contributionAmount: tontine.contributionAmount || "",
          totalCycles: tontine.totalCycles || "",
          frequency: tontine.frequency || "",
          startDate: formattedStartDate,
        });

        setMembers(members || []);
      } catch (err) {
        console.error("❌ Erreur lors du chargement :", err);
        setError("Impossible de charger les informations de la tontine.");
      } finally {
        setLoading(false);
      }
    };

    fetchTontine();
  }, [tontineId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      await api.put(`/api/tontines/${tontineId}/update`, formData);
      setMsg("✅ Tontine modifiée avec succès.");
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur lors de la modification.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Confirmer la suppression de ce membre ?")) return;

    try {
      await api.delete(`/api/tontines/${tontineId}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err) {
      alert("❌ Erreur lors de la suppression.");
    }
  };

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Modifier la tontine
      </Typography>

      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom de la tontine"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Montant par cycle"
            fullWidth
            name="contributionAmount"
            type="number"
            value={formData.contributionAmount}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Nombre total de cycles"
            fullWidth
            name="totalCycles"
            type="number"
            value={formData.totalCycles}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Fréquence"
            fullWidth
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {frequencies.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date de départ"
            type="date"
            fullWidth
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary">
              Enregistrer les modifications
            </Button>
          </Box>
        </form>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>👥 Membres inscrits</Typography>
        {members.length === 0 ? (
          <Typography>Aucun membre pour le moment.</Typography>
        ) : (
          <List>
            {members.map((m) => (
              <ListItem key={m._id} divider>
                <ListItemText primary={`${m.user?.name || "Sans nom"} - ${m.user?.phone}`} />
                <IconButton onClick={() => handleRemoveMember(m._id)} edge="end" color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default EditTontinePage;
