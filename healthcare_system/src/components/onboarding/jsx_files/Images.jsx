// src/components/onboarding/jsx_files/Images.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../css/Images.css";

/**
 * Images component supports Hospital / Medician / Clinic / Lab / IndividualDoctor.
 * It selects the right image slots depending on form.onboardingType.
 */

const IMAGE_FIELDS_BY_TYPE = {
  Hospital: [
    { key: "frontView", label: "Hospital Front View", required: true },
    { key: "reception", label: "Reception Area", required: true },
    { key: "wardRoom", label: "General Ward / Rooms", required: true },
    { key: "icu", label: "ICU / Critical Care Unit", required: false },
    { key: "operationTheatre", label: "Operation Theatre", required: false },
    { key: "sideBuilding", label: "Building Side View", required: false },
    { key: "staffGroup", label: "Staff Group Photo", required: false }
  ],
  Medician: [
    { key: "profilePhoto", label: "Store / Pharmacist Profile Photo", required: true },
    { key: "licenseImage", label: "License / Certification Image", required: true },
    { key: "storeFront", label: "Store Front View", required: false },
    { key: "storeInside", label: "Inside Store", required: false },
    { key: "idProof", label: "Aadhaar / ID Proof", required: false }
  ],
  Clinic: [
    { key: "clinicFront", label: "Clinic Front View", required: true },
    { key: "consultRoom", label: "Consultation Room", required: true },
    { key: "clinicInside", label: "Clinic Inside / Reception", required: false },
    { key: "doctorProfile", label: "Doctor Profile Photo", required: false },
    { key: "idProof", label: "Aadhaar / ID Proof", required: false }
  ],
  Lab: [
    { key: "labFront", label: "Lab Front View", required: true },
    { key: "equipment", label: "Major Equipment / Machines", required: true },
    { key: "sampleArea", label: "Sample Collection Area", required: false },
    { key: "staffGroup", label: "Staff Group Photo", required: false },
    { key: "idProof", label: "Aadhaar / ID Proof", required: false }
  ],
  IndividualDoctor: [
    { key: "doctorProfile", label: "Doctor Profile Photo", required: true },
    { key: "clinicFront", label: "Clinic / Practice Front View (if any)", required: false },
    { key: "qualificationImage", label: "Qualification Certificate Image", required: true },
    { key: "idProof", label: "Aadhaar / ID Proof", required: false }
  ]
};

const Images = () => {
  const { form, updateField } = useOnboarding();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentFieldRef = useRef(null);

  const onboardingType = form.onboardingType || "Hospital";
  const IMAGE_FIELDS = IMAGE_FIELDS_BY_TYPE[onboardingType] || IMAGE_FIELDS_BY_TYPE["Hospital"];

  // Open file selector
  const openFileSelector = (fieldKey) => {
    currentFieldRef.current = { fieldKey };
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.click();
  };

  // On change
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Image Size Validation (1 KB - 1 MB)
    const sizeKB = file.size / 1024;
    const sizeMB = file.size / (1024 * 1024);

    if (sizeKB < 1) {
      alert("Image must be at least 1 KB.");
      e.target.value = "";
      return;
    }

    if (sizeMB > 1) {
      alert("Image must be less than or equal to 1 MB.");
      e.target.value = "";
      return;
    }

    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    const { fieldKey } = currentFieldRef.current;
    const updatedImages = {
      ...(form.images || {}),
      [fieldKey]: { file, previewUrl, fileName: file.name }
    };

    updateField("images", updatedImages);
    e.target.value = "";
  };

  const validateRequired = () => {
    const missing = IMAGE_FIELDS.filter((img) => img.required && !form.images?.[img.key]);

    if (missing.length) {
      alert(
        "Please upload required images:\n\n" +
        missing.map((m) => "• " + m.label).join("\n")
      );
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateRequired()) return;
    navigate("/onboarding/services");
  };

  const goPrev = () => navigate("/onboarding/certifications");

  return (
    <div className="images-container">
      <h2 className="form-title">📸 Upload Images</h2>
      <p className="small-info">
        Upload JPG / PNG images (Size: <strong>1KB - 1MB</strong>)
      </p>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <div className="image-grid">
        {IMAGE_FIELDS.map((img) => {
          const uploaded = form.images?.[img.key];
          return (
            <div key={img.key} className="image-card">
              <div className="image-label">
                <strong>{img.label}</strong>
                {img.required && <span className="required-tag">Required</span>}
              </div>

              {uploaded?.previewUrl ? (
                <img src={uploaded.previewUrl} alt={img.label} className="image-preview" />
              ) : (
                <div className="image-placeholder">Upload JPG / PNG (1KB - 1MB)</div>
              )}

              <button
                type="button"
                className="upload-btn"
                onClick={() => openFileSelector(img.key)}
              >
                {uploaded ? "Replace Image" : "Upload Image"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="nav-buttons" style={{ marginTop: 20 }}>
        <button className="btn-prev" onClick={goPrev}>
          ⬅ Previous
        </button>

        <button className="btn-next" onClick={goNext}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Images;
