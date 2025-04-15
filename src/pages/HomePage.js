import { Box } from "@mui/material";

const HomePage = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",           // ✅ Aucun scroll
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        marginTop:-7,
      }}
    >
      <Box
        component="img"
        src="/softlinkTransfert.png"    // Remplace si besoin
        alt="Image de couverture"
        sx={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Box>
  );
};

export default HomePage;
