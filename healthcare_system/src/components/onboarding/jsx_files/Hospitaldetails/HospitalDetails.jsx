// src/components/onboarding/jsx_files/HospitalDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import "./HospitalDetails.css";

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

const HospitalDetails = () => {
  const navigate = useNavigate();
  const { form, updateField } = useOnboarding();

  useEffect(() => {
    Object.keys(form).forEach((key) => {
      updateField(key, form[key] || "");
    });
  }, []);

  /* ---------------- GPS CAPTURE ---------------- */
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        updateField("latitude", lat);
        updateField("longitude", lng);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data?.address) {
              updateField("address", data.display_name?.split(", ").slice(0, 4).join(", "));
              updateField("city", data.address.city || data.address.town || "");
              updateField("state", data.address.state || "");
              updateField("pincode", data.address.postcode || "");
            }
            alert("✔ Location captured successfully.");
          })
          .catch(() => alert("Could not fetch address details"));
      },
      () => { },
      { enableHighAccuracy: true }
    );
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!form.name?.trim()) return alert("Hospital Name required");
    if (!/^[A-Za-z ]+$/.test(form.name)) return alert("Hospital Name must contain only letters");

    if (!form.organizationMail) return alert("Email required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.organizationMail))
      return alert("Enter valid email");

    if (!/^[6-9]\d{9}$/.test(String(form.hospital_phone)))
      return alert("Enter valid 10-digit phone number (starts with 6-9)");

    if (form.alternate_phone && !/^\d{10}$/.test(form.alternate_phone))
      return alert("Alternate phone must be 10 digits");

    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      return alert("Pincode must be 6 digits");

    if (!form.city?.trim()) return alert("City required");
    if (!form.state?.trim()) return alert("State required");
    if (!form.address?.trim()) return alert("Address required");

    if (form.google_map_link && !/^https?:\/\/.+/.test(form.google_map_link))
      return alert("Enter valid Google Map URL");

    if (!/^HSP\d{3}$/.test(form.code))
      return alert("Hospital Code must be like HSP001");

    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();

    updateField("onboardingType", "Hospital");   // ⭐ SET HERE

    if (!validate()) return;
    navigate("/onboarding/certifications");
  };


  return (
    <div className="form-card">
      <h3 className="section-title">Hospital Basic Information</h3>

      <div className="form-grid-4">
        {/* CODE */}
        <Input
          label="Hospital Code"
          placeholder="HSP001"
          value={form.code}
          onChange={(e) => {
            let value = e.target.value.toUpperCase();
            let digits = value.replace(/[^0-9]/g, "").slice(0, 3);
            updateField("code", "HSP" + digits);
          }}
        />

        {/* NAME */}
        <Input
          label="Hospital Name *"
          placeholder="Eg: Apollo Hospital"
          value={form.name}
          onChange={(e) => {
            let value = e.target.value;
            if (!/^[A-Za-z ]*$/.test(value)) return;
            updateField("name", value);
          }}
        />

        {/* TYPE */}
        <Select
          label="Hospital Type *"
          value={form.type}
          onChange={(e) => updateField("type", e.target.value)}
          options={[
            "Multi-Specialty",
            "Super Specialty",
            "General Hospital",
            "Clinic",
            "Nursing Home"
          ]}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="input-full">
        <textarea
          value={form.description}
          placeholder="Write hospital description"
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* CONTACT INFO */}
      <h3 className="section-title">Contact Information</h3>
      <div className="form-grid-3">
        <Input
          label="Email Address *"
          placeholder="Email address"
          value={form.organizationMail}
          onChange={(e) => updateField("organizationMail", e.target.value)}
        />

        <Input
          label="Contact Number *"
          maxLength="10"
          placeholder="10-digit phone"
          value={form.hospital_phone}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length === 1 && !/[6-9]/.test(value)) return;
            updateField("hospital_phone", value);
          }}
        />

        <Input
          label="Alternate Phone"
          maxLength="10"
          placeholder="Optional"
          value={form.alternate_phone}
          onChange={(e) =>
            updateField("alternate_phone", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      {/* ADDRESS */}
      <h3 className="section-title">Address & Location</h3>
      <button className="gps-btn" onClick={handleGetLocation}>
        📍 Capture My Hospital Location
      </button>

      <div className="form-grid-3" style={{ marginTop: 12 }}>
        <Input label="Latitude" placeholder="Auto-filled" value={form.latitude} readOnly />
        <Input label="Longitude" placeholder="Auto-filled" value={form.longitude} readOnly />
      </div>

      <div className="input-full">
        <textarea
          value={form.address}
          placeholder="Street address, Area, Landmark"
          onChange={(e) => {
            let value = e.target.value.replace(/[^A-Za-z0-9,.\-\/ ]/g, "");
            updateField("address", value);
          }}
        />
      </div>

      {/* ---------------- STATE + CITY ---------------- */}
      <div className="form-grid-3">
        <Select
          label="State *"
          value={form.state}
          onChange={(e) => {
            const state = e.target.value;
            updateField("state", state);
            updateField("city", "");
          }}
          options={Object.keys(STATE_WISE_CITIES)}
        />

        <Select
          label="City *"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
          options={form.state ? STATE_WISE_CITIES[form.state] : []}
        />

        <Input
          label="Pincode"
          placeholder="Eg: 500001"
          value={form.pincode}
          onChange={(e) =>
            updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
          }
        />
      </div>

      <div className="form-grid-3">
        <Input label="Country" placeholder="India" value={form.country} readOnly />

        <Input
          label="Google Place ID"
          placeholder="Place ID"
          value={form.google_place_id}
          onChange={(e) => updateField("google_place_id", e.target.value)}
        />

        <Input
          label="Google Map Link"
          placeholder="Paste Google Maps URL"
          value={form.google_map_link}
          onChange={(e) => updateField("google_map_link", e.target.value)}
        />
      </div>

      {/* CAPACITY */}
      <h3 className="section-title">Capacity</h3>
      <div className="form-grid-3">
        <Input
          label="Total Beds"
          type="number"
          placeholder="Ex: 40"
          value={form.total_beds}
          onChange={(e) => updateField("total_beds", e.target.value.replace(/\D/g, ""))}
        />
        <Input
          label="ICU Beds"
          type="number"
          placeholder="Ex: 10"
          value={form.icu_beds}
          onChange={(e) => updateField("icu_beds", e.target.value.replace(/\D/g, ""))}
        />
        <Input
          label="Emergency Beds"
          type="number"
          placeholder="Ex: 5"
          value={form.emergency_beds}
          onChange={(e) =>
            updateField("emergency_beds", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button className="next-btn" onClick={handleNext}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

/* ---------------- INPUT COMPONENT ---------------- */
const Input = ({ label, ...props }) => (
  <div className="input-wrapper">
    <label className="input-label">{label}</label>
    <input {...props} className="input-box" />
  </div>
);

/* ---------------- SELECT COMPONENT ---------------- */
const Select = ({ label, options = [], ...props }) => (
  <div className="input-wrapper">
    <label className="input-label">{label}</label>
    <select {...props} className="select-box">
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default HospitalDetails;
