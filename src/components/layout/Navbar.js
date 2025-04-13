import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom"; // ✅ Utilisation de useNavigate
import { useAuth } from "../../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Initialiser useNavigate()

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  // ✅ Fonction pour rediriger correctement
  const handleNavigation = (path) => {
    handleMenuClose();
    setMobileOpen(false);
    navigate(path);
  };

  useEffect(() => {
    console.log("Auth vérifiée :", isAuthenticated, "| Utilisateur :", user);
  }, [isAuthenticated, user]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1E293B", padding: "8px 0" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* LOGO */}
        <Typography variant="h5" onClick={() => navigate("/")} sx={{ cursor: "pointer", color: "#38bdf8", fontWeight: "bold" }}>
          QUICKPAY
        </Typography>

        {/* MENU DESKTOP */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
          {!isAuthenticated ? (
            <>
              <Button onClick={() => handleNavigation("/login")} sx={{ color: "#38bdf8", fontWeight: "bold" }}>
                Connexion
              </Button>
              <Button onClick={() => handleNavigation("/register")} sx={{ backgroundColor: "#38bdf8", color: "#fff", borderRadius: "20px", fontWeight: "bold" }}>
                Inscription
              </Button>
            </>
          ) : (
            <>
              {/* 🔹 Redirection selon le rôle */}
              {user?.role === "admin" && (
              <>
                <Button onClick={() => handleNavigation("/admin/dashboard")} sx={{ color: "#fff" }}>
                  🏠 Tableau de bord Admin
                </Button>
                <Button onClick={() => handleNavigation("/admin/cities")} sx={{ color: "#fff" }}>
                  🏙️ Gestion des Villes
                </Button>
              </>
            )}

            

              {user?.role === "supervisor" && (
                <Button onClick={() => handleNavigation("/supervisor/dashboard")} sx={{ color: "#fff" }}>Tableau de bord</Button>
              )}


{user?.role === "cashier" && (
  <>
  <Button onClick={() => handleNavigation("/cashier/dashboard")} sx={{ color: "#fff" }}>Tableau de bord</Button>
    <Button onClick={() => handleNavigation("/cashier/inter-city-transfer")} sx={{ color: "#fff" }}>
      💸 Transfert Interville
    </Button>
  </>
)}

              {user?.role === "user" && (
                <Button onClick={() => handleNavigation("/user/dashboard")} sx={{ color: "#fff" }}>Tableau de bord</Button>
              )}

              <IconButton onClick={handleMenuOpen}>
                <Avatar alt="Profil" src="/default-avatar.png" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleNavigation("/profile")}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> Profil
                </MenuItem>
                <MenuItem onClick={() => logout()}>
                <LogoutIcon sx={{ mr: 1 }} /> Déconnexion
              </MenuItem>

              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
