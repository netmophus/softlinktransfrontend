// import React, { useEffect, useState } from "react";
// import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../services/api";

// const CashRegisterTransactionsPage = () => {
//   const { id } = useParams(); // ✅ Assurer la récupération correcte de l'ID
//   const [transactions, setTransactions] = useState([]);
//   const [cashRegister, setCashRegister] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (id) { // 🔹 Vérifier que l'ID est valide avant d'appeler l'API
//       fetchTransactions();
//     } else {
//       console.error("❌ L'ID de la caisse est undefined !");
//     }
//   }, [id]); // ✅ Dépendance sur `id`

//   // ✅ Récupérer les transactions
//   const fetchTransactions = async () => {
//     if (!id) {
//       console.error("❌ L'ID de la caisse est undefined !");
//       return;
//     }
  
//     try {
//       console.log(`📌 Récupération des transactions pour la caisse : ${id}`);
//       const response = await api.get(`/supervisor/cash-registers/${id}/transactions`);
//       console.log("✅ Réponse API (transactions) :", response.data);
  
//       if (response.data) {
//         setTransactions(response.data.transactions || []);
//         setCashRegister(response.data.cashRegister || null);
//       }
//     } catch (err) {
//       console.error("❌ Erreur lors du chargement des transactions :", err);
//       setTransactions([]); // Éviter undefined
//     }
//   };
  

//   return (
//     <Container>
//       <Button variant="contained" onClick={() => navigate("/supervisor/cash-registers")}>
//         ⬅ Retour à la Gestion des Caisses
//       </Button>

//       <Typography variant="h4" sx={{ mt: 3, mb: 3, fontWeight: "bold" }}>
//         📜 Historique des Transactions
//       </Typography>

//       {cashRegister ? (
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           🏦 Caisse de <strong>{cashRegister.cashier.name}</strong> ({cashRegister.cashier.phone})
//         </Typography>
//       ) : (
//         <Typography variant="h6" sx={{ mb: 2, color: "red" }}>
//           ⚠ Aucune information sur cette caisse.
//         </Typography>
//       )}

//       <Paper sx={{ mt: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Type</TableCell>
//               <TableCell>Montant</TableCell>
//               <TableCell>Effectué par</TableCell>
//               <TableCell>Date</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {transactions.length > 0 ? (
//               transactions.map((transaction, index) => (
//                 <TableRow key={index}>
//                   <TableCell>
//                     {transaction.type === "deposit" ? "Dépôt" : transaction.type === "withdrawal" ? "Retrait" : "Ajustement"}
//                   </TableCell>
//                   <TableCell>{transaction.amount} XOF</TableCell>
//                   <TableCell>{transaction.performedBy?.name || "Utilisateur inconnu"}</TableCell>
//                   <TableCell>{transaction.date ? new Date(transaction.date).toLocaleString() : "Non disponible"}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={4} align="center" style={{ color: "red", fontWeight: "bold" }}>
//                   ❌ Aucune transaction enregistrée pour cette caisse.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Container>
//   );
// };

// export default CashRegisterTransactionsPage;




import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const CashRegisterTransactionsPage = () => {
  const { id } = useParams(); // 🔹 Récupération de l'ID de la caisse
  const [transactions, setTransactions] = useState([]);
  const [cashRegister, setCashRegister] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTransactions(currentPage);
    }
  }, [id, currentPage]);

  // ✅ Récupérer les transactions avec pagination
  const fetchTransactions = async (page) => {
    try {
      console.log(`📌 Récupération des transactions - Page : ${page}`);
      const response = await api.get(`/supervisor/cash-registers/${id}/transactions?page=${page}&limit=10`);
      
      setTransactions(response.data.transactions);
      setCashRegister(response.data.cashRegister);
      setTotalPages(response.data.totalPages);
      console.log(`✅ Transactions chargées : ${response.data.transactions.length}`);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des transactions :", err);
    }
  };

  return (
    <Container>
      <Button variant="contained" onClick={() => navigate("/supervisor/cash-registers")}>
        ⬅ Retour à la Gestion des Caisses
      </Button>

      <Typography variant="h4" sx={{ mt: 3, mb: 3, fontWeight: "bold" }}>
        📜 Historique des Transactions
      </Typography>

      {/* 🔹 Infos sur la caisse */}
      {cashRegister ? (
        <Typography variant="h6" sx={{ mb: 2 }}>
          🏦 Caisse de <strong>{cashRegister.cashier.name}</strong> ({cashRegister.cashier.phone})
        </Typography>
      ) : (
        <Typography color="error">⚠️ Aucune information sur cette caisse.</Typography>
      )}

      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Effectué par</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.type === "deposit" ? "Dépôt" : "Retrait"}</TableCell>
                  <TableCell>{transaction.amount} XOF</TableCell>
                  <TableCell>{transaction.performedBy?.name || "Inconnu"}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "gray" }}>
                  ❌ Aucune transaction enregistrée pour cette caisse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* 🔹 Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          sx={{ marginRight: "10px" }}
        >
          ⬅ Précédent
        </Button>
        <Typography variant="body1" sx={{ alignSelf: "center" }}>
          Page {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          sx={{ marginLeft: "10px" }}
        >
          Suivant ➡
        </Button>
      </div>
    </Container>
  );
};

export default CashRegisterTransactionsPage;
