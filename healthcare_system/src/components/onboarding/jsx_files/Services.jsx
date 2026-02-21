// src/components/onboarding/jsx_files/Services.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../css/Services.css";
import { HospitalAPI } from "../../../services/api";

/**
 * Services now supports all onboarding types.
 * It shows different service/facility lists depending on form.onboardingType.
 */

const OPTIONS = {
  Hospital: {
    DEPARTMENTS: [
      "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Gynecology",
      "General Surgery", "ENT", "Dermatology", "Ophthalmology", "Dentistry",
      "Psychiatry", "Radiology", "Pathology", "Urology", "Nephrology",
      "Pulmonology", "Gastroenterology"
    ],
    SERVICES: [
      "X-Ray", "CT Scan", "MRI", "Blood Test", "ICU Care",
      "Operation Theatre", "Ventilator Support", "Dialysis Unit"
    ],
    FACILITIES: [
      "24x7 Pharmacy", "Parking", "Cafeteria", "Online Appointments",
      "Ambulance Service", "Blood Bank"
    ]
  },
  Clinic: {
    DEPARTMENTS: ["General OPD", "Pediatrics", "ENT", "Dermatology", "Dentistry"],
    SERVICES: ["Consultation", "Minor Procedures", "Vaccination", "Teleconsultation"],
    FACILITIES: ["Online Appointments", "Parking", "Phlebotomy Services"]
  },
  Lab: {
    DEPARTMENTS: ["Pathology", "Microbiology", "Biochemistry", "Molecular Diagnostics"],
    SERVICES: ["Blood Test", "Urine Test", "Culture Test", "PCR / Molecular Tests"],
    FACILITIES: ["Home Sample Collection", "Online Reports", "Sample Pickup"]
  },
  Medician: {
    DEPARTMENTS: [],
    SERVICES: [
      "Prescription Medicines", "OTC Medicines", "Home Delivery", "Vaccination Support"
    ],
    FACILITIES: ["24x7 Medicine Availability", "Free Home Delivery", "Instant Billing"]
  },
  IndividualDoctor: {
    DEPARTMENTS: [],
    SERVICES: ["Consultation", "Home Visit", "Teleconsultation", "Minor Procedures"],
    FACILITIES: ["Online Appointments", "Digital Payment"]
  }
};

const Services = () => {
  const { form, updateField, setHospitalId } = useOnboarding();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onboardingType = form.onboardingType || "Hospital";
  const { DEPARTMENTS = [], SERVICES = [], FACILITIES = [] } =
    OPTIONS[onboardingType] || OPTIONS["Hospital"];

  const safe = (v, fallback) =>
    v === undefined || v === null || v === "" ? fallback : v;

  const toggleItem = (field, value) => {
    const current = form[field] || [];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    updateField(field, updated);
  };

  const validate = () => {
    // BASIC CHECKS FOR ALL
    if (!form.name || !form.organizationMail || !(form.hospital_phone || form.phone)) {
      alert("Please complete basic details first");
      return false;
    }

    // HOSPITAL REQUIREMENTS
    if (onboardingType === "Hospital") {
      if (!form.departments || form.departments.length === 0) {
        alert("Please select at least one hospital department");
        return false;
      }
    }

    // LAB REQUIREMENTS
    if (onboardingType === "Lab") {
      if (!form.services || form.services.length === 0) {
        alert("Please select at least one lab service");
        return false;
      }
    }

    // DOCTOR REQUIREMENTS
    if (onboardingType === "IndividualDoctor") {
      if (!form.services || form.services.length === 0) {
        alert("Please select at least one service");
        return false;
      }
    }

    return true;
  };

  const submitEntity = async () => {
    if (!validate()) return null;
    setSubmitting(true);

    try {
      const fd = new FormData();

      const payload = {
        type: safe(form.onboardingType, "Hospital"),   // THIS differentiates the type
        code: safe(form.code, `HSP${Math.floor(1000 + Math.random() * 9000)}`),
        name: safe(form.name, ""),
        tagline: safe(form.type, ""),
        description: safe(form.description, ""),
        established_year: Number(safe(form.established_year, 0)),
        organizationMail: safe(form.organizationMail, ""),
        hospital_phone: safe(form.hospital_phone || form.phone, ""),
        alternate_phone: safe(form.alternate_phone, ""),
        website: safe(form.website, ""),
        address: safe(form.address, ""),
        city: safe(form.city, ""),
        state: safe(form.state, ""),
        country: safe(form.country, "India"),
        pincode: safe(form.pincode, ""),
        latitude: Number(safe(form.latitude, 0)),
        longitude: Number(safe(form.longitude, 0)),
        departments: form.departments || [],
        services: form.services || [],
        facilities: form.facilities || [],
        status: "pending",
        onboarding_stage: 3,
      };

      // ⭐ Always send ONLY "hospital"
      fd.append(
        "hospital",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      // ⭐ Append all images
      if (form.images) {
        Object.values(form.images).forEach((item) => {
          if (item?.file) fd.append("images", item.file);
        });
      }

      // ⭐ Append all documents
      if (form.certifications) {
        Object.values(form.certifications).forEach((item) => {
          if (item?.file) fd.append("documents", item.file);
        });
      }

      console.log("🚀 SUBMITTING FORM DATA...");
      for (var pair of fd.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      const { data } = await HospitalAPI.createHospital(fd);

      const id = data?.id || data?.entityId || data?.data?.id;
      if (!id) {
        alert("Entity created but ID missing from response!");
        return null;
      }

      setHospitalId && setHospitalId(id);
      alert(`${onboardingType} Details Saved Successfully!`);
      return id;

    } catch (err) {
      console.log("❌ ERROR SUBMIT:", err);
      alert("Save Failed: " + (err.response?.data?.message || err.message));
      return null;

    } finally {
      setSubmitting(false);
    }
  };



  const goNext = async () => {
    const id = await submitEntity();
    if (id) navigate("/onboarding/owner");
  };

  const goPrev = () => navigate("/onboarding/images");

  return (
    <div className="services-container">
      <h2 className="form-title">
        {onboardingType === "Hospital" ? "🥼 Hospital Services & Departments" :
          onboardingType === "Lab" ? "🧪 Lab Services" :
            onboardingType === "Medician" ? "💊 Medician Services" :
              onboardingType === "Clinic" ? "🏥 Clinic Services" :
                "👨‍⚕️ Services"}
      </h2>

      {/* Departments (if available) */}
      {DEPARTMENTS.length > 0 && (
        <>
          <h3 className="section-title">Select Departments</h3>
          <div className="options-grid">
            {DEPARTMENTS.map(d => (
              <label key={d} className="option-item">
                <input
                  type="checkbox"
                  checked={(form.departments || []).includes(d)}
                  onChange={() => toggleItem("departments", d)}
                />
                {d}
              </label>
            ))}
          </div>
        </>
      )}

      {/* Services */}
      {SERVICES.length > 0 && (
        <>
          <h3 className="section-title">Available Services</h3>
          <div className="options-grid">
            {SERVICES.map(s => (
              <label key={s} className="option-item">
                <input
                  type="checkbox"
                  checked={(form.services || []).includes(s)}
                  onChange={() => toggleItem("services", s)}
                />
                {s}
              </label>
            ))}
          </div>
        </>
      )}

      {/* Facilities */}
      {FACILITIES.length > 0 && (
        <>
          <h3 className="section-title">Facilities</h3>
          <div className="options-grid">
            {FACILITIES.map(f => (
              <label key={f} className="option-item">
                <input
                  type="checkbox"
                  checked={(form.facilities || []).includes(f)}
                  onChange={() => toggleItem("facilities", f)}
                />
                {f}
              </label>
            ))}
          </div>
        </>
      )}

      <div className="nav-buttons">
        <button className="btn-prev" onClick={goPrev}>⬅ Previous</button>
        <button className="btn-next" onClick={goNext} disabled={submitting}>
          {submitting ? "Submitting..." : "Next ➡"}
        </button>
      </div>
    </div>
  );
};

export default Services;
