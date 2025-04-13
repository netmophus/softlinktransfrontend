import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/routes"; // 🔹 Import du fichier routes.js

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Sidebar />
      
      <div style={{ paddingTop: "60px", minHeight: "90vh" }}>
        <AppRoutes /> {/* 🔹 Remplace directement toutes les routes ici */}
      </div>

      <Footer />
    </AuthProvider>
  );
};

export default App;
