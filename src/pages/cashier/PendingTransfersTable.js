
import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, Stack } from "@mui/material";
import api from "../../services/api"; // ✅ Import de l'API
import ConfirmPaymentModal from "./ConfirmPaymentModal";

const PendingTransfersTable = () => {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [openModal, setOpenModal] = useState(false);
const [selectedTransfer, setSelectedTransfer] = useState(null);



const handleOpenModal = (transfer) => {
    setSelectedTransfer(transfer);
    setOpenModal(true);
  };

  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTransfer(null);
  };
  

  const confirmCancel = async (transferId) => {
    const confirm = window.confirm("❗ Es-tu sûr de vouloir annuler ce transfert ? Cette action est irréversible.");
    if (confirm) {
      await handleCancel(transferId);
    }
  };
  


  const handleConfirmPayment = async (secretCode) => {
    try {
        console.log(`📡 Envoi de la requête de paiement pour ID : ${selectedTransfer._id}`);

        const response = await api.post(`/cashier/pay-transfer/${selectedTransfer._id}`, { secretCode });

        console.log("✅ Réponse du serveur :", response.data);
        setSuccessMessage("✅ Paiement effectué avec succès !");
        setErrorMessage("");

        fetchPendingTransfers();
        handleCloseModal();
    } catch (error) {
        console.error("❌ Erreur lors du paiement :", error.response?.data || error);
        setErrorMessage(error.response?.data?.msg || "❌ Une erreur est survenue.");
    }
};

  
  
  
  
  useEffect(() => {
    fetchPendingTransfers();
  }, []);

  const fetchPendingTransfers = async () => {
    try {
      const response = await api.get("/cashier/pending-transfers");
      setPendingTransfers(response.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des transferts en attente :", error);
    }
  };

  // ✅ Fonction pour effectuer le paiement


  // ✅ Fonction pour annuler un transfert
  const handleCancel = async (transferId) => {
    try {
      await api.put(`/cashier/cancel-transfer/${transferId}`);
      setSuccessMessage("✅ Transfert annulé avec succès !");
      setErrorMessage("");

      // 🔄 Mettre à jour la liste après annulation
      fetchPendingTransfers();
    } catch (error) {
      console.error("❌ Erreur lors de l'annulation :", error);
      setErrorMessage("❌ Une erreur est survenue lors de l'annulation.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Transferts Interville en Attente
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TableContainer component={Paper}>
          <Table>
          <TableHead>
  <TableRow>
    <TableCell><strong>Expéditeur</strong></TableCell>
    <TableCell><strong>Téléphone Expéditeur</strong></TableCell>
    <TableCell><strong>Ville Expéditeur</strong></TableCell>
    <TableCell><strong>Bénéficiaire</strong></TableCell>
    <TableCell><strong>Téléphone Bénéficiaire</strong></TableCell>
    <TableCell><strong>Ville Bénéficiaire</strong></TableCell>
    <TableCell><strong>Montant</strong></TableCell>
    <TableCell><strong>Code Secret</strong></TableCell>
    <TableCell><strong>Actions</strong></TableCell>
  </TableRow>
</TableHead>

            <TableBody>
              {pendingTransfers.map((transfer) => (
               <TableRow key={transfer._id}>
               <TableCell>{transfer.senderFirstName} {transfer.senderLastName}</TableCell>
               <TableCell>{transfer.senderPhone}</TableCell>
               {/* <TableCell>{transfer.senderCityName}</TableCell> */}
               <TableCell>

  🏙️ {transfer.senderCity?.name}
</TableCell>
               <TableCell>{transfer.receiverName}</TableCell>
               <TableCell>{transfer.receiverPhone}</TableCell>
               {/* <TableCell>{transfer.receiverCityName}</TableCell> */}
               <TableCell>
 
  🏙️ {transfer.receiverCity?.name}
</TableCell>
               <TableCell>{transfer.amount.toLocaleString()} XOF</TableCell>
               <TableCell>{transfer.secretCode}</TableCell>
             
               <TableCell>
                 <Stack direction="row" spacing={1}>
                   <Button variant="contained" color="success" onClick={() => handleOpenModal(transfer)}>
                     Payer
                   </Button>
                   {/* <Button variant="outlined" color="error" onClick={() => handleCancel(transfer._id)}>
                     Annuler
                   </Button> */}

                    {/* <Button
                      variant="outlined"
                      color="error"
                      onClick={() => confirmCancel(transfer._id)}
                    >
                      Annuler
                    </Button> */}

                 </Stack>
               </TableCell>
             </TableRow>
             
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>




      <ConfirmPaymentModal
  open={openModal}
  onClose={handleCloseModal}
  transfer={selectedTransfer}
  onConfirm={handleConfirmPayment}
/>

    </Container>
  );
};

export default PendingTransfersTable;
