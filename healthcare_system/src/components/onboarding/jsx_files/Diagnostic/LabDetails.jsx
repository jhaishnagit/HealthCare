// src/components/onboarding/jsx_files/IndividualDoctor/DiagnosticCenterDetails.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import "./LabDetails.css";

/* ---------------- STATE → CITIES MAPPING ---------------- */
const STATE_WISE_CITIES = {
  "Andhra Pradesh": [
    "Vijayawada",
    "Visakhapatnam",
    "Guntur",
    "Nellore",
    "Tirupati",
    "Rajahmundry",
    "Kakinada"
  ],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Karnataka: ["Bangalore"],
  "Tamil Nadu": ["Chennai"],
  Kerala: ["Kochi", "Thiruvananthapuram"],
  Maharashtra: ["Mumbai", "Pune"],
  Gujarat: ["Ahmedabad", "Surat"],
  Rajasthan: ["Jaipur"],
  Delhi: ["Delhi"],
  "West Bengal": ["Kolkata"]
};

const DiagnosticCenterDetails = () => {
  const navigate = useNavigate();
  const { form, updateField } = useOnboarding();

  useEffect(() => {
    Object.keys(form).forEach((k) => updateField(k, form[k] || ""));
  }, []);

  const [local, setLocal] = useState({
    lab_code: form.lab_code || "LAB001",
    center_name: form.center_name || "",
    center_type: form.center_type || "",
    license_no: form.license_no || "",
    established_year: form.established_year || "",
    email: form.email || "",
    phone: form.phone || "",
    address: form.address || "",
    pincode: form.pincode || "",
    state: form.state || "",
    city: form.city || "",
  });

  const handle = (key, val) => setLocal((prev) => ({ ...prev, [key]: val }));

  // LAB CODE auto-format
  const updateLabCode = (v) => {
    let digits = v.replace(/[^0-9]/g, "").slice(0, 3);
    handle("lab_code", "LAB" + digits);
  };

  /* ------------ VALIDATION ------------ */
  const validate = () => {
    if (!/^LAB\d{3}$/.test(local.lab_code))
      return alert("Lab Code must be like LAB001");

    if (!local.center_name.trim())
      return alert("Center Name is required");

    if (!local.center_type)
      return alert("Center Type required");

    if (!local.license_no.trim())
      return alert("License number required");

    if (!/^\d{4}$/.test(local.established_year))
      return alert("Invalid Established Year");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(local.email))
      return alert("Invalid email");

    if (!/^[6-9][0-9]{9}$/.test(local.phone))
      return alert("Invalid phone number");

    if (!local.address.trim())
      return alert("Address required");

    if (!local.state)
      return alert("State required");

    if (!local.city)
      return alert("City required");

    if (!/^\d{6}$/.test(local.pincode))
      return alert("Invalid pincode");

    return true;
  };

  const handleNext = () => {
    if (!validate()) return;

    updateField("onboardingType", "Lab");

    updateField("name", local.center_name);
    updateField("organizationMail", local.email);
    updateField("phone", local.phone);
    updateField("address", local.address);
    updateField("pincode", local.pincode);
    updateField("state", local.state);
    updateField("city", local.city);
    updateField("code", local.lab_code);

    navigate("/onboarding/certifications");
  };

  return (
    <div className="diagnostic-form-container">
      <h2>Diagnostic Center / Lab Details</h2>

      <div className="diagnostic-grid">

        {/* LAB CODE */}
        <Input
          label="Lab Code *"
          placeholder="LAB001"
          value={local.lab_code}
          onChange={(e) => updateLabCode(e.target.value)}
        />

        {/* CENTER NAME */}
        <Input
          label="Center Name *"
          placeholder="Eg: Apollo Diagnostics"
          value={local.center_name}
          onChange={(e) => handle("center_name", e.target.value)}
        />

        {/* CENTER TYPE */}
        <Select
          label="Center Type *"
          value={local.center_type}
          onChange={(e) => handle("center_type", e.target.value)}
          options={[
            "Diagnostic Center",
            "Pathology Lab",
            "Radiology Lab",
            "Blood Test Lab",
          ]}
        />

        {/* LICENSE NUMBER */}
        <Input
          label="License Number *"
          placeholder="LIC123456"
          value={local.license_no}
          onChange={(e) => handle("license_no", e.target.value)}
        />

        {/* ESTABLISHED YEAR */}
        <Input
          label="Established Year *"
          maxLength="4"
          placeholder="Eg: 2018"
          value={local.established_year}
          onChange={(e) =>
            handle("established_year", e.target.value.replace(/\D/g, ""))
          }
        />

        {/* EMAIL */}
        <Input
          label="Email *"
          placeholder="lab@gmail.com"
          value={local.email}
          onChange={(e) => handle("email", e.target.value)}
        />

        {/* PHONE */}
        <Input
          label="Phone Number *"
          maxLength="10"
          placeholder="10-digit phone"
          value={local.phone}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 10) return;
            if (v.length === 1 && !/[6-9]/.test(v)) return;
            handle("phone", v);
          }}
        />

        {/* ADDRESS */}
        <div className="form-group full-width">
          <label>Full Address *</label>
          <textarea
            className="textarea-box"
            placeholder="Street, Area, Landmark"
            value={local.address}
            onChange={(e) => handle("address", e.target.value)}
          />
        </div>

        {/* STATE */}
        <Select
          label="State *"
          value={local.state}
          onChange={(e) => {
            handle("state", e.target.value);
            handle("city", ""); // Reset city when state changes
          }}
          options={Object.keys(STATE_WISE_CITIES)}
        />

        {/* CITY */}
        <Select
          label="City *"
          value={local.city}
          onChange={(e) => handle("city", e.target.value)}
          options={local.state ? STATE_WISE_CITIES[local.state] : []}
        />

        {/* PINCODE */}
        <Input
          label="Pincode *"
          placeholder="Eg: 500001"
          maxLength="6"
          value={local.pincode}
          onChange={(e) =>
            handle("pincode", e.target.value.replace(/\D/g, ""))
          }
        />

        {/* NEXT */}
        <div className="btn-wrapper">
          <button className="next-btn" onClick={handleNext}>
            Next ➜
          </button>
        </div>

      </div>
    </div>
  );
};

/* ---------- INPUT COMPONENT ---------- */
const Input = ({ label, ...props }) => (
  <div className="form-group">
    <label>{label}</label>
    <input {...props} />
  </div>
);

/* ---------- SELECT COMPONENT ---------- */
const Select = ({ label, options = [], ...props }) => (
  <div className="form-group">
    <label>{label}</label>
    <select {...props}>
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default DiagnosticCenterDetails;
