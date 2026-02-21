import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/jsx/Home";
import Login from "./components/login/Login";
import { UserProvider } from "./context/UserContext";

import MedicinePage from "./components/MedicalPage/Medicinejsx/MedicinePage";
import MedicineNavbar from "./components/MedicalPage/Medicinejsx/MedicineNavbar";
import PharmacyNearMe from "./components/MedicalPage/Medicinejsx/PharmacyNearMe";
import Appointment from "./components/Book_appointment1/Appointment.jsx";
import DoctorPage from "./components/Doctors/jsx/DoctorPage";
import TalkToDoctorPage from "./components/TalkToDoctor/TalkToDoctorPage.jsx"; 
import MedicineApp from "./components/MedicalPage/Medicinejsx/MedicineApp.jsx";

export default function App() {
 
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/medicine"
          element={<MedicineApp/>}
        />

        {/* ✅ Pharmacy Near Me */}
        <Route path="/pharmacy-near-me" element={<PharmacyNearMe />} />
          <Route path="/talkToDoctors" element={<TalkToDoctorPage />} />

        <Route path="/doctor" element={<DoctorPage />} />
        { <Route path="/appointment" element={<Appointment />} /> }

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  );
}
