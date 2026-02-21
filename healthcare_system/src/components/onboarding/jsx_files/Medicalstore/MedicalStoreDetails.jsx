import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import "./MedicalStoreDetails.css";

/* ---------------------------------------------
   STATE → CITIES
--------------------------------------------- */
const STATE_WISE_CITIES = {
  "Andhra Pradesh": ["Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Rajahmundry"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Karnataka: ["Bangalore"],
  "Tamil Nadu": ["Chennai"],
  Kerala: ["Kochi", "Thiruvananthapuram"],
  Maharashtra: ["Mumbai", "Pune"],
  Gujarat: ["Ahmedabad", "Surat"],
  Rajasthan: ["Jaipur"],
  Delhi: ["Delhi"],
  "West Bengal": ["Kolkata"],
};

const MedicalStoreDetails = () => {
  const navigate = useNavigate();
  const { form, updateField } = useOnboarding();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    updateField("onboardingType", "Medician");
  }, []);

  /* ---------------------------------------------
     REAL-TIME VALIDATION
  --------------------------------------------- */
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "code":
        if (!/^MDS\d{3}$/.test(value)) msg = "Store Code must be like MDS001";
        break;

      case "name":
        if (!value.trim()) msg = "Store name required";
        break;

      case "organizationMail":
        if (!value) msg = "Email required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Invalid email";
        break;

      case "phone":
        if (!/^[6-9]\d{9}$/.test(value)) msg = "Enter valid 10-digit Indian number";
        break;

      case "alternate_phone":
        if (value && !/^[6-9]\d{9}$/.test(value))
          msg = "Enter valid 10-digit number";
        break;

      case "drug_license":
        if (!value.trim()) msg = "Drug License Number required";
        else if (!/^[A-Za-z0-9-\/]+$/.test(value))
          msg = "Invalid Drug License Format";
        break;

      case "pincode":
        if (!/^\d{6}$/.test(value)) msg = "Pincode must be 6 digits";
        break;

      case "state":
        if (!value) msg = "State required";
        break;

      case "city":
        if (!value) msg = "City required";
        break;

      case "address":
        if (!value.trim()) msg = "Address required";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  /* ---------------------------------------------
     GPS LOCATION
  --------------------------------------------- */
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);

        updateField("latitude", lat);
        updateField("longitude", lng);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();

        if (data?.address) {
          updateField("address", data.display_name);
          updateField("city", data.address.city || data.address.town || "");
          updateField("state", data.address.state || "");
          updateField("pincode", data.address.postcode || "");
        }

        alert("✔ Location captured successfully");
      },
      () => alert("Please allow location permission."),
      { enableHighAccuracy: true }
    );
  };

  /* ---------------------------------------------
     FORM VALIDATION FOR NEXT BUTTON
  --------------------------------------------- */
  const validateForm = () => {
    return (
      validateField("code", form.code) &&
      validateField("name", form.name) &&
      validateField("organizationMail", form.organizationMail) &&
      validateField("phone", form.phone) &&
      validateField("state", form.state) &&
      validateField("city", form.city) &&
      validateField("pincode", form.pincode) &&
      validateField("address", form.address) &&
      validateField("drug_license", form.drug_license)
    );
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix highlighted errors.");
      return;
    }

    updateField("email", form.organizationMail);
    updateField("store_name", form.name);

    navigate("/onboarding/certifications");
  };

  return (
    <div className="store-card">
      <h2 className="section-title">Medical Store Onboarding</h2>

      {/* STORE CODE + NAME + TYPE */}
      <div className="form-grid-3">
        <Input
          label="Store Code *"
          placeholder="MDS001"
          value={form.code}
          error={errors.code}
          onChange={(e) => {
            let digits = e.target.value.replace(/\D/g, "").slice(0, 3);
            let code = "MDS" + digits;
            updateField("code", code);
            validateField("code", code);
          }}
        />

        <Input
          label="Store Name *"
          placeholder="Eg: Apollo Pharmacy"
          value={form.name}
          error={errors.name}
          onChange={(e) => {
            updateField("name", e.target.value);
            validateField("name", e.target.value);
          }}
        />

        <Select
          label="Store Type *"
          value={form.store_type}
          onChange={(e) => updateField("store_type", e.target.value)}
          options={["Pharmacy", "Medical Store", "Drug House", "24/7 Medical Store"]}
        />
      </div>

      {/* LICENSE DETAILS */}
      <div className="form-grid-2">
        <Input
          label="Drug License Number *"
          placeholder="DL-XXXX-XXXX"
          value={form.drug_license}
          error={errors.drug_license}
          onChange={(e) => {
            updateField("drug_license", e.target.value);
            validateField("drug_license", e.target.value);
          }}
        />

        <Input
          label="GST Number"
          placeholder="Optional"
          value={form.gst_number}
          onChange={(e) => updateField("gst_number", e.target.value)}
        />
      </div>

      {/* DESCRIPTION */}
      <textarea
        className="textarea-box"
        placeholder="Write store description..."
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      {/* CONTACT INFORMATION */}
      <h3 className="section-title">Contact Information</h3>

      <div className="form-grid-3">
        <Input
          label="Email *"
          placeholder="store@gmail.com"
          value={form.organizationMail}
          error={errors.organizationMail}
          onChange={(e) => {
            updateField("organizationMail", e.target.value);
            validateField("organizationMail", e.target.value);
          }}
        />

        {/* PHONE — FINAL PERFECT VERSION */}
        <Input
          label="Phone *"
          placeholder="10-digit mobile"
          maxLength={10}
          error={errors.phone}
          value={form.phone}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, "");

            if (e.nativeEvent.inputType === "deleteContentBackward") {
              updateField("phone", v);
              validateField("phone", v);
              return;
            }

            if (v.length === 1 && !/[6-9]/.test(v)) v = "";

            if (v.length > 10) return;

            updateField("phone", v);
            validateField("phone", v);
          }}
        />

        {/* ALTERNATE PHONE */}
        <Input
          label="Alternate Phone"
          placeholder="Optional (10 digits)"
          maxLength={10}
          error={errors.alternate_phone}
          value={form.alternate_phone}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, "");

            if (e.nativeEvent.inputType === "deleteContentBackward") {
              updateField("alternate_phone", v);
              validateField("alternate_phone", v);
              return;
            }

            if (v.length === 1 && !/[6-9]/.test(v)) v = "";
            if (v === form.phone) return;
            if (v.length > 10) return;

            updateField("alternate_phone", v);
            validateField("alternate_phone", v);
          }}
        />
      </div>

      {/* LOCATION */}
      <h3 className="section-title">Address & Location</h3>

      <button className="gps-btn" onClick={handleGetLocation}>
        📍 Capture Store Location
      </button>

      <div className="form-grid-2">
        <Input label="Latitude" placeholder="Auto-filled" readOnly value={form.latitude} />
        <Input label="Longitude" placeholder="Auto-filled" readOnly value={form.longitude} />
      </div>

      <Input
        label="Address *"
        placeholder="Street, Area, Landmark"
        value={form.address}
        error={errors.address}
        onChange={(e) => {
          updateField("address", e.target.value);
          validateField("address", e.target.value);
        }}
      />

      <div className="form-grid-3">
        <Select
          label="State *"
          error={errors.state}
          value={form.state}
          options={Object.keys(STATE_WISE_CITIES)}
          onChange={(e) => {
            updateField("state", e.target.value);
            updateField("city", "");
            validateField("state", e.target.value);
          }}
        />

        <Select
          label="City *"
          error={errors.city}
          value={form.city}
          options={form.state ? STATE_WISE_CITIES[form.state] : []}
          onChange={(e) => {
            updateField("city", e.target.value);
            validateField("city", e.target.value);
          }}
        />

        <Input
          label="Pincode *"
          placeholder="6-digit"
          maxLength={6}
          error={errors.pincode}
          value={form.pincode}
          onChange={(e) => {
            let p = e.target.value.replace(/\D/g, "").slice(0, 6);
            updateField("pincode", p);
            validateField("pincode", p);
          }}
        />
      </div>

      <button className="next-btn" onClick={handleNext}>
        Next ➜
      </button>
    </div>
  );
};

/* ---------------------------------------------
   INPUT COMPONENT
--------------------------------------------- */
const Input = ({ label, error, ...props }) => (
  <div className="input-field">
    <label>{label}</label>
    <input className={error ? "error-border" : ""} {...props} />
    {error && <p className="error-text">{error}</p>}
  </div>
);

/* ---------------------------------------------
   SELECT COMPONENT
--------------------------------------------- */
const Select = ({ label, error, options = [], ...props }) => (
  <div className="input-field">
    <label>{label}</label>
    <select className={error ? "error-border" : ""} {...props}>
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    {error && <p className="error-text">{error}</p>}
  </div>
);

export default MedicalStoreDetails;
