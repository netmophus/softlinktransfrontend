import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import api from "../../services/api"; // Assure-toi que l'instance Axios est bien configurée

const TontineMembersReportPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/api/tontines/admin/tontines/members");
        setMembers(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des membres :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Membres enrôlés dans les tontines
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Téléphone</strong></TableCell>
                <TableCell><strong>Ville</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Tontines rejointes</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m._id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>{m.city}</TableCell>
                  <TableCell>
                    {m.isLocked ? (
                      <Chip label="Verrouillé" color="error" size="small" />
                    ) : m.isActive ? (
                      <Chip label="Actif" color="success" size="small" />
                    ) : (
                      <Chip label="Inactif" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{m.tontinesJoined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default TontineMembersReportPage;
