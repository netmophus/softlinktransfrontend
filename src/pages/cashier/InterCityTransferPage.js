
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
