import React from "react";
import { Container, Typography, Button, Box, Avatar, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const AgentDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 10,
          mb:30,
          p: 4,
          borderRadius: 4,
          boxShadow: 5,
          background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
          textAlign: "center",
          transition: "0.3s",
          "&:hover": {
            boxShadow: 8,
            transform: "scale(1.01)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            bgcolor: "#1976D2",
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, color: "#0D47A1" }}>
          Bonjour, {user?.name}
        </Typography>

        <Typography variant="body1" sx={{ color: "#555", mb: 2 }}>
          Téléphone : <strong>{user?.phone}</strong>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={() => navigate("/agent/chat")}
            sx={{ py: 1.5 }}
          >
            Ouvrir le Chat Clients
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ py: 1.5 }}
          >
            Se déconnecter
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AgentDashboardPage;
