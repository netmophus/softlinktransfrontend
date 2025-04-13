import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportIcon from "@mui/icons-material/Support";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const Sidebar = ({ isAuthenticated }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Bouton pour ouvrir le menu */}
      <IconButton onClick={toggleDrawer} sx={{ position: "fixed", left: 20, top: 20, color: "#1976d2" }}>
        <MenuIcon />
      </IconButton>

      {/* Drawer (Sidebar) */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250, paddingTop: 2 }}>
          <List>
            {isAuthenticated ? (
              <>
                <ListItem button component={Link} to="/dashboard" onClick={toggleDrawer}>
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/transactions" onClick={toggleDrawer}>
                  <ListItemIcon><PaymentIcon /></ListItemIcon>
                  <ListItemText primary="Transactions" />
                </ListItem>
                <ListItem button component={Link} to="/support" onClick={toggleDrawer}>
                  <ListItemIcon><SupportIcon /></ListItemIcon>
                  <ListItemText primary="Support" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login" onClick={toggleDrawer}>
                  <ListItemText primary="Connexion" />
                </ListItem>
                <ListItem button component={Link} to="/register" onClick={toggleDrawer}>
                  <ListItemText primary="Inscription" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
