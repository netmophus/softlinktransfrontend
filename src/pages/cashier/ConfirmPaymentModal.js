import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const ConfirmPaymentModal = ({ open, onClose, transfer, onConfirm }) => {
    const [secretCode, setSecretCode] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (!secretCode) {
            setError("⚠️ Veuillez entrer le code secret.");
            return;
        }
        onConfirm(secretCode);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Validation du Paiement</DialogTitle>
            <DialogContent>
                <TextField
                    label="Code Secret"
                    fullWidth
                    type="text"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Annuler</Button>
                <Button onClick={handleConfirm} color="primary" variant="contained">Confirmer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmPaymentModal;
