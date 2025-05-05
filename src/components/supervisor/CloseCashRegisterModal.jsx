import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import api from "../../services/api";

const CloseCashRegisterModal = ({ open, onClose, registerId, onClosed }) => {
  const [closingAmount, setClosingAmount] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleClose = () => {
    setClosingAmount("");
    setResult(null);
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const res = await api.put(`/cash-registers/close/${registerId}`, {
        closingAmount: parseFloat(closingAmount),
      });
      setResult(res.data);
      setError("");
      onClosed(); // 🔁 rafraîchit la liste
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Erreur lors de la fermeture.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          p: 3,
          borderRadius: 2,
          boxShadow: 6,
          bgcolor: "background.paper",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" mb={2}>
          Fermer la Caisse
        </Typography>

        <TextField
          fullWidth
          label="Montant réel en caisse"
          type="number"
          value={closingAmount}
          onChange={(e) => setClosingAmount(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleSubmit}
        >
          Confirmer la fermeture
        </Button>

        {result && (
          <Alert severity={result.discrepancy === 0 ? "success" : "warning"} sx={{ mt: 2 }}>
            <strong>Fermeture réussie !</strong><br />
            Solde attendu : {result.expectedClosingAmount.toLocaleString()} XOF<br />
            Écart : {result.discrepancy.toLocaleString()} XOF
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Modal>
  );
};

export default CloseCashRegisterModal;
