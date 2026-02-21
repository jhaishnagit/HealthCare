// src/components/onboarding/context/OnboardingContext.js
import React, { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [form, setForm] = useState({
    /* -------- ALL YOUR FIELDS SAME AS BEFORE -------- */
    onboardingType: "",
    code: "",
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    latitude: "",
    longitude: "",
    organizationMail: "",
    hospital_phone: "",
    alternate_phone: "",
    website: "",
    type: "",
    tagline: "",
    established_year: "",
    ownership_type: "",
    total_beds: "",
    icu_beds: "",
    emergency_beds: "",
    operation_theatres: "",
    ventilators: "",
    ambulances: "",
    clinic_type: "",
    clinic_specialization: "",
    center_type: "",
    license_no: "",
    lab_accreditation: "",
    doctor_name: "",
    specialization: "",
    qualification: "",
    experience: "",
    reg_number: "",
    consultation_fee: "",
    ownerName: "",
    designation: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAadhar: "",
    ownerPAN: "",
    ownerAddress: "",
    departments: [],
    services: [],
    facilities: [],
    certifications: {},
    images: {},
    status: "pending",
    onboarding_stage: 1,
    verification_level: "none",
    rejection_reason: "",
    rating: 0,
    rating_count: 0,
    views: 0,
    profile_completion: 0,
    submitted_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
    ip_address: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    hospitalId: null,
  });

  /* ------------------ UPDATE SINGLE FIELD ------------------ */
  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ------------------ UPDATE MULTIPLE FIELDS AT ONCE ------------------ */
  const updateOnboardingData = (newData) => {
    setForm((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  /* ------------------ STORE CREATED ID ------------------ */
  const setHospitalId = (id) => {
    setForm((prev) => ({
      ...prev,
      hospitalId: id,
    }));
  };

  /* ------------------ TOGGLE ARRAY FIELDS ------------------ */
  const toggleArrayItem = (field, value) => {
    setForm((prev) => {
      const arr = prev[field] || [];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((i) => i !== value)
          : [...arr, value],
      };
    });
  };

  /* ------------------ ONBOARDING STEP NAVIGATION ------------------ */
  const [step, setStep] = useState(1);

  const onNext = () => setStep((prev) => prev + 1);
  const onPrev = () => setStep((prev) => prev - 1);

  return (
    <OnboardingContext.Provider
      value={{
        form,
        step,
        updateField,
        updateOnboardingData,
        setHospitalId,
        toggleArrayItem,
        onNext,
        onPrev,
        setForm,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
