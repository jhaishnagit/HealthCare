// src/components/onboarding/OnboardingLayout.jsx

import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";

import OnboardHeader from "./OnboardHeader";
import OnboardProgressBar from "./OnboardProgressBar";
import OnboardFooter from "./OnboardFooter";

const OnboardingLayout = () => {
  const location = useLocation();

  const currentStep = useMemo(() => {
    const path = location.pathname.toLowerCase();

    if (path === "/onboarding" || path === "/onboarding/") return 1;
    if (path.includes("/certifications")) return 2;
    if (path.includes("/images")) return 3;
    if (path.includes("/services")) return 4;
    if (path.includes("/owner")) return 5;

    return 1;
  }, [location.pathname]);

  return (
    <div className="onboard-wrapper">
      <OnboardHeader currentStep={currentStep} />
      <OnboardProgressBar currentStep={currentStep} />

      <main className="onboard-content">
        <div className="onboard-card">
          <Outlet />
        </div>
      </main>

      <OnboardFooter />
    </div>
  );
};

export default OnboardingLayout;
