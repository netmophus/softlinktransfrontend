
import React, { useState, useEffect } from "react";
import { Container, TextField, Button, MenuItem, Typography, Box, Alert, Grid, FormControlLabel, Switch, Divider } from "@mui/material";
import api from "../../services/api";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

import { useAuth } from "../../context/AuthContext"; // 📌 Assure-toi que ce chemin est correct





const SendTransferForm = () => {
  const [cities, setCities] = useState([]);
  const [transfer, setTransfer] = useState({
    senderFirstName: "",
    senderLastName: "",
    senderPhone: "",
    senderCity: "",
    receiverName: "",
    receiverPhone: "",
    receiverCity: "",
    amount: "",
    deductFeesFromAmount: false, // ✅ Option pour prélever la commission/taxe sur le montant envoyé
  });

  const [commission, setCommission] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [givenAmount, setGivenAmount] = useState("");
  const [change, setChange] = useState(0);
  const [secretCode, setSecretCode] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth(); // ✅ Accès aux infos du caissier connecté

  useEffect(() => {
    api.get("/admin/cities")
      .then((res) => setCities(res.data))
      .catch((err) => console.error("❌ Erreur chargement des villes :", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setTransfer((prevState) => ({
      ...prevState,
      [name]: value
    }));
  
    if (name === "amount" && value) {
      const amount = parseFloat(value);
      if (isNaN(amount) || amount <= 0) return; // Empêche les valeurs invalides
  
      api.post("/cashier/calculate-fees", { amount })
        .then((res) => {
          const { commission, tax } = res.data;
          setCommission(commission);
          setTax(tax);
  
          // ✅ Mise à jour immédiate du total en fonction du switch
          setTotalCost(transfer.deductFeesFromAmount ? amount - (commission + tax) : amount + commission + tax);
        })
        .catch((err) => console.error("Erreur lors du calcul des frais :", err));
    }
  };
  
  
  const handleSwitchChange = (e) => {
    const newDeductFeesFromAmount = e.target.checked;
  
    setTransfer((prevState) => ({
      ...prevState,
      deductFeesFromAmount: newDeductFeesFromAmount
    }));
  
    if (transfer.amount) {
      const amount = parseFloat(transfer.amount);
      setTotalCost(newDeductFeesFromAmount ? amount - (commission + tax) : amount + commission + tax);
    }
  };
  

  useEffect(() => {
    if (givenAmount && totalCost) {
      setChange(parseFloat(givenAmount) - totalCost);
    }
  }, [givenAmount, totalCost]);
  

  // ✅ Mise à jour des frais et du montant total à chaque changement



  // ✅ Mise à jour de la monnaie à rendre
  useEffect(() => {
    if (givenAmount && totalCost) {
      setChange(parseFloat(givenAmount) - totalCost);
    }
  }, [givenAmount, totalCost]);


  const handleTransfer = async () => {
    setError("");
    setSuccess("");
  
    // Injecter la ville du caissier connecté et formater les numéros de téléphone
    const updatedTransfer = {
      ...transfer,
      senderCity: user.city,
      senderPhone: transfer.senderPhone.startsWith("+227") ? transfer.senderPhone : `+227${transfer.senderPhone}`,
      receiverPhone: transfer.receiverPhone.startsWith("+227") ? transfer.receiverPhone : `+227${transfer.receiverPhone}`
    };
  
    // Vérifier que tous les champs sont bien remplis
    if (
      !updatedTransfer.senderFirstName ||
      !updatedTransfer.senderLastName ||
      !updatedTransfer.senderPhone ||
      !updatedTransfer.senderCity ||
      !updatedTransfer.receiverName ||
      !updatedTransfer.receiverPhone ||
      !updatedTransfer.receiverCity ||
      !updatedTransfer.amount
    ) {
      setError("⚠️ Tous les champs sont requis.");
      return;
    }
  
    try {
      const response = await api.post("/cashier/inter-city-transfer", updatedTransfer);
  
      setSecretCode(response.data.secretCode);
      setReceiptUrl(response.data.receiptUrl);
      setSuccess("✅ Transfert effectué avec succès !");
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Erreur lors du transfert.");
    }
  };
  



  // const handleDownloadReceipt = () => {
  //   if (receiptUrl) {
  //     window.open(receiptUrl, "_blank");
  //   }
  // };





const generatePDF = async () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Reçu de Transfert Interville", 20, 20);
    doc.setFontSize(12);
  
    doc.text(`Expéditeur : ${transfer.senderFirstName} ${transfer.senderLastName}`, 20, 40);
    doc.text(`Téléphone : ${transfer.senderPhone}`, 20, 50);
    doc.text(`Ville d'envoi : ${cities.find(c => c._id === transfer.senderCity)?.name || ''}`, 20, 60);
  
    doc.text(`Bénéficiaire : ${transfer.receiverName}`, 20, 80);
    doc.text(`Téléphone : ${transfer.receiverPhone}`, 20, 90);
    doc.text(`Ville de retrait : ${cities.find(c => c._id === transfer.receiverCity)?.name || ''}`, 20, 100);
  
    doc.text(`Montant envoyé : ${transfer.amount} XOF`, 20, 120);
    doc.text(`Commission : ${commission} XOF`, 20, 130);
    doc.text(`Taxe : ${tax} XOF`, 20, 140);
    doc.text(`Montant total payé : ${totalCost} XOF`, 20, 150);
  
    doc.setFontSize(14);
    doc.text(`Code Secret : ${secretCode}`, 20, 170);
  
    try {
      // 🔹 Générer un QR Code contenant les infos du transfert
      const qrData = JSON.stringify({
        senderFirstName: transfer.senderFirstName,
        senderLastName: transfer.senderLastName,
        senderPhone: transfer.senderPhone,
        receiverName: transfer.receiverName,
        receiverPhone: transfer.receiverPhone,
        amount: transfer.amount,
        secretCode: secretCode,
      });
  
      const qrCodeBase64 = await QRCode.toDataURL(qrData);
  
      // 🔹 Ajouter l'image du QR Code au PDF
      doc.addImage(qrCodeBase64, "PNG", 150, 20, 40, 40);
  
    } catch (err) {
      console.error("❌ Erreur lors de la génération du QR Code :", err);
    }
  
    doc.save(`recu_${secretCode}.pdf`);
  };
  

  const handleSenderPhoneChange = async (e) => {
    let raw = e.target.value.trim();
  
    if (!raw.startsWith("+227") && raw.length >= 8) {
      raw = `+227${raw}`;
    }
  
    setTransfer((prev) => ({ ...prev, senderPhone: raw }));
  
    // 🔎 On cherche uniquement si le numéro est complet
    if (raw.length === 13) {
      try {
        const response = await api.get(`/cashier/check-sender/${raw}`);
  
        if (response.data.exists) {
          setTransfer((prev) => ({
            ...prev,
            senderFirstName: response.data.senderFirstName,
            senderLastName: response.data.senderLastName,
          }));
        } else {
          // Pas d'affichage d’erreur : c’est juste un nouveau client
          console.info("ℹ️ Nouveau sender, à remplir manuellement");
          setTransfer((prev) => ({
            ...prev,
            senderFirstName: "",
            senderLastName: "",
          }));
        }
      } catch (error) {
        console.error("❌ Erreur lors de la vérification du sender :", error);
      }
    }
  };
  
  
  
  


  const handleReceiverPhoneChange = (e) => {
    let raw = e.target.value.trim();
  
    if (raw.startsWith("+227")) {
      raw = raw.slice(4);
    }
  
    setTransfer((prev) => ({
      ...prev,
      receiverPhone: raw
    }));
  };
  
  
  

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, p: 3, marginBottom:20, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Transfert Interville
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* Informations de l'expéditeur */}
        <Typography variant="h6">Expéditeur</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
         

          <TextField
          label="Téléphone Expéditeur"
          name="senderPhone"
          fullWidth
          value={transfer.senderPhone.startsWith("+227") ? transfer.senderPhone : `+227${transfer.senderPhone}`}
          onChange={handleSenderPhoneChange}
          required
        />


          </Grid>



          <Grid item xs={12} md={4}>
  <TextField 
    label="Prénom Expéditeur" 
    name="senderFirstName" 
    fullWidth 
    value={transfer.senderFirstName} // ✅ Affichage direct
    onChange={handleChange} 
    required 
  />
</Grid>

<Grid item xs={12} md={4}>
  <TextField 
    label="Nom Expéditeur" 
    name="senderLastName" 
    fullWidth 
    value={transfer.senderLastName} // ✅ Affichage direct
    onChange={handleChange} 
    required 
  />
</Grid>



          <Grid item xs={12}>
          {user && cities.length > 0 && (
  <TextField
    label="Ville d'envoi"
    fullWidth
    value={cities.find((city) => city._id === user.city)?.name || "Chargement..."}
    InputProps={{ readOnly: true }}
    sx={{ mt: 2 }}
  />
)}

          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Informations du bénéficiaire */}
        <Typography variant="h6">Bénéficiaire</Typography>
        <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
        <TextField
          label="Téléphone Bénéficiaire"
          name="receiverPhone"
          fullWidth
          value={`+227${transfer.receiverPhone}`}
          onChange={handleReceiverPhoneChange}
          inputProps={{ maxLength: 13 }}
          required
        />



          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Nom Bénéficiaire" name="receiverName" fullWidth onChange={handleChange} required />
          </Grid>
          
          <Grid item xs={12}>
            <TextField select label="Ville de retrait" name="receiverCity" fullWidth onChange={handleChange} required>
              {cities.map((city) => (
                <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Montant & calcul des frais */}
        <Typography variant="h6">Montant et Frais</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Montant (XOF)" name="amount" type="number" fullWidth onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Switch checked={transfer.deductFeesFromAmount} onChange={handleSwitchChange} />}
              label="Prélever les frais sur le montant envoyé"
            />
          </Grid>
        </Grid>
        <Typography sx={{ mt: 2 }}>Commission : {commission} XOF</Typography>
        <Typography>Taxe : {tax} XOF</Typography>
        <Typography sx={{ fontWeight: "bold" }}>Montant total à payer : {totalCost} XOF</Typography>

        {/* Calcul de la monnaie */}
        <TextField
          label="Montant donné par le sender"
          type="number"
          fullWidth
          sx={{ mt: 2 }}
          onChange={(e) => setGivenAmount(e.target.value)}
        />
        <Typography sx={{ fontWeight: "bold", mt: 1 }}>Monnaie à rendre : {change >= 0 ? change : 0} XOF</Typography>

        {/* Boutons */}
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleTransfer}>
          Effectuer le Transfert
        </Button>

        {/* {receiptUrl && (
          <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleDownloadReceipt}>
            Télécharger le Reçu
          </Button>
        )} */}


{secretCode && (
  <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={generatePDF}>
    Télécharger le Reçu en PDF
  </Button>
)}

      </Box>
    </Container>
  );
};

export default SendTransferForm;