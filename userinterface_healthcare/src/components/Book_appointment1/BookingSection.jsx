// src/components/BookingSection.jsx
import React, { useEffect, useRef } from "react";
import "./css/BookingSection.css";

const BookingSection = ({ facilities, selectedId }) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const markers = useRef({});

  useEffect(() => {
    if (!map.current && window.L) {
      map.current = window.L.map(mapRef.current).setView(
        [20.5937, 78.9629],
        6
      );

      window.L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ).addTo(map.current);
    }
  }, []);

  // Load markers
  useEffect(() => {
    if (!map.current) return;

    Object.values(markers.current).forEach((m) =>
      map.current.removeLayer(m)
    );
    markers.current = {};

    facilities.forEach((h) => {
      if (!h.latitude || !h.longitude) return;

      const marker = window.L.marker([h.latitude, h.longitude])
        .addTo(map.current)
        .bindPopup(`<b>${h.name}</b><br/>${h.city}`);

      markers.current[h.id] = marker;
    });

    if (facilities.length) {
      const group = window.L.featureGroup(
        Object.values(markers.current)
      );
      map.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [facilities]);

  // 🎯 ROUTE CLICK → CENTER MAP
  useEffect(() => {
    if (!selectedId || !markers.current[selectedId]) return;

    const marker = markers.current[selectedId];
    map.current.setView(marker.getLatLng(), 14);
    marker.openPopup();
  }, [selectedId]);

  return (
    <div className="map-section">
      <div id="map" ref={mapRef}></div>
    </div>
  );
};

export default BookingSection;
