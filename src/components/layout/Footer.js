import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        textAlign: "center",
        padding: "10px 0",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} SOFTLINK. Tous droits réservés.
      </Typography>
      <Typography variant="body2">
        <Link href="/terms" color="inherit" sx={{ textDecoration: "none", mx: 1 }}>
          Conditions d'utilisation
        </Link>
        | 
        <Link href="/privacy" color="inherit" sx={{ textDecoration: "none", mx: 1 }}>
          Politique de confidentialité
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
