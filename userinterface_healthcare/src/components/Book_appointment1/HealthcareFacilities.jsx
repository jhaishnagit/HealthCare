import React from "react";

const HealthcareFacilities = ({ facilities, loading, onRouteClick }) => {
  if (loading) return <p>Loading hospitals...</p>;
  if (!facilities.length)
    return <p>No facilities found matching your criteria.</p>;

  return (
    <div className="list-section">
      {facilities.map((h) => {
        let services = [];
        if (typeof h.services === "string") {
          try {
            services = JSON.parse(h.services);
          } catch {}
        }

        return (
          <div key={h.id} className="hospital-card">
            <div className="card-header">
              <h3>{h.name}</h3>
              {h.distance !== undefined && (
                <span className="distance-badge">
                  {Number(h.distance).toFixed(2)} km away
                </span>
              )}
            </div>

            <span className="type-badge">
              {h.type} - {h.city}
            </span>

            <p className="address">{h.address}</p>

            <div className="meta-row">
              <span>📞 {h.hospitalPhone}</span>
              <span>⭐ 4.5/5 Rating</span>
            </div>

            {services.length > 0 && (
              <p className="services-text">{services.join(", ")}</p>
            )}

            <div className="actions">
              <button className="btn-primary">Online Appointment</button>
              <button className="btn-outline">Offline Appointment</button>
              <button
                className="btn-route"
                onClick={() => onRouteClick(h)}
              >
                🚗 Route
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HealthcareFacilities;
