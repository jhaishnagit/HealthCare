import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/OnboardHeader.css";

const OnboardHeader = ({ currentStep }) => {
  const navigate = useNavigate();

  const stepNames = [
    "Hospital Details",
    "Certifications",
    "Images",
    "Services",
    "Owner Details",
  ];

  return (
    <header className="onboard-header">
      <div className="header-flex">

        {/* LEFT: LOGO + NAME */}
        <div className="header-left">
          <img
            src="https://i.ibb.co/2jQ9Yk0/health-logo.png"
            className="header-logo"
            alt="logo"
          />
          <h1 className="header-title">JhaiHealthCare</h1>
        </div>

        {/* RIGHT: CANCEL */}
        <button className="cancel-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </header>

  );
};

export default OnboardHeader;
