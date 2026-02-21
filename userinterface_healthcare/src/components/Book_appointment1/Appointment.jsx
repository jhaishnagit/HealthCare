import React, { useEffect, useState } from "react";
import "./css/Appointment1.css";

import Header1 from "./Header1";
import Hero from "./Hero";
import SearchSection from "./SearchSection";
import HealthcareFacilities from "./HealthcareFacilities";
import Footer from "./Footer";
import AlertModal from "./Models/AlertModal";

import { OrganizationAPI } from "../../services/api";

function Appointment() {
  const [facilities, setFacilities] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [alertInfo, setAlertInfo] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const [showAlertModal, setShowAlertModal] = useState(false);

  // LOAD HOSPITALS
  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const res = await OrganizationAPI.getAllHospitals({
        page: 0,
        size: 10,
      });
      setFacilities(res.data.data || []);
      setAllFacilities(res.data.data || []);
    } catch {
      showAlert("Error", "Failed to load hospitals", "error");
    } finally {
      setLoading(false);
    }
  };

  // SEARCH
  const handleSearch = (term) => {
    if (!term) {
      setFacilities(allFacilities);
      return;
    }

    const lower = term.toLowerCase();
    const filtered = allFacilities.filter(
      (h) =>
        h.name?.toLowerCase().includes(lower) ||
        h.city?.toLowerCase().includes(lower)
    );

    setFacilities(filtered);
  };

  // NEARBY
  const handleNearHospitals = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setLoading(true);
          const res = await OrganizationAPI.getNearby({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            radius: 5,
          });
          setFacilities(res.data.data || []);
        } catch {
          showAlert("Error", "Failed to load nearby hospitals", "error");
        } finally {
          setLoading(false);
        }
      },
      () => showAlert("Error", "Location permission denied", "error")
    );
  };

  // 🚗 ROUTE (REAL GOOGLE MAPS)
  const handleShowRoute = (hospital) => {
    if (!hospital.latitude || !hospital.longitude) {
      showAlert("Error", "Hospital location not available", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
        const destination = `${hospital.latitude},${hospital.longitude}`;

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

        window.open(googleMapsUrl, "_blank");
      },
      () =>
        showAlert(
          "Error",
          "Please allow location access to get route",
          "error"
        )
    );
  };

  const showAlert = (title, message, type = "info") => {
    setAlertInfo({ title, message, type });
    setShowAlertModal(true);
  };

  return (
    <div className="Appointment">
      <Header1 />

      <main className="container">
        <Hero />

        <SearchSection
          onSearch={handleSearch}
          onNearHospitals={handleNearHospitals}
        />

        <HealthcareFacilities
          facilities={facilities}
          loading={loading}
          onRouteClick={handleShowRoute}
        />
      </main>

      <AlertModal
        isOpen={showAlertModal}
        {...alertInfo}
        onClose={() => setShowAlertModal(false)}
      />

      <Footer />
    </div>
  );
}

export default Appointment;
