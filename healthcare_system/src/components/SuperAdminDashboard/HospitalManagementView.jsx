import React, { useState, useEffect } from "react";
import { HospitalAPI } from "../../services/api";

import MedicalStoresManagementView from "./MedicalStoresManagementView";
import LaboratoryManagementView from "./LaboratoryManagementView";
import DoctorsManagementView from "./DoctorsManagementView";

import "../SuperAdminDashboard/css/ApprovalWorkflowView.css"; // YOUR PREMIUM CSS

export default function HospitalManagementView({ setHideLayout }) {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // ⭐ ADDED — To switch between tabs
  const [activeTab, setActiveTab] = useState("hospitals");

  // -------------------------------------
  // FETCH HOSPITAL DETAILS (your existing code)
  // -------------------------------------
  async function fetchDetails(id) {
    try {
      const res = await HospitalAPI.getById(id);

      const owner = res.data.owner || {};
      const hospital = res.data.hospital || {};

      const flattenedOwner = Object.fromEntries(
        Object.entries(owner).map(([k, v]) => [`owner_${k}`, v])
      );

      const combined = {
        ...flattenedOwner,
        ...hospital,
      };

      setSelected(combined);
    } catch (err) {
      alert("Failed to load details");
    } finally {
      setLoadingDetails(false);
    }
  }

  // -------------------------------------
  // LOAD APPROVED + REJECTED HOSPITALS
  // -------------------------------------
  useEffect(() => {
    async function loadHospitals() {
      try {
        const approvedRes = await HospitalAPI.getFinalApprovedHospitals();
        const rejectedRes = await HospitalAPI.getRejectedHospitals();

        const approved = approvedRes.data.data || [];
        const rejected = rejectedRes.data.data || [];

        const all = [...approved, ...rejected];

        setHospitals(all);
        setFiltered(all);
      } catch (e) {
        console.error("Hospital Load Error:", e);
      } finally {
        setLoading(false);
      }
    }

    loadHospitals();
  }, []);

  // -------------------------------------
  // FILTERS + SEARCH
  // -------------------------------------
  useEffect(() => {
    let result = [...hospitals];

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter(
        (h) =>
          h.name?.toLowerCase().includes(s) ||
          h.code?.toLowerCase().includes(s) ||
          h.city?.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((h) => {
        const st =
          h.status ||
          (h.verificationLevel == 2
            ? "Final Approved"
            : h.verificationLevel == 3
            ? "Rejected"
            : "Pending");

        return st.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    if (cityFilter !== "all") {
      result = result.filter(
        (h) => h.city?.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    setFiltered(result);
  }, [search, statusFilter, cityFilter, hospitals]);

  if (loading) return <h3>Loading hospitals...</h3>;

  const uniqueCities = [...new Set(hospitals.map((h) => h.city).filter(Boolean))];

  // -----------------------------------------------------
  // DETAILS PAGE (YOUR SAME CODE)
  // -----------------------------------------------------
  if (selected) {
    return (
      <div className="page-wrapper hospital-page">

        <div className="back-row">
          <button
            className="back-btn"
            onClick={() => {
              setSelected(null);
              setHideLayout(false);
            }}
          >
            ← Back
          </button>
        </div>

        <div className="details-card">
          <h2 className="details-title">{selected.name}</h2>

          {/* OWNER DETAILS */}
          <div className="section">
            <h3 className="section-title">Owner Details</h3>
            <div className="info-grid">
              {Object.keys(selected)
                .filter((k) => k.startsWith("owner_"))
                .map((key) => (
                  <div key={key} className="info-item">
                    <label>{key.replace("owner_", "").replace(/_/g, " ").toUpperCase()}</label>
                    <p>{selected[key] ?? "—"}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* HOSPITAL DETAILS */}
          <div className="section">
            <h3 className="section-title">Hospital Details</h3>
            <div className="info-grid">
              {Object.keys(selected)
                .filter(
                  (k) =>
                    !k.startsWith("owner_") &&
                    k !== "documents" &&
                    k !== "images"
                )
                .map((key) => (
                  <div key={key} className="info-item">
                    <label>{key.replace(/_/g, " ").toUpperCase()}</label>
                    <p>{selected[key] ?? "—"}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* MAP */}
          <div className="section">
            <h3 className="section-title">Location</h3>
            {selected.latitude && selected.longitude ? (
              <div className="map-box">
                <iframe
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: "12px" }}
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
            ) : (
              <p>No location available</p>
            )}
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
                    onClick={() =>
                      setPreviewImage(`data:${img.type};base64,${img.data}`)
                    }
                  >
                    <img
                      src={`data:${img.type};base64,${img.data}`}
                      alt="hospital"
                    />
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
                  <a
                    key={i}
                    className="doc-item"
                    href={`data:${doc.type};base64,${doc.data}`}
                    download={doc.name}
                  >
                    📄 {doc.name}
                  </a>
                ))}
              </div>
            ) : (
              <p>No documents uploaded</p>
            )}
          </div>
        </div>

        {previewImage && (
          <div className="img-modal" onClick={() => setPreviewImage(null)}>
            <img src={previewImage} className="img-modal-content" />
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------
  // MAIN PAGE WITH TABS
  // -----------------------------------------------------
  return (
    <div className="page-wrapper">

      {/* ⭐ TOP CATEGORY TABS */}
      <div className="category-tab-container">
        <button
          className={`category-tab ${activeTab === "hospitals" ? "active" : ""}`}
          onClick={() => setActiveTab("hospitals")}
        >
          🏥 Hospitals
        </button>

        <button
          className={`category-tab ${activeTab === "stores" ? "active" : ""}`}
          onClick={() => setActiveTab("stores")}
        >
          🏪 Medical Stores
        </button>

        <button
          className={`category-tab ${activeTab === "labs" ? "active" : ""}`}
          onClick={() => setActiveTab("labs")}
        >
          🔬 Laboratories
        </button>

        <button
          className={`category-tab ${activeTab === "doctors" ? "active" : ""}`}
          onClick={() => setActiveTab("doctors")}
        >
          👨‍⚕️ Doctors
        </button>
      </div>

      {/* ⭐ SHOW HOSPITALS */}
      {activeTab === "hospitals" && (
        <>
          <h2 className="page-title">🏥 Hospital Management</h2>

          <div className="filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search hospital name, code, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
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

          <div className="table-box">
            <table className="hospital-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Ownership</th>
                  <th>Beds</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.name}</td>
                    <td>{h.code}</td>
                    <td>{h.type || "—"}</td>
                    <td>{h.city || "—"}</td>
                    <td>{h.ownership_type || "—"}</td>
                    <td>{h.total_beds || "—"}</td>
                    <td>
                      <span
                        className={`badge ${
                          h.verificationLevel == 2
                            ? "approved"
                            : h.verificationLevel == 3
                            ? "rejected"
                            : "pending"
                        }`}
                      >
                        {h.verificationLevel == 2
                          ? "Final Approved"
                          : h.verificationLevel == 3
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </td>

                    <td>{h.createdAt || h.created_at || "—"}</td>

                    <td>
                      <button
                        className="btn view"
                        onClick={() => {
                          setHideLayout(true);
                          setLoadingDetails(true);
                          fetchDetails(h.id);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loadingDetails && (
              <div className="details-loader">Loading details...</div>
            )}
          </div>
        </>
      )}

      {/* ⭐ SHOW MEDICAL STORES */}
      {activeTab === "stores" && <MedicalStoresManagementView />}

      {/* ⭐ SHOW LABORATORIES */}
      {activeTab === "labs" && <LaboratoryManagementView />}

      {/* ⭐ SHOW DOCTORS */}
      {activeTab === "doctors" && <DoctorsManagementView />}
    </div>
  );
}
 