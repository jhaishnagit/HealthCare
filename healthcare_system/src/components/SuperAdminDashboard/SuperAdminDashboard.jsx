// ---------------- SuperAdminDashboard.js (FIXED) ------------------

import React, { useState, useRef, useEffect } from "react";
import ApprovalWorkflowView from "./ApprovalWorkflowView";
import HospitalManagementView from "./HospitalManagementView";
import MedicalStoresManagementView from "./MedicalStoresManagementView";
import LaboratoryManagementView from "./LaboratoryManagementView";
import SettingsView from "./SettingsView";
import SuperAdminHeader from "./SuperAdminHeader";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminDashboardPage from "./SuperAdminDashboardPage";
import DoctorsManagementView from "./DoctorsManagementView";
import PatientsManagementView from "./PatientsManagementView";
import BillingPaymentsView from "./BillingPaymentsView";
import ReportsAnalyticsView from "./ReportsAnalyticsView";

import { HospitalAPI } from "../../services/api";
import "./SuperAdminDashboard.css";

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications] = useState([]);
  const [dark, setDark] = useState(false);

  const [analytics, setAnalytics] = useState(null);
  const [hideLayout, setHideLayout] = useState(false);

  const notifRef = useRef();

  // --------------------- Close notification when clicking outside ---------------------
  useEffect(() => {
    function handleOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // --------------------- Load dashboard stats ---------------------
  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    try {
      const [
        finalApprovedHospitals,
        finalApprovedStores,
        pendingHospitals,
        pendingStores,
      ] = await Promise.all([
        HospitalAPI.getFinalApprovedHospitals(),
        HospitalAPI.getFinalApprovedStores(),
        HospitalAPI.getPending(),
        HospitalAPI.getPendingStores(),
      ]);

      const normalize = (res) =>
        Array.isArray(res?.data?.data) ? res.data.data : [];

      const approvedH = normalize(finalApprovedHospitals);
      const approvedS = normalize(finalApprovedStores);
      const pendingH = normalize(pendingHospitals);
      const pendingS = normalize(pendingStores);

      const cityCount = {};
      approvedH.forEach((h) => {
        cityCount[h.city || "Unknown"] =
          (cityCount[h.city || "Unknown"] || 0) + 1;
      });

      const hospitalsByCity = Object.keys(cityCount).map((city) => ({
        city,
        value: cityCount[city],
      }));

      const monthlyStores = Array(12).fill(0);
      approvedS.forEach((s) => {
        const dt = new Date(s.created_at || s.createdAt || new Date());
        monthlyStores[dt.getMonth()]++;
      });

      const approvalTrend = Array(14).fill(0);
      approvedH.forEach((h) => {
        const dt = new Date(h.created_at || h.createdAt || new Date());
        const diff = Math.floor(
          (Date.now() - dt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff >= 0 && diff < 14) {
          approvalTrend[13 - diff]++;
        }
      });

      setAnalytics({
        finalApprovedHospitalsCount: approvedH.length,
        finalApprovedStoresCount: approvedS.length,
        pendingHospitalsCount: pendingH.length,
        pendingStoresCount: pendingS.length,
        hospitalsByCity,
        storesByMonth: monthlyStores,
        approvalTrend,
      });
    } catch (err) {
      console.error("Dashboard stats load error", err);
    }
  }

  // --------------------- PAGE SWITCHER FIXED ---------------------
  function renderPage() {
  switch (activePage) {
    case "dashboard":
      return analytics ? (
        <SuperAdminDashboardPage
          analytics={analytics}
          openApproval={() => setActivePage("approvalsWorkflow")}
          showApprovedHospitals={() => setActivePage("hospitalManagement")}
          showApprovedStores={() => setActivePage("medicalStores")}
        />
      ) : (
        <h3>Loading...</h3>
      );

    case "approvalsWorkflow":
      return <ApprovalWorkflowView setHideLayout={setHideLayout} />;

    case "hospitalManagement":
      return <HospitalManagementView setHideLayout={setHideLayout} />;

    case "medicalStores":
      return <MedicalStoresManagementView />;

    case "laboratoryManagement":
      return <LaboratoryManagementView />;  // ⭐ FIXED

    case "doctors":
      return <DoctorsManagementView />;

    case "patients":
      return <PatientsManagementView />;

    case "billing":
      return <BillingPaymentsView />;

    case "reports":
      return <ReportsAnalyticsView />;

    case "settings":
      return <SettingsView />;

    default:
      return <h2>Not Found</h2>;
  }
}


  // --------------------- RENDER MAIN ---------------------
  return (
    <div
      className={`dashboard-shell 
        ${dark ? "dark" : ""}
        ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}
        ${hideLayout ? "sidebar-hidden" : ""}`}
    >
      {!hideLayout && (
        <SuperAdminSidebar
          open={sidebarOpen}
          active={activePage}
          onSelect={setActivePage}
          setOpen={setSidebarOpen}
        />
      )}

      <div className="content-area">
        {!hideLayout && (
          <SuperAdminHeader
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            unreadCount={notifications.length}
            onOpenNotifications={() => setNotifOpen(!notifOpen)}
            dark={dark}
            setDark={setDark}
          />
        )}

        <main className="content-main">{renderPage()}</main>
      </div>
    </div>
  );
}
