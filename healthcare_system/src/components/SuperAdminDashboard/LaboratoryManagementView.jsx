import React, { useState, useEffect } from "react";
import "../SuperAdminDashboard/css/hospital-management.css";

export default function LaboratoryManagementView() {
  const [labs, setLabs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  // ----------------------------------------------
  // LOAD DUMMY DATA
  // ----------------------------------------------
  useEffect(() => {
    setLoading(true);

    const dummyLabs = [
      {
        id: 1,
        name: "Apollo Diagnostic Lab",
        code: "LAB001",
        type: "Laboratory",
        city: "Hyderabad",
        organizationmail: "apollo.lab@gmail.com",
        verificationLevel: 2,
        statusText: "Final Approved",
        createdAt: "2025-01-12",

        // Owner
        owner_name: "Ramesh",
        owner_mobile: "9876543210",
        owner_email: "ramesh@gmail.com",
        owner_address: "Hyderabad",

        // Lab details
        address: "Kukatpally, Hyderabad",
        pincode: "500072",
        registration_number: "REG1234",
        website: "www.apollolab.com",

        latitude: 17.4923,
        longitude: 78.3915,

        images: JSON.stringify([
          {
            name: "lab1.jpg",
            type: "image/jpeg",
            data: "",
          },
        ]),

        documents: JSON.stringify([
          {
            name: "license.pdf",
            type: "application/pdf",
            data: "",
          },
        ]),
      },

      {
        id: 2,
        name: "Vijaya Labs",
        code: "LAB002",
        type: "Laboratory",
        city: "Chennai",
        organizationmail: "vijaya.lab@gmail.com",
        verificationLevel: 0,
        statusText: "Pending",
        createdAt: "2025-02-01",

        // Owner
        owner_name: "Karthik",
        owner_mobile: "9876500123",
        owner_email: "karthik@gmail.com",
        owner_address: "Chennai",

        address: "T Nagar, Chennai",
        pincode: "600017",
        registration_number: "REG5678",
        website: "www.vijayalab.com",

        latitude: 13.0827,
        longitude: 80.2707,

        images: null,
        documents: null,
      },
    ];

    setLabs(dummyLabs);
    setFiltered(dummyLabs);
    setLoading(false);
  }, []);

  // ----------------------------------------------
  // SEARCH + FILTER LOGIC
  // ----------------------------------------------
  useEffect(() => {
    let result = [...labs];

    // Search
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(s) ||
          l.code.toLowerCase().includes(s) ||
          l.city.toLowerCase().includes(s) ||
          l.organizationmail.toLowerCase().includes(s)
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter(
        (l) => l.statusText.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // City Filter
    if (cityFilter !== "all") {
      result = result.filter(
        (l) => l.city.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    setFiltered(result);
  }, [search, statusFilter, cityFilter, labs]);

  if (loading) return <h3>Loading Laboratories...</h3>;

  const uniqueCities = [...new Set(labs.map((l) => l.city))];

  // Allowed Owner & Lab Fields
  const OWNER_ALLOW = ["owner_name", "owner_mobile", "owner_email", "owner_address"];

  const LAB_ALLOW = [
    "code",
    "name",
    "type",
    "address",
    "city",
    "pincode",
    "registration_number",
    "organizationmail",
    "website",
  ];

  return (
    <div className="page-wrapper">
      {!selected && (
        <>
          <h2 className="page-title">🔬 Laboratory Management</h2>

          {/* FILTER BAR */}
          <div className="filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, code, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Final Approved">Final Approved</option>
            </select>

            <select
              className="filter-select"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All Cities</option>
              {uniqueCities.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE */}
          <div className="table-box">
            <table className="hospital-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>City</th>
                  <th>Mail</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((lab) => (
                  <tr key={lab.id}>
                    <td>{lab.id}</td>
                    <td>{lab.name}</td>
                    <td>{lab.code}</td>
                    <td>{lab.city}</td>
                    <td>{lab.organizationmail}</td>

                    <td>
                      <span
                        className={`badge ${
                          lab.verificationLevel === 2
                            ? "approved"
                            : lab.verificationLevel === 0
                            ? "pending"
                            : ""
                        }`}
                      >
                        {lab.statusText}
                      </span>
                    </td>

                    <td>{lab.createdAt}</td>

                    <td>
                      <button
                        className="btn view"
                        onClick={() => setSelected(lab)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No laboratories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ----------------------------------------------
          DETAILS PAGE (When "View" clicked)
      ---------------------------------------------- */}
      {selected && (
        <div className="details-page">
          <div className="back-row">
            <button className="back-btn" onClick={() => setSelected(null)}>
              ← Back
            </button>
          </div>

          <div className="details-card">
            <h2 className="details-title">{selected.name}</h2>

            {/* OWNER DETAILS */}
            <div className="section">
              <h3 className="section-title">Owner Details</h3>
              <div className="info-grid">
                {OWNER_ALLOW.map((key) => (
                  <div key={key} className="info-item">
                    <label>{key.replace("owner_", "").toUpperCase()}</label>
                    <p>{selected[key] ?? "—"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* LAB DETAILS */}
            <div className="section">
              <h3 className="section-title">Laboratory Details</h3>
              <div className="info-grid">
                {LAB_ALLOW.map((key) => (
                  <div key={key} className="info-item">
                    <label>{key.toUpperCase()}</label>
                    <p>{selected[key] ?? "—"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* IMAGES */}
            <div className="section">
              <h3 className="section-title">Images</h3>

              {selected.images ? (
                <div className="image-grid">
                  {JSON.parse(selected.images).map((img, i) => (
                    <div
                      key={i}
                      className="image-box"
                      onClick={() => setPreviewImage("")}
                    >
                      <img src="" alt="lab" />
                      <span>{img.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No images uploaded</p>
              )}
            </div>

            {/* DOCUMENTS */}
            <div className="section">
              <h3 className="section-title">Documents</h3>

              {selected.documents ? (
                <div className="doc-list">
                  {JSON.parse(selected.documents).map((doc, i) => (
                    <a key={i} className="doc-item" href="#">
                      📄 {doc.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p>No documents uploaded</p>
              )}
            </div>
          </div>

          {/* Image Modal */}
          {previewImage && (
            <div className="img-modal" onClick={() => setPreviewImage(null)}>
              <img src="" className="img-modal-content" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
