import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TextField, TableBody, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import CashRegisterTable from "../../components/supervisor/CashRegisterTable";

const CashRegisterManagement = () => {
  const [cashRegisters, setCashRegisters] = useState([]);
  const [cashiers, setCashiers] = useState([]); 
  const [selectedCashier, setSelectedCashier] = useState(""); 
  const [openingAmount, setOpeningAmount] = useState(""); 
  const [initialBalance, setInitialBalance] = useState(""); 
  const navigate = useNavigate();

  const [selectedCashRegister, setSelectedCashRegister] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success ou error
  

  const [openWithdrawModal, setOpenWithdrawModal] = useState(false); // État du modal de retrait
const [selectedRegisterWithdrawId, setSelectedRegisterWithdrawId] = useState(""); // ID de la caisse sélectionnée pour retrait
const [withdrawAmount, setWithdrawAmount] = useState(""); // Montant du retrait



const handleOpenWithdrawModal = (registerId) => {
    setSelectedRegisterWithdrawId(registerId);
    setOpenWithdrawModal(true);
  };


  const handleCloseWithdrawModal = () => {
    setSelectedRegisterWithdrawId("");
    setWithdrawAmount("");
    setOpenWithdrawModal(false);
  };
  

  const handleWithdrawFunds = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }
  
    try {
      console.log("📌 Retrait de fonds demandé pour la caisse :", selectedRegisterWithdrawId, "| Montant :", withdrawAmount);
      const response = await api.put(`/supervisor/cash-registers/withdraw-funds/${selectedRegisterWithdrawId}`, {
        withdrawalAmount: parseFloat(withdrawAmount),
      });
  
      console.log("✅ Retrait effectué avec succès :", response.data);
  
      // ✅ Mise à jour immédiate de l'affichage
      setCashRegisters((prevRegisters) =>
        prevRegisters.map((register) =>
          register._id === selectedRegisterWithdrawId
            ? { ...register, currentBalance: response.data.currentBalance }
            : register
        )
      );
  
      // ✅ Mise à jour du modal si la caisse est sélectionnée
      if (selectedCashRegister && selectedCashRegister._id === selectedRegisterWithdrawId) {
        setSelectedCashRegister((prevRegister) => ({
          ...prevRegister,
          currentBalance: response.data.currentBalance,
        }));
      }
  
      handleCloseWithdrawModal();

      setMessage("✅ Retrait effectué avec succès !");
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      



    } catch (err) {
      setMessage("❌ Erreur lors du retrait de fonds.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);

    }
  };
  

  
const handleOpenModal = (cashRegister) => {
  setSelectedCashRegister(cashRegister);
  setOpenModal(true);
};

const handleCloseModal = () => {
  setOpenModal(false);
  setSelectedCashRegister(null);
};



  useEffect(() => {
    fetchCashRegisters();
    fetchCashiers();
  }, []);

  // ✅ Met à jour le solde initial dès que le montant d'ouverture change
  useEffect(() => {
    setInitialBalance(openingAmount);
  }, [openingAmount]);

  const fetchCashRegisters = async () => {
    try {
      const response = await api.get("/supervisor/cash-registers");
      console.log("✅ Caisses récupérées :", response.data); // Vérification du currentBalance
      setCashRegisters(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des caisses", err);
    }
  };
  

  const fetchCashiers = async () => {
    try {
      const response = await api.get("/supervisor/cashiers");
      setCashiers(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des caissiers", err);
    }
  };

  const handleOpenCashRegister = async () => {
    console.log("📌 Ouverture d'une nouvelle caisse demandée.");
  
    if (!selectedCashier || !openingAmount) {
      alert("Veuillez sélectionner un caissier et entrer un montant d'ouverture.");
      console.log("⚠️ Erreur : Caissier ou montant d'ouverture manquant.");
      return;
    }

    setInitialBalance(openingAmount);

    console.log("✅ Paramètres validés - Caissier:", selectedCashier, "| Montant d'ouverture:", openingAmount, "| Solde initial:", initialBalance);

    try {
      const response = await api.post("/supervisor/cash-registers/open", {
        cashierId: selectedCashier,
        openingAmount: parseFloat(openingAmount),
        initialBalance: parseFloat(initialBalance),
        currentBalance: parseFloat(openingAmount), // ✅ Ajout de `currentBalance`
      });

      console.log("✅ Réponse reçue du serveur :", response.data);

      fetchCashRegisters();

      setMessage("✅ Caisse créée avec succès !");
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      



      setSelectedCashier("");
      setOpeningAmount("");
      setInitialBalance("");

      console.log("✅ Caisse ouverte et liste mise à jour.");
    } catch (err) {
      setMessage("❌ Erreur lors de l'ouverture de la caisse. Vérifiez si une caisse n'est pas déjà ouverte.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);

    }
  };






  const [openFundModal, setOpenFundModal] = useState(false); // État du modal
  const [selectedRegisterId, setSelectedRegisterId] = useState(""); // ID de la caisse sélectionnée
  const [fundAmount, setFundAmount] = useState(""); // Montant à ajouter
  
  // Ouvrir le modal pour une caisse spécifique
  const handleOpenFundModal = (registerId) => {
    setSelectedRegisterId(registerId);
    setOpenFundModal(true);
  };


  
  
  // Fermer le modal
  const handleCloseFundModal = () => {
    setSelectedRegisterId("");
    setFundAmount("");
    setOpenFundModal(false);
  };
  
  // Gérer l'ajout de fonds

  
const handleAddFunds = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }
  
    try {
      console.log("📌 Ajout de fonds pour la caisse :", selectedRegisterId, "| Montant :", fundAmount);
      const response = await api.put(`/supervisor/cash-registers/add-funds/${selectedRegisterId}`, {
        amount: parseFloat(fundAmount),
      });
  
      console.log("✅ Fonds ajoutés :", response.data);
      setMessage("✅ Fonds ajoutés avec succès !");
      setMessageType("success");
      console.log("✅ Fonds ajoutés :", response.data);
  
      // ✅ Mettre à jour l'affichage immédiatement
      setCashRegisters((prevRegisters) =>
        prevRegisters.map((register) =>
          register._id === selectedRegisterId
            ? { ...register, currentBalance: response.data.currentBalance } // 🔹 Mise à jour dynamique
            : register
        )
      );
  
      // ✅ Mise à jour du modal si la caisse est sélectionnée
      if (selectedCashRegister && selectedCashRegister._id === selectedRegisterId) {
        setSelectedCashRegister((prevRegister) => ({
          ...prevRegister,
          currentBalance: response.data.currentBalance,
        }));
      }
  
      handleCloseFundModal(); // ✅ Fermer le modal après ajout des fonds
    } catch (err) {
      setMessage("❌ Erreur lors de l'ajout de fonds.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);

    }
  };
  




  // const handleCloseCashRegister = async (id) => {
  //   const closingAmount = window.prompt("Entrez le montant de fermeture de la caisse :");
  
  //   if (!closingAmount || isNaN(closingAmount)) {
  //     alert("Montant invalide.");
  //     return;
  //   }
  
  //   try {
  //     const response = await api.put(`/supervisor/cash-registers/close/${id}`, {
  //       closingAmount: parseFloat(closingAmount),
  //     });
  
  //     console.log("✅ Réponse de fermeture :", response.data);
  
  //     fetchCashRegisters(); // 🔁 Rafraîchir la liste après fermeture
  
  //     // ✅ Afficher les infos du rapport
  //     const { expectedClosingAmount, discrepancy } = response.data;
  
  //     alert(
  //       `✅ Caisse fermée avec succès !\n\nMontant attendu : ${expectedClosingAmount} XOF\nÉcart : ${discrepancy} XOF`
  //     );
  
  //     setMessage("✅ Caisse fermée avec succès !");
  //     setMessageType("success");
  //     setTimeout(() => {
  //       setMessage("");
  //       setMessageType("");
  //     }, 5000);
  //   } catch (err) {
  //     console.error("❌ Erreur fermeture :", err);
  //     // setMessage("❌ Erreur lors de la fermeture de la caisse.");
  //     setMessage(
  //       err.response?.data?.msg
  //         ? "❌ " + err.response.data.msg
  //         : "❌ Erreur lors de la fermeture de la caisse."
  //     );
      
  //     setMessageType("error");
  //     setTimeout(() => {
  //       setMessage("");
  //       setMessageType("");
  //     }, 5000);
  //   }
  // };
  


  const handleCloseCashRegister = async (id) => {
    const closingAmount = window.prompt("Entrez le montant de fermeture de la caisse :");
  
    if (!closingAmount || isNaN(closingAmount)) {
      alert("Montant invalide.");
      return;
    }
  
    try {
      const response = await api.put(`/supervisor/cash-registers/close/${id}`, {
        closingAmount: parseFloat(closingAmount),
      });
  
      // ✅ Afficher les infos du rapport (optionnel)
      const { expectedClosingAmount, discrepancy } = response.data;
  
      alert(
        `✅ Caisse fermée avec succès !\n\nMontant attendu : ${expectedClosingAmount} XOF\nÉcart : ${discrepancy} XOF`
      );
  
      setMessage("✅ Caisse fermée avec succès !");
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
  
      // ✅ Naviguer vers la page des rapports de fermeture
      navigate("/supervisor/reports/closing");
  
    } catch (err) {
      setMessage(
        err.response?.data?.msg
          ? "❌ " + err.response.data.msg
          : "❌ Erreur lors de la fermeture de la caisse."
      );
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }
  };
  


  const handleReopenCashRegister = async (id) => {
    const justification = prompt("Justification pour la réouverture :");
    if (!justification) return alert("Justification requise.");
  
    try {
      const response = await api.put(`/supervisor/cash-registers/reopen/${id}`, { justification });
      console.log("✅ Caisse réouverte :", response.data);
      fetchCashRegisters(); // 🔄 Mettre à jour la liste après réouverture

      setMessage("✅ Caisse fermée avec succès !");
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      


    } catch (err) {
      setMessage("❌ Erreur lors de la fermeture de la caisse.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      
    }
  };
  

  const handleViewTransactions = (cashRegisterId) => {
    if (!cashRegisterId) {
      console.error("❌ Erreur : L'ID de la caisse est undefined !");
      return;
    }
    console.log(`📌 Navigation vers les transactions de la caisse : ${cashRegisterId}`);
    navigate(`/supervisor/cash-registers/${cashRegisterId}/transactions`); // ✅ Assurer la bonne formation de l'URL
  };
  
  




  return (
    <Container>
      <Button variant="contained" onClick={() => navigate("/supervisor/dashboard")}  sx={{ mt: 5}}>
        Retour au Dashboard
      </Button>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Gestion des Caisses
      </Typography>

      {/* 🔹 Sélection du caissier + Montant d'ouverture */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Choisir un caissier</InputLabel>
        <Select value={selectedCashier} onChange={(e) => setSelectedCashier(e.target.value)}>
          {cashiers.map((cashier) => (
            <MenuItem key={cashier._id} value={cashier._id}>
              {cashier.name} ({cashier.phone})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Montant d'ouverture"
        type="number"
        variant="outlined"
        value={openingAmount}
        onChange={(e) => setOpeningAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* 🔹 Le solde initial = montant d’ouverture */}
      <TextField
        label="Solde Initial"
        variant="outlined"
        type="number"
        value={initialBalance}
        disabled // 🔹 Désactiver pour éviter la saisie manuelle
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="success" onClick={handleOpenCashRegister}>
        Ouvrir une nouvelle caisse
      </Button>




      <Dialog open={openFundModal} onClose={handleCloseFundModal} fullWidth maxWidth="xs">
  <DialogTitle>Ajouter un Fond</DialogTitle>
  <DialogContent>
    <Typography>Entrez le montant à ajouter à cette caisse :</Typography>
    <TextField
      autoFocus
      margin="dense"
      label="Montant"
      type="number"
      fullWidth
      variant="outlined"
      value={fundAmount}
      onChange={(e) => setFundAmount(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseFundModal} color="error">Annuler</Button>
    <Button onClick={handleAddFunds} color="primary">Confirmer</Button>
  </DialogActions>
        </Dialog>







        <Dialog open={openWithdrawModal} onClose={handleCloseWithdrawModal} fullWidth maxWidth="sm">
  <DialogTitle>Retrait de Fonds</DialogTitle>
  <DialogContent>
    <Typography>Veuillez entrer le montant à retirer.</Typography>
    <TextField
      label="Montant à retirer"
      type="number"
      fullWidth
      variant="outlined"
      value={withdrawAmount}
      onChange={(e) => setWithdrawAmount(e.target.value)}
      sx={{ mt: 2 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseWithdrawModal} color="secondary">Annuler</Button>
    <Button onClick={handleWithdrawFunds} color="primary" variant="contained">
      Confirmer le retrait
    </Button>
  </DialogActions>
</Dialog>



<Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
  <DialogTitle>Détails de la Caisse</DialogTitle>
  <DialogContent dividers>
    {selectedCashRegister && (
      <>
        <Typography><strong>Caissier :</strong> {selectedCashRegister.cashier.name}</Typography>
        <Typography><strong>Montant Ouverture :</strong> {selectedCashRegister.openingAmount} XOF</Typography>
        <Typography><strong>Statut :</strong> {selectedCashRegister.status === "open" ? "Ouverte" : "Fermée"}</Typography>
        <Typography><strong>Solde Initial :</strong> {selectedCashRegister.initialBalance} XOF</Typography>
        <Typography><strong>Solde Actuel :</strong> {selectedCashRegister.currentBalance ?? "N/A"} XOF</Typography> {/* ✅ Vérifie ici */}

        {selectedCashRegister.status === "closed" && (
          <>
            <Typography><strong>Montant Fermeture :</strong> {selectedCashRegister.closingAmount} XOF</Typography>
            <Typography><strong>Écart :</strong> {selectedCashRegister.discrepancy} XOF</Typography>
            {selectedCashRegister.justification && (
              <Typography><strong>Justification :</strong> {selectedCashRegister.justification}</Typography>
            )}
          </>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal} color="primary">Fermer</Button>
  </DialogActions>
</Dialog>


{message && (
  <Typography
    variant="subtitle1"
    sx={{
      color: messageType === "error" ? "red" : "green",
      marginBottom: 2,
      fontWeight: "bold",
    }}
  >
    {message}
  </Typography>
)}


<CashRegisterTable
  cashRegisters={cashRegisters}
  handleOpenFundModal={handleOpenFundModal}
  handleOpenWithdrawModal={handleOpenWithdrawModal}
  handleCloseCashRegister={handleCloseCashRegister}
  handleReopenCashRegister={handleReopenCashRegister}
  handleViewTransactions={handleViewTransactions}
  handleOpenModal={handleOpenModal}

/>

    </Container>
  );
};

export default CashRegisterManagement;
