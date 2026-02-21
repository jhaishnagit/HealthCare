import React from "react";
import "../SuperAdminDashboard/css/super-admin-doctors.css"; // unified styling

export default function DoctorsManagementView() {
  const doctors = [
    // Hospital Doctors
    {
      id: 1,
      name: "Dr. Arvind Kumar",
      specialization: "Cardiology",
      type: "Hospital Doctor",
      hospital: "Sunrise Hospital",
    },
    {
      id: 2,
      name: "Dr. Meera",
      specialization: "Dermatology",
      type: "Hospital Doctor",
      hospital: "City Care Hospital",
    },

    // Independent Doctors (from onboarding)
    {
      id: 10,
      name: "Dr. Krish Patel",
      specialization: "General Physician",
      type: "Independent Doctor",
      hospital: "—",
    },
    {
      id: 11,
      name: "Dr. Asha Reddy",
      specialization: "Pediatrics",
      type: "Independent Doctor",
      hospital: "—",
    },
  ];

  return (
    <div className="sa-page-wrapper">
      <h2 className="sa-page-title">Doctors Management</h2>

      {/* Filters */}
      <div className="sa-filter-box">
        <input type="text" placeholder="Search doctor..." className="sa-search-input" />

        <select className="sa-select">
          <option>Specialization</option>
          <option>Cardiology</option>
          <option>Dermatology</option>
          <option>Orthopedics</option>
          <option>Pediatrics</option>
          <option>General Physician</option>
        </select>
      </div>

      {/* Table */}
      <div className="sa-table-box">
        <table className="sa-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Doctor Type</th>
              <th>Hospital</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td>{doc.specialization}</td>

                <td>
                  <span
                    className={
                      doc.type === "Independent Doctor"
                        ? "badge blue"
                        : "badge green"
                    }
                  >
                    {doc.type}
                  </span>
                </td>

                <td>{doc.hospital}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
