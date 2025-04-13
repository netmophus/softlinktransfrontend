// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import HomePage from "../pages/HomePage";
// import LoginPage from "../pages/LoginPage";
// import RegisterPage from "../pages/RegisterPage";
// import UserDashboard from "../pages/user/UserDashboard";
// import AdminDashboard from "../pages/admin/AdminDashboard";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       {/* Routes protégées */}
//       <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
//       <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

//       {/* Redirection si la route n'existe pas */}
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import CashierDashboard from "../pages/cashier/CashierDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import SupervisorManagement from "../pages/admin/SupervisorManagement";
import CashierManagement from "../pages/supervisor/CashierManagement";
import CashRegisterManagement from "../pages/supervisor/CashRegisterManagement";
import CashRegisterTransactionsPage from "../pages/supervisor/CashRegisterTransactionsPage";
import DepositHistoryPage from "../pages/cashier/DepositHistoryPage";
import WithdrawalHistoryPage  from "../pages/cashier/WithdrawalHistoryPage";

import CityManagementPage  from "../pages/admin/CityManagementPage";
import InterCityTransferPage from "../pages/cashier/InterCityTransferPage";
import TransferUserPage from "../pages/user/TransferUserPage";

import UserInterCityTransferPage from "../pages/user/UserInterCityTransferPage";

import TontinePage from "../pages/user/TontinePage";
import ChangePinPage from "../pages/ChangePinPage";


import CashierInterCityHistory from "../pages/cashier/CashierInterCityHistory";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes protégées */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supervisor/dashboard"
        element={
          <ProtectedRoute role="supervisor">
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cashier/dashboard"
        element={
          <ProtectedRoute role="cashier">
            <CashierDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />


{/* <Route
  path="/change-pin"
  element={
    <ProtectedRoute role="user">  
      <ChangePinPage />
    </ProtectedRoute>
  }
/> */}


<Route path="/change-pin" element={<ChangePinPage />} />


<Route 
path="/admin/supervisors" 
element={<ProtectedRoute role="admin">
  <SupervisorManagement />
  </ProtectedRoute>}   
  />


<Route 
  path="/supervisor/cashiers" 
  element={<ProtectedRoute role="supervisor">
    <CashierManagement />
  </ProtectedRoute>}   
/>

<Route 
  path="/supervisor/cash-registers" 
  element={<ProtectedRoute role="supervisor">
    <CashRegisterManagement />
  </ProtectedRoute>}   
/>



<Route
  path="/supervisor/cash-registers/:id/transactions"
  element={
    <ProtectedRoute role="supervisor">
      <CashRegisterTransactionsPage />
    </ProtectedRoute>
  }
/>



<Route
  path="/cashier/history/deposits"
  element={
    <ProtectedRoute role="cashier">
      <DepositHistoryPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/cashier/history/inter-city-transfers"
  element={
    <ProtectedRoute role="cashier">
      <CashierInterCityHistory />
    </ProtectedRoute>
  }
/>


<Route
  path="/cashier/history/withdrawals"
  element={
    <ProtectedRoute role="cashier">
      <WithdrawalHistoryPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/cities"
  element={
    <ProtectedRoute role="admin">
      <CityManagementPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/cashier/inter-city-transfer"
  element={
    <ProtectedRoute role="cashier">
      <InterCityTransferPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/user/inter-city-transfer"
  element={
    <ProtectedRoute role="user">
      <UserInterCityTransferPage />
    </ProtectedRoute>
  }
/>




<Route
  path="/user/transfer"
  element={
    <ProtectedRoute role="user">
      <TransferUserPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/user/tontine"
  element={
    <ProtectedRoute role="user">
      <TontinePage />
    </ProtectedRoute>
  }
/>



      {/* Rediriger vers l'accueil si aucune route ne correspond */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
