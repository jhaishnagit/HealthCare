// src/components/onboarding/jsx_files/Certifications.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../css/Certifications.css";

/**
 * This component supports onboardingType:
 * - "Hospital"
 * - "Medician"
 * - "Clinic"
 * - "Lab" (or "Laboratory")
 * - "IndividualDoctor"
 *
 * It will pick the correct certificate fields based on form.onboardingType.
 */

// -------------------- Field definitions for each onboarding type --------------------
const CERT_FIELDS = {
  Hospital: [
    { key: "hospitalRegistration", label: "Hospital Registration Certificate", required: true },
    { key: "gstCertificate", label: "GST Registration Certificate", required: true },
    { key: "fireNOC", label: "Fire Safety Certificate (NOC)", required: false },
    { key: "nabhCertificate", label: "NABH / NABL Accreditation", required: false },
    { key: "biomedicalWasteCert", label: "Biomedical Waste Authorization", required: false },
    { key: "bankProof", label: "Cancelled Cheque / Bank Statement", required: false }
  ],
  Medician: [
    { key: "drugLicenseNumber", label: "Drug License Number (scanned)", required: true },
    { key: "drugLicenseCert", label: "Drug License Certificate", required: true },
    { key: "pharmacyRegNumber", label: "Pharmacy Registration Number", required: false },
    { key: "gstCertMed", label: "GST Certificate", required: false },
    { key: "shopEstCert", label: "Shop Establishment Certificate", required: false },
    { key: "storePhoto", label: "Medical Store Photo", required: false }
  ],
  Clinic: [
    { key: "clinicRegistration", label: "Clinic Registration Certificate", required: true },
    { key: "clinicPractitionerCert", label: "Practitioner Qualification Certificate", required: true },
    { key: "gstCertificate", label: "GST Certificate", required: false },
    { key: "fireNOC", label: "Fire Safety NOC (if applicable)", required: false },
    { key: "bankProof", label: "Cancelled Cheque / Bank Statement", required: false }
  ],
  Lab: [
    { key: "labRegistration", label: "Lab Registration Certificate", required: true },
    { key: "nablCertificate", label: "NABL Accreditation (if any)", required: false },
    { key: "biomedicalWasteCert", label: "Biomedical Waste Authorization", required: false },
    { key: "gstCertificate", label: "GST Certificate", required: false },
    { key: "bankProof", label: "Cancelled Cheque / Bank Statement", required: false }
  ],
  IndividualDoctor: [
    { key: "doctorRegistration", label: "Medical Registration Certificate (MCI / State)", required: true },
    { key: "qualificationCert", label: "Qualification Certificate (MBBS/MD)", required: true },
    { key: "identityProof", label: "Aadhaar / ID Proof", required: false },
    { key: "bankProof", label: "Cancelled Cheque / Bank Statement", required: false }
  ]
};

const Certifications = () => {
  const { form, updateField } = useOnboarding();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentKeyRef = useRef(null);

  const onboardingType = form.onboardingType || "Hospital";
  const initialFiles = form.certifications || {};
  const [files, setFiles] = useState(initialFiles);

  useEffect(() => {
    // keep onboarding context updated
    updateField("certifications", files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Allowed file types
  const fileTypes = ".pdf,.doc,.docx,.xls,.xlsx";

  const openFileSelector = (key) => {
    currentKeyRef.current = key;
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = fileTypes;
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File Size Validation (1MB - 5MB)
    const sizeMB = file.size / (1024 * 1024);

    if (sizeMB < 1) {
      alert("File must be at least 1MB.");
      e.target.value = "";
      return;
    }

    if (sizeMB > 5) {
      alert("File must be less than or equal to 5MB.");
      e.target.value = "";
      return;
    }

    // Save file in local state
    setFiles((prev) => ({
      ...prev,
      [currentKeyRef.current]: {
        file,
        fileName: file.name
      }
    }));

    e.target.value = "";
  };

  // Determine fields for the current onboarding type
  const CERTIFICATE_FIELDS =
    CERT_FIELDS[onboardingType] || CERT_FIELDS["Hospital"];

  // Validate required certificates
  const validateRequired = () => {
    const missing = CERTIFICATE_FIELDS.filter(
      (f) => f.required && !files[f.key]
    );

    if (missing.length) {
      alert(
        "Please upload required certificates:\n\n" +
        missing.map((m) => "• " + m.label).join("\n")
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateRequired()) return;
    navigate("/onboarding/images");
  };

  const handlePrev = () => {
    const type = form.onboardingType;

    switch (type) {
      case "Clinic":
        navigate("/onboarding/clinic");
        break;

      case "Hospital":
        navigate("/onboarding/hospital");
        break;

      case "Lab":
        navigate("/onboarding/diagnostic");
        break;

      case "Medician":     // depending on your exact spelling
        navigate("/onboarding/medical-store");
        break;

      case "IndividualDoctor":
        navigate("/onboarding/individual");
        break;

      default:
        navigate("/onboarding");
    }
  };


  return (
    <div className="images-container">
      <h2 className="form-title">📄 Certifications</h2>
      <p className="small-info">
        Upload PDF / Word / Excel documents (Size: <strong>1MB - 5MB only</strong>)
      </p>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <div className="image-grid">
        {CERTIFICATE_FIELDS.map((cert) => {
          const uploaded = files[cert.key];

          return (
            <div key={cert.key} className="image-card">
              <div className="image-label">
                <strong>{cert.label}</strong>
                {cert.required && <span className="required-tag">Required</span>}
              </div>

              {uploaded?.fileName ? (
                <div className="file-box">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{uploaded.fileName}</span>
                </div>
              ) : (
                <div className="image-placeholder">
                  Upload PDF / Word / Excel (1MB - 5MB)
                </div>
              )}

              <button
                type="button"
                className="upload-btn"
                onClick={() => openFileSelector(cert.key)}
              >
                {uploaded ? "Replace Document" : "Upload Document"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="nav-buttons" style={{ marginTop: 20 }}>
        <button className="btn-prev" onClick={handlePrev}>
          ⬅ Back
        </button>

        <button className="btn-next" onClick={handleNext}>
          Next ➜
        </button>
      </div>
    </div>
  );
};

export default Certifications;
