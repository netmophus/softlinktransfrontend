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
import AdminDepositsReport from "../pages/admin/reports/AdminDepositsReport";
import AdminWithdrawalsReport from "../pages/admin/reports/AdminWithdrawalsReport";
import AdminSummaryTransactionsReport from "../pages/admin/reports/AdminSummaryTransactionsReport";
import AdminCommissionsTaxesReport from "../pages/admin/reports/AdminCommissionsTaxesReport";
import AdminInterCityByCityReport from "../pages/admin/reports/AdminInterCityByCityReport";
import AdminInterCityBySupervisorReport from "../pages/admin/reports/AdminInterCityBySupervisorReport";
import AdminUserToUserTransfersReport from "../pages/admin/reports/AdminUserToUserTransfersReport";
import AdminOpenCashRegistersReport from "../pages/admin/reports/AdminOpenCashRegistersReport";
import SupervisorCashRegisterReport from "../pages/supervisor/SupervisorCashRegisterReport";
import SupervisorDailyReportPage from "../pages/supervisor/SupervisorDailyReportPage";

import ActiveTontinesReportPage from "../pages/admin/ActiveTontinesReportPage";
import TontineMembersReportPage from "../pages/admin/TontineMembersReportPage";
import TontineCollectedReportPage from "../pages/admin/TontineCollectedReportPage";
import TontineProgressReportPage from "../pages/admin/TontineProgressReportPage";

import TontineBeneficiariesReportPage from "../pages/admin/TontineBeneficiariesReportPage";
import PendingTontineCyclesPage from "../pages/admin/PendingTontineCyclesPage";
import EditTontinePage from "../pages/user/EditTontinePage";

import AdminCommissionsIntercityPage from "../pages/admin/reports/AdminCommissionsIntercityPage";


import AdminCommissionsInteruserPage from "../pages/admin/reports/AdminCommissionsInteruserPage";
import AdminCommissionsTontinePage from "../pages/admin/reports/AdminCommissionsTontinePage";
import AdminCommissionsGlobalPage from "../pages/admin/reports/AdminCommissionsGlobalPage";
import AllInterCityTransfersPage from "../pages/admin/reports/AllInterCityTransfersPage";
import SupervisorClosingReportsPage from "../pages/supervisor/SupervisorClosingReportsPage";

import SupervisorClosingReportDetailsPage from "../pages/supervisor/SupervisorClosingReportDetailsPage";

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


<Route
  path="/admin/reports/deposits"
  element={
    <ProtectedRoute role="admin">
      <AdminDepositsReport />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/withdrawals"
  element={
    <ProtectedRoute role="admin">
      <AdminWithdrawalsReport />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/summary-transactions"
  element={
    <ProtectedRoute role="admin">
      <AdminSummaryTransactionsReport />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/commissions-taxes"
  element={
    <ProtectedRoute role="admin">
      <AdminCommissionsTaxesReport />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/intercity-by-city"
  element={
    <ProtectedRoute role="admin">
      <AdminInterCityByCityReport />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports/intercity-by-supervisor"
  element={
    <ProtectedRoute role="admin">
      <AdminInterCityBySupervisorReport />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports/user-to-user"
  element={
    <ProtectedRoute role="admin">
      <AdminUserToUserTransfersReport />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/open-cash-registers"
  element={
    <ProtectedRoute role="admin">
      <AdminOpenCashRegistersReport />
    </ProtectedRoute>
  }
/>



<Route
  path="/supervisor/reports/cash-registers"
  element={
    <ProtectedRoute role="supervisor">
      <SupervisorCashRegisterReport />
    </ProtectedRoute>
  }
/>


<Route
  path="/supervisor/reports/daily"
  element={
    <ProtectedRoute role="supervisor">
      <SupervisorDailyReportPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/tontines/active"
  element={
    <ProtectedRoute role="admin">
      <ActiveTontinesReportPage />
    </ProtectedRoute>
  }
/>

<Route 
  path="/supervisor/reports/closing" 
  element={
    <ProtectedRoute role="supervisor">
      <SupervisorClosingReportsPage />
    </ProtectedRoute>
  }   
/>


<Route
  path="/supervisor/reports/closing/:reportId"
  element={
    <ProtectedRoute role="supervisor">
      <SupervisorClosingReportDetailsPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/tontines/members"
  element={
    <ProtectedRoute role="admin">
      <TontineMembersReportPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports/tontines/collected"
  element={
    <ProtectedRoute role="admin">
      <TontineCollectedReportPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/tontines/progress"
  element={
    <ProtectedRoute role="admin">
      <TontineProgressReportPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports/tontines/beneficiaries"
  element={
    <ProtectedRoute role="admin">
      <TontineBeneficiariesReportPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reports/tontines/pending"
  element={
    <ProtectedRoute role="admin">
      <PendingTontineCyclesPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/tontines/:tontineId/edit"
  element={
    <ProtectedRoute role="user">
      <EditTontinePage />
    </ProtectedRoute>
  }
/>





<Route
  path="/admin/commissions/intercity"
  element={
    <ProtectedRoute role="admin">
      <AdminCommissionsIntercityPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/commissions/interuser"
  element={
    <ProtectedRoute role="admin">
      <AdminCommissionsInteruserPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/commissions/tontine"
  element={
    <ProtectedRoute role="admin">
      <AdminCommissionsTontinePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/commissions/global"
  element={
    <ProtectedRoute role="admin">
      <AdminCommissionsGlobalPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports/intercity-all"
  element={
    <ProtectedRoute role="admin">
      <AllInterCityTransfersPage />
    </ProtectedRoute>
  }
/>


      {/* Rediriger vers l'accueil si aucune route ne correspond */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
