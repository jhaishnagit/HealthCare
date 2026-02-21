// src/components/MedicalDashboard/MedicalSidebar.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { 
  FiHome, 
  FiUser, 
  FiBox, 
  FiClipboard, 
  FiSettings,     // ← Settings icon added
  FiLogOut,
  FiFileText,     // Orders
  FiPackage,      // Inventory
  FiUsers,        // Customers
  FiShoppingCart, // Medical Store
  FiDollarSign    // Billing
} from "react-icons/fi";
import { UserContext } from "../../context/UserContext";

export default function MedicalSidebar({ tab, setTab }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <aside className="medx-sidebar">
      <h2 className="medx-sidebar-title">MedX Medical</h2>

      <nav className="medx-sidebar-menu">

        <div
          role="button"
          className={`nav-link ${tab === "dashboard" ? "active" : ""}`}
          onClick={() => { setTab("dashboard"); navigate("/medicaldashboard"); }}
        >
          <FiHome /> <span>Dashboard</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "patient" ? "active" : ""}`}
          onClick={() => { setTab("patient"); navigate("/medicaldashboard"); }}
        >
          <FiUser /> <span>Patient Prescription</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "orders" ? "active" : ""}`}
          onClick={() => { setTab("orders"); navigate("/medicaldashboard/orders"); }}
        >
          <FiFileText /> <span>Orders</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "inventory" ? "active" : ""}`}
          onClick={() => { setTab("inventory"); navigate("/medicaldashboard/inventory"); }}
        >
          <FiPackage /> <span>Inventory</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "customers" ? "active" : ""}`}
          onClick={() => { setTab("customers"); navigate("/medicaldashboard/customers"); }}
        >
          <FiUsers /> <span>Customers</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "store" ? "active" : ""}`}
          onClick={() => { setTab("store"); navigate("/medicaldashboard/stock"); }}
        >
          <FiShoppingCart /> <span>Medical Store</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "billing" ? "active" : ""}`}
          onClick={() => { setTab("billing"); navigate("/medicaldashboard/billing"); }}
        >
          <FiDollarSign /> <span>Billing</span>
        </div>

        {/* SETTINGS — NOW VISIBLE */}
        <div
          role="button"
          className={`nav-link ${tab === "settings" ? "active" : ""}`}
          onClick={() => {
            setTab("settings");
            navigate("/settings");   // ← Your global Settings page
          }}
        >
          <FiSettings /> <span>Settings</span>
        </div>

      </nav>

      {/* LOGOUT — NO EXTRA BOTTOM PADDING */}
      <button className="logout-btn" onClick={handleLogout}>
        <FiLogOut /> <span>Logout</span>
      </button>
    </aside>
  );
}