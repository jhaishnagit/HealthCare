import React, { useState } from "react";
import "../SuperAdminDashboard/css/patients-management.css"; 

export default function PatientsManagementView() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    {
      id: 1,
      name: "Aman",
      age: 30,
      gender: "M",
      doctor: "Dr. Arvind Kumar",
      type: "Hospital Doctor",
      hospital: "Sunrise Hospital",
      lastAppointment: "12 Dec 2024, 10:00 AM",
    },
    {
      id: 2,
      name: "Rani",
      age: 24,
      gender: "F",
      doctor: "Dr. Meera",
      type: "Independent Doctor",
      hospital: "—",
      lastAppointment: "18 Dec 2024, 2:00 PM",
    },
    {
      id: 3,
      name: "Karthik",
      age: 40,
      gender: "M",
      doctor: "Dr. Varun",
      type: "Hospital Doctor",
      hospital: "Green Valley Hospital",
      lastAppointment: "20 Dec 2024, 5:00 PM",
    },
  ];

  return (
    <div className="pm-page-wrapper">
      <h2 className="pm-page-title">Patients Management</h2>

      {/* Filters */}
      <div className="pm-filter-box">
        <input type="text" placeholder="Search patient..." className="pm-search" />

        <select className="pm-select">
          <option>Gender</option>
          <option>M</option>
          <option>F</option>
        </select>

        <select className="pm-select">
          <option>Doctor Type</option>
          <option>Independent Doctor</option>
          <option>Hospital Doctor</option>
        </select>
      </div>

      {/* Table */}
      <div className="pm-table-box">
        <table className="pm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Booking Type</th>
              <th>Doctor</th>
              <th>Hospital</th>
              <th>Last Appointment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>

                <td>
                  <span
                    className={
                      p.type === "Independent Doctor"
                        ? "badge-independent"
                        : "badge-hospital"
                    }
                  >
                    {p.type}
                  </span>
                </td>

                <td>{p.doctor}</td>
                <td>{p.hospital}</td>
                <td>{p.lastAppointment}</td>

                <td>
                  <button
                    className="pm-view-btn"
                    onClick={() => setSelectedPatient(p)}
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedPatient && (
        <div className="pm-drawer-overlay">
          <div className="pm-drawer">
            <div className="pm-drawer-header">
              <h2>Patient Details</h2>
              <button
                className="pm-close-btn"
                onClick={() => setSelectedPatient(null)}
              >
                ✕
              </button>
            </div>

            <div className="pm-drawer-content">
              <div className="pm-field">
                <label>Name</label>
                <p>{selectedPatient.name}</p>
              </div>

              <div className="pm-field">
                <label>Age</label>
                <p>{selectedPatient.age}</p>
              </div>

              <div className="pm-field">
                <label>Gender</label>
                <p>{selectedPatient.gender}</p>
              </div>

              <div className="pm-field">
                <label>Doctor Type</label>
                <p>{selectedPatient.type}</p>
              </div>

              <div className="pm-field">
                <label>Doctor</label>
                <p>{selectedPatient.doctor}</p>
              </div>

              <div className="pm-field">
                <label>Hospital</label>
                <p>{selectedPatient.hospital}</p>
              </div>

              <div className="pm-field">
                <label>Last Appointment</label>
                <p>{selectedPatient.lastAppointment}</p>
              </div>

              <div className="pm-section">
                <h3>Booking History</h3>
                <ul>
                  <li>Previous booking details can be shown here...</li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
