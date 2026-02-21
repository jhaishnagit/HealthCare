import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import "./ClinicDetails.css";

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

const ClinicDetails = () => {
  const navigate = useNavigate();
  const { form, updateField } = useOnboarding();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    Object.keys(form).forEach((key) => updateField(key, form[key] || ""));
  }, []);

  // --------------------------
  // VALIDATION HELPERS
  // --------------------------

  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "code":
        if (!/^CLC\d{3}$/.test(value)) msg = "Code must be like CLC001";
        break;

      case "name":
        if (!value.trim()) msg = "Clinic name required";
        else if (!/^[A-Za-z ]+$/.test(value)) msg = "Only letters allowed";
        break;

      case "organizationMail":
        if (!value) msg = "Email required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Invalid email";
        break;

      case "phone":
        if (!/^[6-9]\d{9}$/.test(value))
          msg = "Phone required (10 digits, starts with 6–9)";
        break;

      case "alternate_phone":
        if (value && !/^\d{10}$/.test(value)) msg = "Must be 10 digits";
        break;

      case "state":
        if (!value) msg = "State required";
        break;

      case "city":
        if (!value) msg = "City required";
        break;

      case "pincode":
        if (value && !/^\d{6}$/.test(value)) msg = "Pincode must be 6 digits";
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

  const validateForm = () => {
    const fields = [
      "code",
      "name",
      "organizationMail",
      "phone",
      "state",
      "city",
      "address",
    ];

    let ok = true;
    fields.forEach((f) => {
      if (!validateField(f, form[f])) ok = false;
    });
    return ok;
  };

  // --------------------------
  // HANDLE NEXT
  // --------------------------

  const handleNext = (e) => {
    e.preventDefault();

    updateField("onboardingType", "Clinic");

    if (!validateForm()) {
      alert("Please fix the highlighted errors.");
      return;
    }

    navigate("/onboarding/certifications");
  };

  // --------------------------
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


  return (
    <div className="clinic-card">
      <h2 className="section-title">Clinic Onboarding</h2>

      <div className="form-grid-3">
        {/* CLINIC CODE */}
        <Input
          label="Clinic Code *"
          name="code"
          placeholder="CLC001"
          value={form.code}
          error={errors.code}
          onChange={(e) => {
            let digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
            let code = "CLC" + digits;
            updateField("code", code);
            validateField("code", code);
          }}
        />

        {/* NAME */}
        <Input
          label="Clinic Name *"
          name="name"
          placeholder="Eg: Smile Dental Care"
          error={errors.name}
          value={form.name}
          onChange={(e) => {
            if (/^[A-Za-z ]*$/.test(e.target.value)) {
              updateField("name", e.target.value);
              validateField("name", e.target.value);
            }
          }}
        />

        {/* TYPE */}
        <Select
          label="Clinic Type *"
          value={form.clinic_type}
          onChange={(e) => updateField("clinic_type", e.target.value)}
          options={[
            "General Clinic",
            "Dental",
            "Eye",
            "ENT",
            "Physiotherapy",
            "Skin & Hair",
            "Children Clinic",
          ]}
        />
      </div>

      {/* DESCRIPTION */}
      <textarea
        className="textarea-box"
        placeholder="Write a short description about clinic…"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      {/* CONTACT */}
      <h3 className="section-title">Contact Information</h3>

      <div className="form-grid-3">
        <Input
          label="Email *"
          name="organizationMail"
          placeholder="clinic@gmail.com"
          error={errors.organizationMail}
          value={form.organizationMail}
          onChange={(e) => {
            updateField("organizationMail", e.target.value);
            validateField("organizationMail", e.target.value);
          }}
        />

        <Input
          label="Phone *"
          maxLength={10}
          placeholder="10-digit phone"
          value={form.phone}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, ""); // Keep only digits

            // Allow deleting freely
            if (v === "") {
              updateField("phone", "");
              return;
            }

            // First digit must be 6-9
            if (v.length === 1 && !/[6-9]/.test(v)) {
              updateField("phone", ""); // Clear invalid first digit
              return;
            }

            // Limit to 10 digits
            if (v.length > 10) return;

            updateField("phone", v);
          }}
          onBlur={() => {
            if (!/^[6-9]\d{9}$/.test(form.phone)) {
              setErrors((prev) => ({
                ...prev,
                phone: "Enter a valid 10-digit mobile number",
              }));
            } else {
              setErrors((prev) => ({ ...prev, phone: "" }));
            }
          }}
        />
        <Input
          label="Alternate Phone"
          maxLength={10}
          placeholder="Optional"
          value={form.alternate_phone}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, "");

            // Block if same as main phone
            if (v === form.phone) return;

            // Limit to 10 digits only
            if (v.length > 10) return;

            updateField("alternate_phone", v);
          }}
        />


      </div>

      {/* LOCATION */}
      <h3 className="section-title">Address & Location</h3>

      <button className="gps-btn" onClick={handleGetLocation}>
        📍 Capture Clinic Location
      </button>

      <textarea
        className="textarea-box"
        placeholder="Street, Area, Landmark"
        name="address"
        value={form.address}
        error={errors.address}
        onChange={(e) => {
          updateField("address", e.target.value);
          validateField("address", e.target.value);
        }}
      />
      <p className="error-text">{errors.address}</p>

      <div className="form-grid-3">
        <Select
          label="State *"
          name="state"
          error={errors.state}
          value={form.state}
          onChange={(e) => {
            updateField("state", e.target.value);
            updateField("city", "");
            validateField("state", e.target.value);
          }}
          options={Object.keys(STATE_WISE_CITIES)}
        />

        <Select
          label="City *"
          name="city"
          error={errors.city}
          value={form.city}
          options={form.state ? STATE_WISE_CITIES[form.state] : []}
          onChange={(e) => {
            updateField("city", e.target.value);
            validateField("city", e.target.value);
          }}
        />

        <Input
          label="Pincode"
          name="pincode"
          placeholder="Eg: 500001"
          error={errors.pincode}
          value={form.pincode}
          onChange={(e) => {
            let p = e.target.value.replace(/\D/g, "").slice(0, 6);
            updateField("pincode", p);
            validateField("pincode", p);
          }}
        />
      </div>

      <div className="btn-wrapper">
        <button className="next-btn" onClick={handleNext}>
          Next ➜
        </button>
      </div>
    </div>
  );
};

const Input = ({ label, error, ...props }) => (
  <div className="input-field">
    <label>{label}</label>
    <input className={error ? "error-border" : ""} {...props} />
    {error && <p className="error-text">{error}</p>}
  </div>
);

const Select = ({ label, error, options = [], ...props }) => (
  <div className="input-field">
    <label>{label}</label>
    <select className={error ? "error-border" : ""} {...props}>
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {error && <p className="error-text">{error}</p>}
  </div>
);

export default ClinicDetails;
