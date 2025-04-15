// import React, { useState, useEffect } from "react";
// import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemText } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useNavigate } from "react-router-dom"; // ✅ Utilisation de useNavigate
// import { useAuth } from "../../context/AuthContext";
// import LogoutIcon from "@mui/icons-material/Logout";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// const Navbar = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const navigate = useNavigate(); // ✅ Initialiser useNavigate()

//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

//   // ✅ Fonction pour rediriger correctement
//   const handleNavigation = (path) => {
//     handleMenuClose();
//     setMobileOpen(false);
//     navigate(path);
//   };

//   useEffect(() => {
//     console.log("Auth vérifiée :", isAuthenticated, "| Utilisateur :", user);
//   }, [isAuthenticated, user]);

//   return (
//     <AppBar position="sticky" sx={{ backgroundColor: "#1E293B", padding: "8px 0" }}>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         {/* LOGO */}
//         <Typography variant="h5" onClick={() => navigate("/")} sx={{ cursor: "pointer", color: "#38bdf8", fontWeight: "bold", fontSize:"50" }}>
//           SOFTLINK TRANSFERT D'ARGENT
//         </Typography>

//         {/* MENU DESKTOP */}
//         <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
//           {!isAuthenticated ? (
//             <>
//               <Button onClick={() => handleNavigation("/login")} sx={{ color: "#38bdf8", fontWeight: "bold" }}>
//                 Connexion
//               </Button>
//               <Button onClick={() => handleNavigation("/register")} sx={{ backgroundColor: "#38bdf8", color: "#fff", borderRadius: "20px", fontWeight: "bold" }}>
//                 Inscription
//               </Button>
//             </>
//           ) : (
//             <>
//               {/* 🔹 Redirection selon le rôle */}
//               {user?.role === "admin" && (
//               <>
//                 <Button onClick={() => handleNavigation("/admin/dashboard")} sx={{ color: "#fff" }}>
//                   🏠 Tableau de bord Admin
//                 </Button>
//                 <Button onClick={() => handleNavigation("/admin/cities")} sx={{ color: "#fff" }}>
//                   🏙️ Gestion des Villes
//                 </Button>
//               </>
//             )}

            

//               {user?.role === "supervisor" && (
//                 <Button onClick={() => handleNavigation("/supervisor/dashboard")} sx={{ color: "#fff" }}>Tableau de bord</Button>
//               )}


// {user?.role === "cashier" && (
//   <>
//   <Button onClick={() => handleNavigation("/cashier/dashboard")} sx={{ color: "#fff" }}>Tableau de bord</Button>
//     <Button onClick={() => handleNavigation("/cashier/inter-city-transfer")} sx={{ color: "#fff" }}>
//       💸 Transfert Interville
//     </Button>
//   </>
// )}

//               {user?.role === "user" && (
//                 <Button onClick={() => handleNavigation("/user/dashboard")} sx={{ color: "#fff" }}>Tableau de bord</Button>
//               )}

//               <IconButton onClick={handleMenuOpen}>
//                 <Avatar alt="Profil" src="/default-avatar.png" />
//               </IconButton>
//               <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//                 <MenuItem onClick={() => handleNavigation("/profile")}>
//                   <AccountCircleIcon sx={{ mr: 1 }} /> Profil
//                 </MenuItem>
//                 <MenuItem onClick={() => logout()}>
//                 <LogoutIcon sx={{ mr: 1 }} /> Déconnexion
//               </MenuItem>

//               </Menu>
//             </>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;






import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
 
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);

  const handleNavigation = (path) => {
    handleMenuClose();
    setMobileOpen(false);
    navigate(path);
  };

  const renderMenuItems = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Button onClick={() => handleNavigation("/login")} sx={{ color: "#38bdf8", fontWeight: "bold" }}>
            Connexion
          </Button>
          <Button
            onClick={() => handleNavigation("/register")}
            sx={{
              backgroundColor: "#38bdf8",
              color: "#fff",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Inscription
          </Button>
        </>
      );
    }

    const roleButtons = {
      admin: [
        { label: "🏠 Tableau de bord Admin", path: "/admin/dashboard" },
        { label: "🏙️ Gestion des Villes", path: "/admin/cities" },
      ],
      supervisor: [{ label: "Tableau de bord", path: "/supervisor/dashboard" }],
      cashier: [
        { label: "Tableau de bord", path: "/cashier/dashboard" },
        { label: "💸 Transfert Interville", path: "/cashier/inter-city-transfer" },
      ],
      user: [{ label: "Tableau de bord", path: "/user/dashboard" }],
    };

    return (
      <>
        {(roleButtons[user?.role] || []).map((btn) => (
          <Button key={btn.path} onClick={() => handleNavigation(btn.path)} sx={{ color: "#fff" }}>
            {btn.label}
          </Button>
        ))}

        <IconButton onClick={handleMenuOpen}>
          <Avatar alt="Profil" src="/default-avatar.png" />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleNavigation("/profile")}>
            <AccountCircleIcon sx={{ mr: 1 }} /> Profil
          </MenuItem>
          <MenuItem onClick={logout}>
            <LogoutIcon sx={{ mr: 1 }} /> Déconnexion
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#1E293B", padding: "8px 0" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h5"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              color: "#38bdf8",
              fontWeight: "bold",
              fontSize: { xs: "1.2rem", md: "1.8rem" },
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            SOFTLINK TRANSFERT D'ARGENT
          </Typography>

          {/* Menu Mobile Icon */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton color="inherit" edge="end" onClick={toggleMobileDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Menu Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {renderMenuItems()}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleMobileDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMobileDrawer}>
          <List>
            {!isAuthenticated ? (
              <>
                <ListItem button onClick={() => handleNavigation("/login")}>
                  <ListItemText primary="Connexion" />
                </ListItem>
                <ListItem button onClick={() => handleNavigation("/register")}>
                  <ListItemText primary="Inscription" />
                </ListItem>
              </>
            ) : (
              <>
             {(() => {
  const menuItems = {
    admin: [
      { label: "🏠 Dashboard Admin", path: "/admin/dashboard" },
      { label: "🏙️ Gestion des Villes", path: "/admin/cities" },
    ],
    supervisor: [{ label: "Tableau de bord", path: "/supervisor/dashboard" }],
    cashier: [
      { label: "Tableau de bord", path: "/cashier/dashboard" },
      { label: "💸 Transfert Interville", path: "/cashier/inter-city-transfer" },
    ],
    user: [{ label: "Tableau de bord", path: "/user/dashboard" }],
  };

  const items = menuItems[user?.role] || [];

  return items.map((item) => (
    <ListItem button key={item.path} onClick={() => handleNavigation(item.path)}>
      <ListItemText primary={item.label} />
    </ListItem>
  ));
})()}


                <Divider />
                <ListItem button onClick={() => handleNavigation("/profile")}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> <ListItemText primary="Profil" />
                </ListItem>
                <ListItem button onClick={logout}>
                  <LogoutIcon sx={{ mr: 1 }} /> <ListItemText primary="Déconnexion" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;

