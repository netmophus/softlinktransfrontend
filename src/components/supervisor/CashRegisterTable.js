import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TablePagination, Button } from "@mui/material";

const CashRegisterTable = ({ cashRegisters, handleOpenFundModal, handleOpenWithdrawModal, handleCloseCashRegister, handleReopenCashRegister, handleViewTransactions, handleOpenModal }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10; // Nombre de lignes par page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Paper sx={{ mt: 5, mb:18 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Caissier</TableCell>
            <TableCell>Montant Ouverture</TableCell>
            <TableCell><strong>Solde Actuel</strong></TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cashRegisters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cashRegister) => (
            <TableRow key={cashRegister._id}>
              <TableCell>
                <Button 
                  variant="text" 
                  color="primary" 
                  onClick={() => handleOpenModal(cashRegister)}
                >
                  {cashRegister.cashier.name}
                </Button>
              </TableCell>
              <TableCell>{cashRegister.openingAmount} XOF</TableCell>
              <TableCell>{cashRegister.currentBalance} XOF</TableCell>
              <TableCell>{cashRegister.status === "open" ? "Ouverte" : "Fermée"}</TableCell>
              <TableCell>
                {cashRegister.status === "open" ? (
                  <>
                    <Button variant="outlined" color="primary" onClick={() => handleOpenFundModal(cashRegister._id)} sx={{ mr: 1 }}>
                      ➕ Ajouter Fond
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleOpenWithdrawModal(cashRegister._id)} sx={{ mr: 1 }}>
                      ➖ Retirer Fond
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleCloseCashRegister(cashRegister._id)} sx={{ mr: 1 }}>
                      🔒 Fermer
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" color="success" onClick={() => handleReopenCashRegister(cashRegister._id)} sx={{ mr: 1 }}>
                    🔄 Réouvrir
                  </Button>
                )}
                <Button variant="outlined" color="info" onClick={() => handleViewTransactions(cashRegister._id)}>
                  📜 Voir Transactions
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={cashRegisters.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default CashRegisterTable;
