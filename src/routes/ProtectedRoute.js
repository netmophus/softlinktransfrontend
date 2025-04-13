// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ role, children }) => {
//   const { isAuthenticated, user } = useAuth();

//   console.log("🔍 Auth vérifiée :", isAuthenticated, "| Utilisateur :", user);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (role && user !== role) {
//     return <Navigate to={`/${user}/dashboard`} replace />;
//   }




//   return children;
// };

// export default ProtectedRoute;




import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, user } = useAuth();

  console.log("🔍 Auth vérifiée :", isAuthenticated, "| Utilisateur :", user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Vérifier si le rôle de l'utilisateur correspond bien au rôle requis
  if (role && user?.role !== role) {
    console.warn(`🚫 Accès refusé : Rôle attendu ${role}, rôle actuel ${user?.role}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
