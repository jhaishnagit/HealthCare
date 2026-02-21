import React from "react";
import "./css/OnboardProgressBar.css";
import { Building2, FileCheck, Image, Stethoscope, UserRound, Wallet2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const OnboardProgressBar = ({ currentStep }) => {
  const location = useLocation();

  // Detect BANK PAGE
  const isBankPage =
    location.pathname.toLowerCase().includes("bank") ||
    location.pathname.toLowerCase().includes("bankdetails");

  // Base Steps
  let steps = [
    { id: 1, label: "Details", icon: <Building2 size={22} /> },
    { id: 2, label: "Certifications", icon: <FileCheck size={22} /> },
    { id: 3, label: "Images", icon: <Image size={22} /> },
    { id: 4, label: "Services", icon: <Stethoscope size={22} /> },
    { id: 5, label: "Owner Details", icon: <UserRound size={22} /> },
  ];

  // Append Bank Step ONLY on Bank Page
  if (isBankPage) {
    steps.push({
      id: 6,
      label: "Bank Details",
      icon: <Wallet2 size={22} />,
    });
  }

  // ⭐ When on BANK FORM → Make ALL earlier steps ACTIVE (blue)
  const activeStep = isBankPage ? steps.length : currentStep;

  return (
    <div className="progress-wrapper">
      <div className="progress-container">
        {steps.map((step, index) => (
          <div key={step.id} className="progress-step">

            <div className={`step-circle ${activeStep >= step.id ? "active" : ""}`}>
              <span className="step-icon">{step.icon}</span>
            </div>

            <p className="step-label">{step.label}</p>

            {index < steps.length - 1 && (
              <div className={`step-line ${activeStep > step.id ? "active" : ""}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardProgressBar;
