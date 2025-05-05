import React, { useEffect, useState } from "react";
import { Container, Typography, Table,  TableBody, TableCell, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";


import api from "../../services/api";

const CashierInterCityHistory = () => {
  const [transfers, setTransfers] = useState([]);

  const [openModal, setOpenModal] = useState(false);
const [selectedTransfer, setSelectedTransfer] = useState(null);
const [formData, setFormData] = useState({
  receiverName: "",
  receiverPhone: "",
  receiverCity: "",
});

const [cities, setCities] = useState([]);


const fetchTransfers = async () => {
  try {
    const res = await api.get("/cashier/history/intercity");
    // setTransfers(res.data);
    setTransfers(res.data.transfers || []);

  } catch (err) {
    console.error("❌ Erreur chargement :", err);
  }
};

const fetchCities = async () => {
  try {
    const res = await api.get("/admin/cities"); // Assure-toi que le token est bien transmis
    setCities(res.data);
  } catch (err) {
    console.error("❌ Erreur chargement villes :", err);
  }
};

useEffect(() => {
  fetchTransfers();
  fetchCities(); // ✅ Chargement des villes
}, []);




  const handleEdit = (transfer) => {
    setSelectedTransfer(transfer);
    setFormData({
      receiverName: transfer.receiverName,
      receiverPhone: transfer.receiverPhone,
      receiverCity: transfer.receiverCity?._id || "", // si c’est un objet ou un ID
    });
    setOpenModal(true);
  };
  

  // const handleUpdate = async () => {
  //   try {
  //     await api.put(`/cashier/inter-city-transfer/${selectedTransfer._id}/modify`, formData);
  //     setOpenModal(false);
  //     fetchTransfers(); // ✅ maintenant bien défini
  //   } catch (err) {
  //     console.error("❌ Erreur mise à jour transfert :", err);
  //   }
  // };
  const handleUpdate = async () => {
    try {
      await api.put(`/cashier/inter-city-transfer/${selectedTransfer._id}/modify`, formData);
      setOpenModal(false);
      fetchTransfers();
    } catch (err) {
      console.error("❌ Erreur mise à jour transfert :", err);
  
      // Affichage d'un message explicite si la ville n’a pas de caisse ouverte
      if (err.response && err.response.data && err.response.data.msg) {
        alert(err.response.data.msg);
      } else {
        alert("❌ Une erreur est survenue lors de la mise à jour du transfert.");
      }
    }
  };
  
 
  

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Historique des Transferts Inter-Ville
      </Typography>

      <Paper sx={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expéditeur</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Bénéficiaire</TableCell>
              <TableCell>Ville de retrait</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {Array.isArray(transfers) && transfers.map((t) => (
    <TableRow key={t._id}>
                <TableCell>{`${t.senderFirstName} ${t.senderLastName}`}</TableCell>
                <TableCell>{t.senderPhone}</TableCell>
                <TableCell>{t.receiverName}</TableCell>
                <TableCell>{t.receiverCity?.name || "—"}</TableCell>

                <TableCell>{t.amount.toLocaleString()} XOF</TableCell>
                <TableCell>
                  <Chip
                    label={t.status}
                    color={
                      t.status === "completed"
                        ? "success"
                        : t.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                <TableCell>
  <Button
    variant="outlined"
    size="small"
    onClick={() => handleEdit(t)}
    disabled={t.status !== "pending"}
  >
    Modifier
  </Button>
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>


      <Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h6" mb={2}>Modifier le Transfert</Typography>

    <TextField
      fullWidth
      label="Nom du bénéficiaire"
      value={formData.receiverName}
      onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      label="Téléphone du bénéficiaire"
      value={formData.receiverPhone}
      onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
      sx={{ mb: 2 }}
    />

<TextField
  select
  fullWidth
  label="Ville de retrait"
  value={formData.receiverCity}
  onChange={(e) => setFormData({ ...formData, receiverCity: e.target.value })}
  sx={{ mb: 2 }}
>
  {cities.map((city) => (
    <MenuItem key={city._id} value={city._id}>
      {city.name}
    </MenuItem>
  ))}
</TextField>


    <Button variant="contained" onClick={handleUpdate} fullWidth>
      Valider les modifications
    </Button>
  </Box>
</Modal>

    </Container>
  );
};

export default CashierInterCityHistory;
