





// import React, { useState, useEffect } from "react";
// import { Container, TextField, Button, MenuItem, Typography, Box, Alert, Grid, FormControlLabel, Switch, Divider } from "@mui/material";
// import api from "../../services/api";
// import { jsPDF } from "jspdf";
// import QRCode from "qrcode";






// const InterCityTransferPage = () => {
//   const [cities, setCities] = useState([]);
//   const [transfer, setTransfer] = useState({
//     senderFirstName: "",
//     senderLastName: "",
//     senderPhone: "",
//     senderCity: "",
//     receiverName: "",
//     receiverPhone: "",
//     receiverCity: "",
//     amount: "",
//     deductFeesFromAmount: false, // ✅ Option pour prélever la commission/taxe sur le montant envoyé
//   });

//   const [commission, setCommission] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [totalCost, setTotalCost] = useState(0);
//   const [givenAmount, setGivenAmount] = useState("");
//   const [change, setChange] = useState(0);
//   const [secretCode, setSecretCode] = useState("");
//   const [receiptUrl, setReceiptUrl] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     api.get("/admin/cities")
//       .then((res) => setCities(res.data))
//       .catch((err) => console.error("❌ Erreur chargement des villes :", err));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
  
//     setTransfer((prevState) => ({
//       ...prevState,
//       [name]: value
//     }));
  
//     if (name === "amount" && value) {
//       const amount = parseFloat(value);
//       if (isNaN(amount) || amount <= 0) return; // Empêche les valeurs invalides
  
//       api.post("/cashier/calculate-fees", { amount })
//         .then((res) => {
//           const { commission, tax } = res.data;
//           setCommission(commission);
//           setTax(tax);
  
//           // ✅ Mise à jour immédiate du total en fonction du switch
//           setTotalCost(transfer.deductFeesFromAmount ? amount - (commission + tax) : amount + commission + tax);
//         })
//         .catch((err) => console.error("Erreur lors du calcul des frais :", err));
//     }
//   };
  
  
//   const handleSwitchChange = (e) => {
//     const newDeductFeesFromAmount = e.target.checked;
  
//     setTransfer((prevState) => ({
//       ...prevState,
//       deductFeesFromAmount: newDeductFeesFromAmount
//     }));
  
//     if (transfer.amount) {
//       const amount = parseFloat(transfer.amount);
//       setTotalCost(newDeductFeesFromAmount ? amount - (commission + tax) : amount + commission + tax);
//     }
//   };
  

//   useEffect(() => {
//     if (givenAmount && totalCost) {
//       setChange(parseFloat(givenAmount) - totalCost);
//     }
//   }, [givenAmount, totalCost]);
  

//   // ✅ Mise à jour des frais et du montant total à chaque changement



//   // ✅ Mise à jour de la monnaie à rendre
//   useEffect(() => {
//     if (givenAmount && totalCost) {
//       setChange(parseFloat(givenAmount) - totalCost);
//     }
//   }, [givenAmount, totalCost]);

//   const handleTransfer = async () => {
//     setError("");
//     setSuccess("");

//     if (!transfer.senderFirstName || !transfer.senderLastName || !transfer.senderPhone || !transfer.senderCity ||
//         !transfer.receiverName || !transfer.receiverPhone || !transfer.receiverCity || !transfer.amount) {
//       setError("⚠️ Tous les champs sont requis.");
//       return;
//     }

//     try {
//       const response = await api.post("/cashier/inter-city-transfer", transfer);
//       setSecretCode(response.data.secretCode);
//       setReceiptUrl(response.data.receiptUrl); // ✅ Stocke l'URL du reçu
//       setSuccess("✅ Transfert effectué avec succès !");
//     } catch (err) {
//       setError(err.response?.data?.msg || "❌ Erreur lors du transfert.");
//     }
//   };

//   const handleDownloadReceipt = () => {
//     if (receiptUrl) {
//       window.open(receiptUrl, "_blank");
//     }
//   };



// //   const generatePDF = () => {
// //     const doc = new jsPDF();
    
// //     doc.setFontSize(16);
// //     doc.text("Reçu de Transfert Interville", 20, 20);
// //     doc.setFontSize(12);
    
// //     doc.text(`Expéditeur : ${transfer.senderFirstName} ${transfer.senderLastName}`, 20, 40);
// //     doc.text(`Téléphone : ${transfer.senderPhone}`, 20, 50);
// //     doc.text(`Ville d'envoi : ${cities.find(c => c._id === transfer.senderCity)?.name || ''}`, 20, 60);
    
// //     doc.text(`Bénéficiaire : ${transfer.receiverName}`, 20, 80);
// //     doc.text(`Téléphone : ${transfer.receiverPhone}`, 20, 90);
// //     doc.text(`Ville de retrait : ${cities.find(c => c._id === transfer.receiverCity)?.name || ''}`, 20, 100);
    
// //     doc.text(`Montant envoyé : ${transfer.amount} XOF`, 20, 120);
// //     doc.text(`Commission : ${commission} XOF`, 20, 130);
// //     doc.text(`Taxe : ${tax} XOF`, 20, 140);
// //     doc.text(`Montant total payé : ${totalCost} XOF`, 20, 150);
    
// //     doc.setFontSize(14);
// //     doc.text(`Code Secret : ${secretCode}`, 20, 170);
    
// //     doc.save(`recu_${secretCode}.pdf`);
// //   };



// const generatePDF = async () => {
//     const doc = new jsPDF();
    
//     doc.setFontSize(16);
//     doc.text("Reçu de Transfert Interville", 20, 20);
//     doc.setFontSize(12);
  
//     doc.text(`Expéditeur : ${transfer.senderFirstName} ${transfer.senderLastName}`, 20, 40);
//     doc.text(`Téléphone : ${transfer.senderPhone}`, 20, 50);
//     doc.text(`Ville d'envoi : ${cities.find(c => c._id === transfer.senderCity)?.name || ''}`, 20, 60);
  
//     doc.text(`Bénéficiaire : ${transfer.receiverName}`, 20, 80);
//     doc.text(`Téléphone : ${transfer.receiverPhone}`, 20, 90);
//     doc.text(`Ville de retrait : ${cities.find(c => c._id === transfer.receiverCity)?.name || ''}`, 20, 100);
  
//     doc.text(`Montant envoyé : ${transfer.amount} XOF`, 20, 120);
//     doc.text(`Commission : ${commission} XOF`, 20, 130);
//     doc.text(`Taxe : ${tax} XOF`, 20, 140);
//     doc.text(`Montant total payé : ${totalCost} XOF`, 20, 150);
  
//     doc.setFontSize(14);
//     doc.text(`Code Secret : ${secretCode}`, 20, 170);
  
//     try {
//       // 🔹 Générer un QR Code contenant les infos du transfert
//       const qrData = JSON.stringify({
//         senderFirstName: transfer.senderFirstName,
//         senderLastName: transfer.senderLastName,
//         senderPhone: transfer.senderPhone,
//         receiverName: transfer.receiverName,
//         receiverPhone: transfer.receiverPhone,
//         amount: transfer.amount,
//         secretCode: secretCode,
//       });
  
//       const qrCodeBase64 = await QRCode.toDataURL(qrData);
  
//       // 🔹 Ajouter l'image du QR Code au PDF
//       doc.addImage(qrCodeBase64, "PNG", 150, 20, 40, 40);
  
//     } catch (err) {
//       console.error("❌ Erreur lors de la génération du QR Code :", err);
//     }
  
//     doc.save(`recu_${secretCode}.pdf`);
//   };
  

//   const handleSenderPhoneChange = async (e) => {
//     let phone = e.target.value.trim();
//     setTransfer((prev) => ({ ...prev, senderPhone: phone }));
  
//     console.log("📡 Numéro saisi par l'utilisateur :", phone);
  
//     // 🔹 Ajout automatique de l'indicatif pays si absent
//     if (!phone.startsWith("+227") && phone.length >= 8) {
//       phone = `+227${phone}`;
//     }
  
//     console.log("📡 Numéro envoyé au backend :", phone);
  
//     if (phone.length >= 12) { // +22798241616 → 12 caractères
//       try {
//         const response = await api.get(`/cashier/check-sender/${phone}`);
//         console.log("📩 Réponse reçue du backend :", response.data);
  
//         // if (response.data.exists) {
//         //   const fullName = response.data.fullName.trim(); // 🔹 Nettoie les espaces inutiles
//         //   const nameParts = fullName.split(" "); // 🔹 Coupe en fonction des espaces
  
//         //   // ✅ Nouvelle logique pour afficher prénom et nom correctement
//         //   setTransfer((prev) => ({
//         //     ...prev,
//         //     senderFirstName: nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0], // 🔹 Tout sauf le dernier mot = prénom
//         //     senderLastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "", // 🔹 Dernier mot = nom
//         //   }));


//         if (response.data.exists) {
//             setTransfer((prev) => ({
//               ...prev,
//               senderFirstName: response.data.senderFirstName, // 🔹 Affectation directe
//               senderLastName: response.data.senderLastName,   // 🔹 Affectation directe
//             }));
          
          
          
          
          
          
          
          
          
//         } else {
//           console.warn("⚠️ Sender non trouvé !");
//           setTransfer((prev) => ({
//             ...prev,
//             senderFirstName: "",
//             senderLastName: "",
//           }));
//         }
//       } catch (error) {
//         console.error("❌ Erreur lors de la vérification du sender :", error);
//       }
//     }
//   };
  
  
  

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ mt: 5, p: 3, marginBottom:20, border: "1px solid #ddd", borderRadius: 2 }}>
//         <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
//           Transfert Interville
//         </Typography>
//         {error && <Alert severity="error">{error}</Alert>}
//         {success && <Alert severity="success">{success}</Alert>}

//         {/* Informations de l'expéditeur */}
//         <Typography variant="h6">Expéditeur</Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//           <TextField
//   label="Téléphone Expéditeur"
//   name="senderPhone"
//   fullWidth
//   value={transfer.senderPhone}
//   onChange={handleSenderPhoneChange}
//   required
// />

//           </Grid>



//           <Grid item xs={12} md={4}>
//   <TextField 
//     label="Prénom Expéditeur" 
//     name="senderFirstName" 
//     fullWidth 
//     value={transfer.senderFirstName} // ✅ Affichage direct
//     onChange={handleChange} 
//     required 
//   />
// </Grid>

// <Grid item xs={12} md={4}>
//   <TextField 
//     label="Nom Expéditeur" 
//     name="senderLastName" 
//     fullWidth 
//     value={transfer.senderLastName} // ✅ Affichage direct
//     onChange={handleChange} 
//     required 
//   />
// </Grid>



//           <Grid item xs={12}>
//             <TextField select label="Ville d'envoi" name="senderCity" fullWidth onChange={handleChange} required>
//               {cities.map((city) => (
//                 <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 3 }} />

//         {/* Informations du bénéficiaire */}
//         <Typography variant="h6">Bénéficiaire</Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <TextField label="Nom Bénéficiaire" name="receiverName" fullWidth onChange={handleChange} required />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField label="Téléphone Bénéficiaire" name="receiverPhone" fullWidth onChange={handleChange} required />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField select label="Ville de retrait" name="receiverCity" fullWidth onChange={handleChange} required>
//               {cities.map((city) => (
//                 <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 3 }} />

//         {/* Montant & calcul des frais */}
//         <Typography variant="h6">Montant et Frais</Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <TextField label="Montant (XOF)" name="amount" type="number" fullWidth onChange={handleChange} required />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControlLabel
//               control={<Switch checked={transfer.deductFeesFromAmount} onChange={handleSwitchChange} />}
//               label="Prélever les frais sur le montant envoyé"
//             />
//           </Grid>
//         </Grid>
//         <Typography sx={{ mt: 2 }}>Commission : {commission} XOF</Typography>
//         <Typography>Taxe : {tax} XOF</Typography>
//         <Typography sx={{ fontWeight: "bold" }}>Montant total à payer : {totalCost} XOF</Typography>

//         {/* Calcul de la monnaie */}
//         <TextField
//           label="Montant donné par le sender"
//           type="number"
//           fullWidth
//           sx={{ mt: 2 }}
//           onChange={(e) => setGivenAmount(e.target.value)}
//         />
//         <Typography sx={{ fontWeight: "bold", mt: 1 }}>Monnaie à rendre : {change >= 0 ? change : 0} XOF</Typography>

//         {/* Boutons */}
//         <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleTransfer}>
//           Effectuer le Transfert
//         </Button>

//         {receiptUrl && (
//           <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleDownloadReceipt}>
//             Télécharger le Reçu
//           </Button>
//         )}


// {secretCode && (
//   <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={generatePDF}>
//     Télécharger le Reçu en PDF
//   </Button>
// )}

//       </Box>
//     </Container>
//   );
// };

// export default InterCityTransferPage;


import React, { useState } from "react";
import { Container, Box, Typography, Tabs, Tab } from "@mui/material";
import SendTransferForm from "./SendTransferForm"; // ✅ Formulaire d'envoi
import PendingTransfersTable from "./PendingTransfersTable"; // ✅ Tableau des transferts en attente

const InterCityTransferPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Transfert Interville
        </Typography>

        {/* 🔹 Onglets pour basculer entre "Envoyer" et "Payer" */}
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Envoyer" />
          <Tab label="Payer" />
        </Tabs>

        {/* 🔹 Affichage conditionnel du contenu selon l'onglet sélectionné */}
        {activeTab === 0 && <SendTransferForm />}
        {activeTab === 1 && <PendingTransfersTable />}
      </Box>
    </Container>
  );
};

export default InterCityTransferPage;
