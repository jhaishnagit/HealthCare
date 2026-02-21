// src/components/onboarding/jsx_files/IndividualDoctor/DoctorProfessionalDetails.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import "./IndividualDoctor.css";

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

const DoctorProfessionalDetails = () => {
  const navigate = useNavigate();
  const { form, updateField, updateOnboardingData } = useOnboarding();

  /* ---------- LOAD SAVED DATA (same logic as HospitalDetails) ---------- */
  const [local, setLocal] = useState({
    doctor_code: "",
    doctor_name: "",
    specialization: "",
    qualification: "",
    experience: "",
    reg_number: "",
    consultation_fee: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    setLocal({
      doctor_code: form.doctor_code || "DOC001",
      doctor_name: form.doctor_name || "",
      specialization: form.specialization || "",
      qualification: form.qualification || "",
      experience: form.experience || "",
      reg_number: form.reg_number || "",
      consultation_fee: form.consultation_fee || "",
      email: form.organizationMail || "",
      phone: form.phone || "",
      address: form.address || "",
      state: form.state || "",
      city: form.city || "",
      pincode: form.pincode || "",
    });
  }, []);

  const handle = (key, val) => setLocal((prev) => ({ ...prev, [key]: val }));

  /* ---------------- PHONE VALIDATION ---------------- */
  const updatePhone = (value, e) => {
    let v = value.replace(/\D/g, "");

    if (e?.nativeEvent?.inputType === "deleteContentBackward") {
      handle("phone", v);
      return;
    }

    if (v.length === 1 && !/[6-9]/.test(v)) v = "";
    if (v.length > 10) return;

    handle("phone", v);
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!/^DOC\d{3}$/.test(local.doctor_code))
      return alert("Doctor Code must be like DOC001");

    if (!local.doctor_name.trim())
      return alert("Doctor name required");

    if (!local.specialization.trim())
      return alert("Specialization required");

    if (!local.qualification.trim())
      return alert("Qualification required");

    if (!/^\d+$/.test(local.experience))
      return alert("Experience must be a number");

    if (!local.reg_number.trim())
      return alert("Registration number required");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(local.email))
      return alert("Enter a valid email");

    if (!/^[6-9]\d{9}$/.test(local.phone))
      return alert("Enter valid 10-digit phone number");

    if (!local.address.trim())
      return alert("Address required");

    if (!local.state)
      return alert("State required");

    if (!local.city)
      return alert("City required");

    if (!/^\d{6}$/.test(local.pincode))
      return alert("Enter valid 6-digit pincode");

    return true;
  };

  /* ---------------- NEXT BUTTON ---------------- */
  const handleNext = () => {
    if (!validate()) return;

    updateField("onboardingType", "IndividualDoctor");
    updateField("type", "IndividualDoctor");
    updateField("code", local.doctor_code);
    updateField("name", local.doctor_name);
    updateField("organizationMail", local.email);
    updateField("phone", local.phone);
    updateField("address", local.address);
    updateField("state", local.state);
    updateField("city", local.city);
    updateField("pincode", local.pincode);

    updateOnboardingData({ doctor_details: local });

    navigate("/onboarding/certifications");
  };

  return (
    <div className="doctor-form-container">
      <h2>Doctor Professional Details</h2>

      <div className="doctor-grid">

        {/* Doctor Code */}
        <div className="form-group">
          <label>Doctor Code *</label>
          <input
            type="text"
            placeholder="DOC001"
            value={local.doctor_code}
            onChange={(e) => {
              let digits = e.target.value.replace(/\D/g, "").slice(0, 3);
              handle("doctor_code", "DOC" + digits);
            }}
          />
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Doctor Name *</label>
          <input
            type="text"
            placeholder="Eg: Dr. Ramesh Kumar"
            value={local.doctor_name}
            onChange={(e) => handle("doctor_name", e.target.value)}
          />
        </div>

        {/* Specialization */}
        <div className="form-group">
          <label>Specialization *</label>
          <input
            type="text"
            placeholder="Eg: Cardiologist"
            value={local.specialization}
            onChange={(e) => handle("specialization", e.target.value)}
          />
        </div>

        {/* Qualification */}
        <div className="form-group">
          <label>Qualification *</label>
          <input
            type="text"
            placeholder="Eg: MBBS, MD"
            value={local.qualification}
            onChange={(e) => handle("qualification", e.target.value)}
          />
        </div>

        {/* Experience */}
        <div className="form-group">
          <label>Experience (Years) *</label>
          <input
            type="text"
            placeholder="Eg: 10"
            value={local.experience}
            onChange={(e) =>
              handle("experience", e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        {/* Registration Number */}
        <div className="form-group">
          <label>Registration Number *</label>
          <input
            type="text"
            placeholder="Eg: REG12345"
            value={local.reg_number}
            onChange={(e) => handle("reg_number", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            placeholder="doctor@gmail.com"
            value={local.email}
            onChange={(e) => handle("email", e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="text"
            placeholder="10-digit phone"
            maxLength="10"
            value={local.phone}
            onChange={(e) => updatePhone(e.target.value, e)}
          />
        </div>

        {/* Fee */}
        <div className="form-group">
          <label>Consultation Fee *</label>
          <input
            type="text"
            placeholder="Eg: 500"
            value={local.consultation_fee}
            onChange={(e) =>
              handle("consultation_fee", e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        {/* Address */}
        <div className="form-group full-width">
          <label>Address *</label>
          <textarea
            placeholder="Full Address"
            value={local.address}
            onChange={(e) => handle("address", e.target.value)}
          ></textarea>
        </div>

        {/* STATE + CITY */}
        <div className="form-grid-3">

          {/* State */}
          <div className="form-group">
            <label>State *</label>
            <select
              value={local.state}
              onChange={(e) => {
                const state = e.target.value;
                handle("state", state);
                handle("city", ""); // reset city
              }}
            >
              <option value="">Select State</option>
              {Object.keys(STATE_WISE_CITIES).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="form-group">
            <label>City *</label>
            <select
              value={local.city}
              onChange={(e) => handle("city", e.target.value)}
            >
              <option value="">Select City</option>
              {local.state &&
                STATE_WISE_CITIES[local.state].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
            </select>
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              placeholder="Eg: 500001"
              maxLength="6"
              value={local.pincode}
              onChange={(e) =>
                handle("pincode", e.target.value.replace(/\D/g, ""))
              }
            />
          </div>
        </div>

        {/* NEXT */}
        <div className="btn-wrapper full-width">
          <button className="next-btn" onClick={handleNext}>
            Next ➜
          </button>
        </div>

      </div>
    </div>
  );
};

export default DoctorProfessionalDetails;
