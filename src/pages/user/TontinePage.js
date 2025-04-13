
import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Tabs,  TextField,  Button, Alert, Tab, Paper, Grid, List, ListItem, ListItemText } from "@mui/material";
import api from "../../services/api";
import CreateTontineForm from "./CreateTontineForm"; // ✅ Formulaire de création
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";


import { useAuth } from "../../context/AuthContext";






const TontinePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tontines, setTontines] = useState([]);

  const [searchedUser, setSearchedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [newMemberPhone, setNewMemberPhone] = useState("");
const [selectedTontine, setSelectedTontine] = useState(null);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");


const [confirmOpen, setConfirmOpen] = useState(false); // Gère l'affichage du modal
const [selectedPayment, setSelectedPayment] = useState(null); // Stocke les infos du paiement



const [assignModalOpen, setAssignModalOpen] = useState(false);
const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
const [selectedCycleForBeneficiary, setSelectedCycleForBeneficiary] = useState(null);
const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState("");



const { user } = useAuth(); // ✅ Récupérer l'utilisateur connecté
const currentUserId = user ? user._id : null; // ✅ Vérifie si user existe avant d'utiliser _id

useEffect(() => {
  console.log("Utilisateur connecté :", user); // ✅ Vérifie si l'utilisateur est bien récupéré
}, [user]);





const fetchMyTontines = async () => {
  try {
    console.log("📡 Envoi de la requête pour récupérer mes tontines...");
    const response = await api.get("/api/tontines/my-tontines");
    const tontinesData = response.data;

    // 🔹 Récupérer les paiements de l'utilisateur connecté
    for (const tontine of tontinesData) {
      try {
        const paymentsResponse = await api.get(`/api/tontines/${tontine._id}/my-details`);
        tontine.cycles = paymentsResponse.data.cycles || [];
        tontine.payments = paymentsResponse.data.payments || [];
      } catch (error) {
        console.error(`❌ Erreur lors du chargement des paiements pour la tontine ${tontine._id}:`, error);
      }
    }

    console.log("✅ Tontines récupérées avec paiements :", tontinesData);
    setTontines(tontinesData);
  } catch (error) {
    console.error("❌ Erreur lors du chargement des tontines :", error.response?.data || error.message);
  }
};




// 🔹 Charger les tontines dès qu'on ouvre "Mes Tontines" ou "Rejoindre une Tontine"
useEffect(() => {
    if (activeTab === 1 || activeTab === 2) {
        fetchMyTontines();
    }
}, [activeTab]);





  // ✅ Vérifier si l'utilisateur existe et l'ajouter à la tontine




const handleSearchUser = async () => {
  setError("");
  setSuccess("");

  const cleanedPhone = newMemberPhone.replace(/\D/g, "");

  if (!cleanedPhone || cleanedPhone.length !== 8) {
    setError("⚠️ Entrez un numéro de téléphone de 8 chiffres.");
    return;
  }

  const fullPhone = `+227${cleanedPhone}`;

  try {
    console.log("📡 Recherche de l'utilisateur avec téléphone :", fullPhone);

    const response = await api.get(`/api/tontines/find-by-phone/${fullPhone}`);
    console.log("✅ Réponse reçue :", response.data);

    setSearchedUser(response.data);
    setShowConfirmModal(true);
  } catch (error) {
    console.error("❌ Utilisateur introuvable :", error.response?.data || error.message);
    setError("⚠️ Aucun utilisateur trouvé avec ce numéro.");
  }
};


// ✅ Ajouter un membre après confirmation


const handleAddMember = async () => {
  setError("");
  setSuccess("");

  if (!selectedTontine || !selectedTontine._id) {
      setError("Veuillez sélectionner une tontine valide.");
      return;
  }

  try {
      console.log("📡 Ajout du membre avec téléphone :", newMemberPhone);
  
      const cleanedPhone = newMemberPhone.replace(/\D/g, ""); // Supprime tout sauf les chiffres
      const fullPhone = `+227${cleanedPhone}`;
  
      const response = await api.post(`/api/tontines/${selectedTontine._id}/add-member`, {
        phone: fullPhone,
      });

      console.log("✅ Membre ajouté avec succès :", response.data.tontinePayment);

      setSuccess(`Membre ajouté avec succès à la tontine : ${selectedTontine.name}`);
      setNewMemberPhone("");
      setShowConfirmModal(false);

      // ✅ Envoyer une notification au membre
      await api.post(`/api/tontines/${selectedTontine._id}/send-notification`, {
        phone: `+227${newMemberPhone}`,
        message: `Vous avez été ajouté à la tontine "${selectedTontine.name}". Contribution: ${selectedTontine.contributionAmount} XOF.`,
      });
      

      console.log("✅ Notification envoyée avec succès !");

      // 🔄 Rafraîchir la liste des tontines
      fetchMyTontines();

  } catch (error) {
      console.error("❌ Erreur lors de l'ajout du membre :", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Erreur lors de l'ajout du membre.");
  }
};



// const handlePayment = async (tontineId, userId, cycleId) => {
//   if (!userId) {
//     console.error("🚨 Erreur : userId est undefined !");
//     alert("Utilisateur non trouvé !");
//     return;
//   }

//   if (!cycleId) {
//     console.error("🚨 Erreur : cycleId est undefined !");
//     alert("Cycle introuvable !");
//     return;
//   }

//   console.log(`📡 Envoi du paiement avec tontineId: ${tontineId}, userId: ${userId}, cycleId: ${cycleId}`);

//   try {
//     const response = await api.post(`/api/tontines/${tontineId}/pay`, {
//       userId,
//       cycleId, // ✅ Utilise cycleId ici
//       paymentMethod: "compte_virtuel",
//     });

//     console.log("✅ Paiement réussi :", response.data);
//     alert("Paiement enregistré avec succès !");
//     fetchMyTontines(); // 🔄 Rafraîchir après paiement
//   } catch (error) {
//     console.error("❌ Erreur lors du paiement :", error.response?.data || error.message);
//     alert("Erreur lors du paiement.");
//   }
// };


const handlePayment = async (tontineId, userId, cycleId) => {
  if (!userId) {
    console.error("🚨 Erreur : userId est undefined !");
    setError("Erreur : Utilisateur non trouvé.");
    return;
  }

  if (!cycleId) {
    console.error("🚨 Erreur : cycleId est undefined !");
    setError("Erreur : Cycle de paiement introuvable.");
    return;
  }

  setError("");
  setSuccess("");

  try {
    const response = await api.post(`/api/tontines/${tontineId}/pay`, {
      userId,
      cycleId,
      paymentMethod: "compte_virtuel",
    });

    console.log("✅ Paiement réussi :", response.data);
    setSuccess("✅ Paiement enregistré avec succès !");
    fetchMyTontines();
  } catch (error) {
    console.error("❌ Erreur lors du paiement :", error.response?.data || error.message);

    // 🔥 Si c’est un blocage lié au mois du cycle ou autre, on le montre clairement
    if (error.response?.data?.msg) {
      setError(error.response.data.msg);
    } else {
      setError("❌ Erreur lors du paiement.");
    }
  }
};



const isCurrentMonthCycle = (dueDate) => {
  const now = new Date();
  const cycleDate = new Date(dueDate);
  return (
    now.getFullYear() === cycleDate.getFullYear() &&
    now.getMonth() === cycleDate.getMonth()
  );
};



  return (
    <Container maxWidth="md">

      <Box sx={{ mt: 5, p: 3, marginBottom:18, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          📌 Gestion des Tontines
        </Typography>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Créer une Tontine" />
          <Tab label="Mes Tontines" />
          <Tab label="Rejoindre une Tontine" />
        </Tabs>

        {/* ✅ Onglet pour créer une tontine */}
        {activeTab === 0 && <CreateTontineForm onTontineCreated={fetchMyTontines} />}

        {/* ✅ Onglet pour afficher "Mes Tontines" */}
      




        {activeTab === 1 && (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6">📋 Mes Tontines</Typography>
    {tontines.length === 0 ? (
      <Typography>Aucune tontine trouvée.</Typography>
    ) : (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {tontines.map((tontine) => (
          <Grid item xs={12} md={6} key={tontine._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {tontine.name}
              </Typography>
              <Typography variant="body2">
                Contribution : {tontine.contributionAmount} XOF
              </Typography>
              <Typography variant="body2">
                Cycles : {tontine.currentCycle} / {tontine.totalCycles}
              </Typography>

              {/* ✅ Liste des cycles */}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                📅 Échéanciers :
              </Typography>
              {tontine.cycles && tontine.cycles.length > 0 ? (
                <List dense>
                  {tontine.cycles.map((cycle, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={`Cycle ${cycle.cycleNumber} - Échéance : ${new Date(cycle.dueDate).toLocaleDateString()}`}
                        secondary={cycle.isCompleted ? "✅ Complété" : "⚠️ En attente"}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">Aucun cycle enregistré.</Typography>
              )}

              {/* ✅ Liste des paiements */}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                💰 Mes paiements :
              </Typography>
              {tontine.payments && tontine.payments.length > 0 ? (
                <List dense>
                  {tontine.payments.map((payment, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={`Cycle ${payment.cycle.cycleNumber} - ${payment.hasPaid ? `✅ Payé le ${new Date(payment.paymentDate).toLocaleDateString()}` : "⚠️ En attente de paiement"}`}
                      />
                 
                 {!payment.hasPaid && (
  <>
    {isCurrentMonthCycle(payment.cycle.dueDate) ? (
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{ ml: 2 }}
        onClick={() => {
          if (!currentUserId) {
            console.error("🚨 Erreur : L'utilisateur n'est pas défini !");
            alert("Erreur : Vous devez être connecté pour effectuer un paiement.");
            return;
          }

          if (!payment?.cycle?._id) {
            console.error("🚨 Erreur : Le cycle est introuvable !");
            alert("Erreur : Le cycle de paiement est introuvable.");
            return;
          }

          const confirmPayment = window.confirm(
            `Confirmez-vous le paiement du cycle ${payment.cycle.cycleNumber} ?`
          );

          if (confirmPayment) {
            console.log("📡 Paiement en cours pour le cycle :", payment.cycle);
            handlePayment(tontine._id, currentUserId, payment.cycle._id);
          }
        }}
      >
        Payer
      </Button>
    ) : (
      <Typography
        variant="body2"
        sx={{ color: "gray", fontStyle: "italic", ml: 2 }}
      >
        Paiement possible uniquement durant le mois du cycle
      </Typography>
    )}
  </>
)}



{!payment.hasPaid && currentUserId === tontine.initiator && (
  <Button
    variant="outlined"
    size="small"
    sx={{ ml: 1 }}
    color="secondary"
    onClick={() => {
      setSelectedCycleForBeneficiary(payment.cycle._id);
      setBeneficiaryOptions(tontine.members); // liste des membres
      setAssignModalOpen(true);
    }}
  >
    Désigner Bénéficiaire
  </Button>
)}




                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" sx={{ color: "red" }}>
                  Aucun paiement enregistré.
                </Typography>
              )}

              {/* ✅ Liste des membres */}
              {tontine.members && tontine.members.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                    👥 Participants :
                  </Typography>
                  <List dense>
                    {tontine.members.map((member, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={`👤 ${member.name} (${member.phone})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
)}




        



{activeTab === 2 && (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6">➕ Ajouter des membres</Typography>

    <TextField
  select
  label="Sélectionner une tontine"
  fullWidth
  variant="outlined"
  sx={{ mt: 2 }}
  value={selectedTontine ? selectedTontine._id : ""}
  onChange={(e) => {
    const tontine = tontines.find((t) => t._id === e.target.value);
    setSelectedTontine(tontine); // ✅ Mise à jour correcte de selectedTontine
    console.log("✅ Tontine sélectionnée :", tontine);
  }}
  SelectProps={{
    native: true,
  }}
>
  <option value="" disabled>Choisissez une tontine</option>
  {tontines.map((tontine) => (
    <option key={tontine._id} value={tontine._id}>
      {tontine.name} - {tontine.contributionAmount} XOF
    </option>
  ))}
</TextField>


    {/* ✅ Champ pour le numéro de téléphone */}
 {/* 🔹 Recherche du membre */}



 <TextField
  label="Numéro du membre"
  variant="outlined"
  fullWidth
  sx={{ mt: 2 }}
  value={newMemberPhone}
  InputProps={{
    startAdornment: <span style={{ marginRight: 8, fontWeight: "bold" }}>+227</span>,
    inputProps: {
      maxLength: 8,
      pattern: "[0-9]{8}",
    },
  }}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, ""); // Garde uniquement les chiffres
    setNewMemberPhone(raw);
  }}
  helperText="+227 est automatiquement ajouté"
/>



<Button
  variant="contained"
  color="primary"
  sx={{ mt: 2 }}
  onClick={handleSearchUser} // ✅ Recherche avant ajout
>
  Rechercher
</Button>

{/* ✅ Modal de confirmation */}
{showConfirmModal && searchedUser && (
  <Dialog open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
    <DialogTitle>Confirmer l'ajout</DialogTitle>
    <DialogContent>
      <Typography>
        Voulez-vous ajouter <strong>{searchedUser.name}</strong> ({searchedUser.phone}) à la tontine ?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setShowConfirmModal(false)} color="secondary">
        Annuler
      </Button>
      <Button onClick={() => handleAddMember(searchedUser._id)} color="primary" variant="contained">
        Ajouter
      </Button>
    </DialogActions>
  </Dialog>
)}


{selectedTontine && selectedTontine.members && selectedTontine.members.length >= 10 && (
  <Alert severity="warning" sx={{ mt: 2 }}>
    ⚠️ Cette tontine a déjà 10 participants. Vous ne pouvez plus ajouter de membres.
  </Alert>
)}



    {/* ✅ Message d'erreur ou de succès */}
    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
  </Box>
)}


<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirmation de paiement</DialogTitle>
  <DialogContent>
    <Typography>
      Voulez-vous vraiment payer votre contribution pour ce cycle ?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)} color="secondary">
      Annuler
    </Button>
    <Button
      onClick={() => {
        if (selectedPayment) {
          handlePayment(selectedPayment.tontineId, selectedPayment.userId, selectedPayment.cycleId);
        }
        setConfirmOpen(false);
      }}
      color="primary"
      variant="contained"
    >
      Confirmer
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
  <DialogTitle>Choisir un Bénéficiaire</DialogTitle>
  <DialogContent>
    <TextField
      select
      label="Membre à désigner"
      fullWidth
      value={selectedBeneficiaryId}
      onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
      sx={{ mt: 2 }}
      SelectProps={{ native: true }}
    >
      <option value="">-- Choisissez --</option>
      {beneficiaryOptions.map((member) => (
        <option key={member.user} value={member.user}>
          {member.name || member.phone}
        </option>
      ))}
    </TextField>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAssignModalOpen(false)} color="secondary">
      Annuler
    </Button>
    <Button
      onClick={async () => {
        try {
          const response = await api.post(
            `/api/tontines/${selectedTontine._id}/cycles/${selectedCycleForBeneficiary}/assign-beneficiary`,
            { beneficiaryId: selectedBeneficiaryId }
          );
          alert(response.data.msg);
          setAssignModalOpen(false);
          fetchMyTontines(); // refresh
        } catch (err) {
          alert(err.response?.data?.msg || "❌ Erreur lors de l’assignation.");
        }
      }}
      disabled={!selectedBeneficiaryId}
      variant="contained"
      color="primary"
    >
      Confirmer
    </Button>
  </DialogActions>
</Dialog>


      </Box>


      
    </Container>




  );
};

export default TontinePage;
