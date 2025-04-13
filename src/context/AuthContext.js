


import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ Utilisation de l'instance axios configurée

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState("");
 const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      console.log("✅ Utilisateur mis à jour après transfert :", res.data.user);
    } catch (error) {
      console.error("❌ Erreur lors du rafraîchissement des données utilisateur :", error);
    }
  };

// ✅ Ajouter le téléphone au contexte au moment de l'envoi de l'OTP
// ✅ Modification de la fonction requestOTP pour enregistrer le phone dans le contexte.
const requestOTP = async (phone, password) => {
  setLoading(true);
  setError("");

  try {
    const res = await api.post("/auth/login", { phone, password });
    if (res.data.msg === "OTP envoyé à votre téléphone.") {
      console.log("✅ OTP envoyé avec succès !");
      setPhone(phone);  // 🔥 Sauvegarde le téléphone dans le contexte
      localStorage.setItem("phone", phone); // 🔥 Enregistre le téléphone dans le localStorage pour persistance
      setStep(2);
    }
  } catch (error) {
    setError(error.response?.data?.msg || "Une erreur s'est produite !");
  } finally {
    setLoading(false);
  }
};


// ✅ Validation OTP - Étape 2


// ✅ Validation OTP - Étape 2 dans AuthContext.js
const verifyOTP = async (otp) => {
  setLoading(true);
  setError("");

  try {
    const storedPhone = localStorage.getItem("phone"); // 🔥 Récupère le téléphone du localStorage
    console.log("📤 Envoi de la vérification OTP :", { phone: storedPhone, otp }); // 🔍 Log pour vérifier le contenu envoyé

    const res = await api.post("/auth/verify-otp", { phone: storedPhone, otp });  // 🔥 Envoie bien `phone` avec `otp`
    const { token, user } = res.data;

    if (!token || !user) throw new Error("Erreur : Token ou utilisateur invalide.");

    localStorage.setItem("token", token); // ✅ Stocker le token
    setUser(user);
    setIsAuthenticated(true);
    setStep(1);
    navigate(`/${user.role}/dashboard`);
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de l'OTP :", error.response?.data?.msg || error.message);
    setError("OTP invalide !");
  } finally {
    setLoading(false);
  }
};




  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion :", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        setStep,  // ✅ Ajouter cette ligne
        setOtp,  // ✅ Ajouter cette ligne
        phone,
        otp,
        step,
        loading,
        error,
        requestOTP,
        verifyOTP,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
