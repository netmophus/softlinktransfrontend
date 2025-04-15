// import React from "react";
// import { AuthProvider } from "./context/AuthContext";
// import Navbar from "./components/layout/Navbar";
// import Sidebar from "./components/layout/Sidebar";
// import Footer from "./components/layout/Footer";
// import AppRoutes from "./routes/routes"; // 🔹 Import du fichier routes.js


// const App = () => {
//   return (
//     <AuthProvider>
//       <Navbar />
//       <Sidebar />
      
//       <div style={{  minHeight: "100vh" }}>
//         <AppRoutes /> {/* 🔹 Remplace directement toutes les routes ici */}
//       </div>

//       <Footer />
//     </AuthProvider>
//   );
// };

// export default App;



import React from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/routes";
import Sidebar from "./components/layout/Sidebar";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <AuthProvider>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          overflow: isHome ? "hidden" : "auto",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <Navbar />
        {!isHome && <Sidebar />}
        <Box sx={{ flex: 1 }}>
          <AppRoutes />
        </Box>
        <Footer />
      </Box>
    </AuthProvider>
  );
};

export default App;
