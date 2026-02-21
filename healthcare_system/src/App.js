
// src/App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import './App.css';

import { UserProvider } from "./context/UserContext";

// Admin Shared Layout
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';

// Admin Pages
import Dashboard from './components/Dashboard';
import DoctorsList from './components/Doctors/DoctorsList';
import AddDoctor from './components/Doctors/AddDoctor';
import DoctorRegister from './components/Doctors/DoctorRegister';
import PatientsList from './components/Patients/PatientsList';
import PatientRegister from './components/Patients/PatientRegister';
import BookingPage from './components/RoomMangement/BookingPage';
import Appointments from './components/Appointments/AppointmentsList';
import MedicinePage from './components/Medicine/MedicinePage';
import StaffManagement from './components/Medicine/StaffManagement';
import Reports from './components/Sidebar/Reports';
import Settings from './components/Sidebar/Settings';
import DoctorView from "./components/Doctors/DoctorView";
import PatientView from "./components/Patients/PatientView";

// LAB MANAGEMENT 
import LabManagementMain from "./components/LabManagement/LabManagementMain";
import LabManagement from "./components/LabManagement/LabManagement";

// Reception
import ReceptionLayout from './components/Reception/ReceptionLayout';
import ReceptionDashboard from './components/Reception/ReceptionDashboard';
import ReceptionPatientList from './components/Reception/ReceptionPatientList';
import ReceptionPatientRegister from './components/Reception/ReceptionPatientRegister';

// Misc
import LoginPage from './components/Login/LoginPage';
import Notification from './components/Notification';
//super Admin
import SuperAdminDashboard from './components/SuperAdminDashboard/SuperAdminDashboard';

//onbording
import OnboardingDashboard from "./components/onboarding/OnboardingDashboard";
import OwnerDetails from "./components/onboarding/jsx_files/OwnerDetails";
import Services from "./components/onboarding/jsx_files/Services";
import Images from "./components/onboarding/jsx_files/Images";
import { OnboardingProvider } from "./components/onboarding/context/OnboardingContext";
import ReviewSubmit from "./components/onboarding/jsx_files/ReviewSubmit";
import OnboardingLayout from "./components/onboarding/OnboardingLayout";
import Certifications from './components/onboarding/jsx_files/Certifications';
import BankDetailsForm from './components/onboarding/jsx_files/BankDetailsForm';

//medicalDashbord
import MedicalDashboard from './components/MedicalDashboard/MedicalDashboard';
import MedicalStock from './components/MedicalDashboard/jsx_files/MedicalStock';
import PatientPrescription from './components/MedicalDashboard/jsx_files/PatientPrescription';
// import MedicalHistory from './components/MedicalDashboard/MedicalHistory';
// import Emergency from './components/MedicalDashboard/Emergency';
// import Suppliers from './components/MedicalDashboard/Suppliers';
import Customers from './components/MedicalDashboard/jsx_files/Customers';
import Inventory from './components/MedicalDashboard/jsx_files/Inventory';
import Billing from './components/MedicalDashboard/jsx_files/Billing';
import Orders from './components/MedicalDashboard/jsx_files/Orders';
import SearchPage from './components/MedicalDashboard/jsx_files/MedicinePage';    
// ------------------------
// PROTECTED ROUTE
// ------------------------
const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("userEmail");
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// ------------------------
// ADMIN LAYOUT
// ------------------------
function AdminLayout({ sidebarOpen, toggleSidebar }) {
  return (
    <div className="admin-layout">   {/* ⭐ Added wrapper for CSS isolation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// ------------------------
// MAIN APP
// ------------------------
function App() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const showNotification = (msg, type) => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  return (
    <UserProvider>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<LoginPage />} />


        {/* ---------------------------------------- */}
        {/* 🔥 ONBOARDING ROUTES (Inside main <Routes>) */}
        {/* ---------------------------------------- */}
      <Route path="/onboarding" element={<OnboardingDashboard />} />

  


        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<DoctorsList showNotification={showNotification} />} />
            <Route path="/doctorregister" element={<DoctorRegister showNotification={showNotification} />} />
            <Route path="/doctors/add" element={<AddDoctor showNotification={showNotification} />} />
            <Route path="/doctors/:id" element={<DoctorView />} />
            <Route path="/patients" element={<PatientsList showNotification={showNotification} />} />
            <Route path="/patients/:id" element={<PatientView />} />
            <Route path="/patientregister" element={<PatientRegister showNotification={showNotification} />} />
            <Route path="/bookingpage" element={<BookingPage showNotification={showNotification} />} />
            <Route path="/medicines" element={<MedicinePage showNotification={showNotification} />} />
            <Route path="/staffmanagement" element={<StaffManagement showNotification={showNotification} />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/reports" element={<Reports showNotification={showNotification} />} />
            <Route path="/labmanagement" element={<LabManagement showNotification={showNotification} />} />
          </Route>
          <Route path="/settings" element={<Settings showNotification={showNotification} />} />
        </Route>


        {/* RECEPTION */}
        <Route path="/reception" element={<ReceptionLayout />}>
          <Route index element={<ReceptionDashboard />} />
          <Route path="dashboard" element={<ReceptionDashboard />} />
          <Route path="patientsList" element={<ReceptionPatientList />} />
          <Route path="patientRegister" element={<ReceptionPatientRegister />} />
        </Route>
         {/* MEDICAL DASHBOARD ROUTES (SEPARATE MODULE) */}
        <Route path="/medicaldashboard">
          <Route index element={<MedicalDashboard />} />
          {/* <Route path="dashboard" element={<MedicalDashboard />} /> */}
          <Route path="medical-dashboard" element={<MedicalDashboard />} />

          <Route path="stock" element={<MedicalStock />} />
          <Route path="prescription" element={<PatientPrescription />} />
          {/* <Route path="history" element={<MedicalHistory />} /> */}
          {/* <Route path="emergency" element={<Emergency />} /> */}
          {/* <Route path="suppliers" element={<Suppliers />} /> */}
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="billing" element={<Billing />} />
          <Route path="orders" element={<Orders />} />
          <Route path="search" element={<SearchPage />} />
          </Route>

        {/* LAB MANAGEMENT */}
        <Route path="/lab-management/*" element={<LabManagementMain />} />
         {/* SUPER ADMIN ROUTES */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </UserProvider>
  );
}


// -----------------------
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}  