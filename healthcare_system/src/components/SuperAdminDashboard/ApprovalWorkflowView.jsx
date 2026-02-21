import React, { useState, useEffect } from "react";
import { HospitalAPI } from "../../services/api";
import "../SuperAdminDashboard/css/ApprovalWorkflowView.css";

export default function ApprovalWorkflowView({ setHideLayout }) {
  const [tab, setTab] = useState("hospitals");

  // ⭐ UPDATED: Added labs + doctors
  const [list, setList] = useState({
    hospitals: [],
    stores: [],
    labs: [],
    doctors: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // -------------------------------------------
  // LOAD PENDING APPROVALS
  // -------------------------------------------
  useEffect(() => {
    async function loadApprovals() {
      try {
        // OLD APIS
        const res = await HospitalAPI.getPending();
        const hospitals = res.data.data || [];

        const storesRes = await HospitalAPI.getPendingStores();
        const stores = storesRes.data.data || [];

        // ⭐ NEW APIS ADDED → Labs & Doctors
        const labsRes = await HospitalAPI.getPendingLabs();
        const labs = labsRes.data.data || [];

        const doctorsRes = await HospitalAPI.getPendingDoctors();
        const doctors = doctorsRes.data.data || [];

        // ⭐ UPDATED setList → ADD labs & doctors
        setList({
          hospitals: Array.isArray(hospitals) ? hospitals : [],
          stores: Array.isArray(stores) ? stores : [],
          labs: Array.isArray(labs) ? labs : [],
          doctors: Array.isArray(doctors) ? doctors : [],
        });
      } catch (err) {
        setError("Failed to load approval list.");
      }

      setLoading(false);
    }

    loadApprovals();
  }, []);

  // -------------------------------------------
  // FETCH FULL DETAILS
  // -------------------------------------------
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

  // -------------------------------------------
  // APPROVE / REJECT
  // -------------------------------------------
  async function doAction(action) {
    if (!selected) return;

    setLoadingAction(true);

    const newVerificationLevel = action === "approve" ? "1" : "3";
    const newStatus = action === "approve" ? "Approved" : "Rejected";

    try {
      await HospitalAPI.updateVerification(selected.id, {
        verificationLevel: newVerificationLevel,
        status: newStatus,
      });

      if (action === "approve") {
        await HospitalAPI.sendApprovalMail({
          email: selected.owner_email,
          organizationName: selected.name,
          password: selected.owner_password || "Owner@123",
        });
      } else {
        await HospitalAPI.sendRejectionMail({
          email: selected.owner_email,
          organizationName: selected.name,
          reason: rejectReason,
        });
      }

      // REMOVE FROM UI
      setList((prev) => ({
        ...prev,
        hospitals: prev.hospitals.filter((h) => h.id !== selected.id),
        stores: prev.stores.filter((s) => s.id !== selected.id),
        labs: prev.labs.filter((l) => l.id !== selected.id),
        doctors: prev.doctors.filter((d) => d.id !== selected.id),
      }));

      alert(`Successfully ${newStatus} & email sent.`);

      setSelected(null);
      setHideLayout(false);
    } catch (err) {
      console.error("❌ ERROR:", err.response?.data || err);
      alert("Failed to update status or send email.");
    } finally {
      setLoadingAction(false);
    }
  }

  // -------------------------------------------
  // LOADING & ERROR
  // -------------------------------------------
  if (loading)
    return (
      <div className="page-wrapper">
        <h3>Loading approvals...</h3>
      </div>
    );

  if (error)
    return (
      <div className="page-wrapper">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );

  // OWNER
  const OWNER_ALLOW = [
    "owner_name",
    "owner_mobile",
    "owner_email",
    "owner_adhar",
    "owner_address",
    "owner_department",
    "owner_role",
    "owner_ownerpan",
    "owner_designation",
  ];

  // HOSPITAL ALLOW FIELDS
  const HOSPITAL_ALLOW = [
    "code",
    "name",
    "type",
    "tagline",
    "description",
    "established_year",
    "ownership_type",
    "organizationmail",
    "hospital_phone",
    "alternate_phone",
    "website",
    "address",
    "landmark",
    "area",
    "city",
    "district",
    "state",
    "country",
    "pincode",
    "total_beds",
    "icu_beds",
    "emergency_beds",
    "operation_theatres",
    "ventilators",
    "ambulances",
    "departments",
    "services",
    "facilities",
    "registration_number",
    "gst_number",
    "licence_expiry",
    "fire_safety_validity",
    "insurance_details",
  ];

  // STORE ALLOW FIELDS
  const STORE_ALLOW = [
    "code",
    "name",
    "type",
    "description",
    "ownership_type",
    "organizationmail",
    "hospital_phone",
    "alternate_phone",
    "website",
    "address",
    "landmark",
    "area",
    "city",
    "district",
    "state",
    "country",
    "pincode",
    "registration_number",
    "gst_number",
    "licence_expiry",
  ];

  // -------------------------------------------
  // LIST PAGE UI
  // -------------------------------------------
  return (
    <div className="page-wrapper">
      {!selected && !loadingDetails && (
        <>
          <div className="pg-head">
            <h2 className="page-title">⚙️ Approvals & Reviews</h2>
            <div className="pg-sub">Review pending registrations.</div>
          </div>

          {/* TABS */}
          <div className="workflow-tabs">
            <button
              className={tab === "hospitals" ? "tab active" : "tab"}
              onClick={() => setTab("hospitals")}
            >
              🏥 Hospitals ({list.hospitals.length})
            </button>

            <button
              className={tab === "stores" ? "tab active" : "tab"}
              onClick={() => setTab("stores")}
            >
              🏬 Medical Stores ({list.stores.length})
            </button>

            {/* ⭐ NEW LAB TAB */}
            <button
              className={tab === "labs" ? "tab active" : "tab"}
              onClick={() => setTab("labs")}
            >
              🔬 Laboratories ({list.labs.length})
            </button>

            {/* ⭐ NEW DOCTOR TAB */}
            <button
              className={tab === "doctors" ? "tab active" : "tab"}
              onClick={() => setTab("doctors")}
            >
              👨‍⚕️ Doctors ({list.doctors.length})
            </button>
          </div>

          {/* LIST */}
          <div className="workflow-list">   
            {(                              
              tab === "hospitals"
                ? list.hospitals
                : tab === "stores"
                ? list.stores
                : tab === "labs"
                ? list.labs
                : list.doctors
            ).map((item) => (
              <div key={item.id} className="workflow-card">
                <div className="wf-left">
                  <h3>{item.name}</h3>
                  <p className="muted">ID: {item.id} • {item.city}</p>
                </div>

                <div className="wf-right">
                  <button
                    className="btn view"
                    onClick={() => {
                      setHideLayout(true);
                      setLoadingDetails(true);
                      fetchDetails(item.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {loadingDetails && <div className="details-loader">Loading details...</div>}

      {/* -------------------------------------------
           DETAILS PAGE
      ------------------------------------------- */}
      {selected && (
        <div className="details-page">
          <div className="back-row">
            <button
              className="back-btn"
              onClick={() => {
                setSelected(null);
                setHideLayout(false);
              }}
            >
              ← Back to List
            </button>
          </div>

          <div className="details-card">
            <h2 className="details-title">{selected.name}</h2>

            {/* OWNER DETAILS */}
            <div className="section">
              <h3 className="section-title">Owner Details</h3>
              <div className="info-grid">
                {Object.keys(selected)
                  .filter((k) => OWNER_ALLOW.includes(k.toLowerCase()))
                  .map((key) => (
                    <div key={key} className="info-item">
                      <label>
                        {key.replace("owner_", "").replace(/_/g, " ").toUpperCase()}
                      </label>
                      <p>{selected[key] ?? "—"}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* HOSPITAL / STORE DETAILS */}
            <div className="section">
              <h3 className="section-title">
                {selected.type === "Medician"
                  ? "Medical Store Details"
                  : selected.type === "Lab"
                  ? "Laboratory Details"
                  : selected.type === "IndividualDoctor"
                  ? "Doctor Details"
                  : "Hospital Details"}
              </h3>

              <div className="info-grid">
                {Object.keys(selected)
                  .filter(
                    (k) =>
                      !k.startsWith("owner_") &&
                      k !== "documents" &&
                      k !== "images" &&
                      (selected.type === "Medician"
                        ? STORE_ALLOW.includes(k.toLowerCase())
                        : HOSPITAL_ALLOW.includes(k.toLowerCase()))
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
              <h3 className="section-title">Location on Map</h3>
              {selected.latitude && selected.longitude ? (
                <iframe
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: "12px" }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&z=15&output=embed`}
                ></iframe>
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
                      <img src={`data:${img.type};base64,${img.data}`} alt="" />
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

            {/* ACTION BUTTONS */}
            <div className="action-row">
              <button
                className="btn reject"
                onClick={() => setShowReasonModal(true)}
              >
                Reject
              </button>

              <button
                className="btn approve"
                onClick={() => doAction("approve")}
                disabled={loadingAction}
              >
                {loadingAction ? "Processing..." : "Approve"}
              </button>
            </div>
          </div>

          {/* IMAGE MODAL */}
          {previewImage && (
            <div className="img-modal" onClick={() => setPreviewImage(null)}>
              <img src={previewImage} className="img-modal-content" />
            </div>
          )}

          {/* REASON MODAL */}
          {showReasonModal && (
            <div className="reason-modal-overlay">
              <div className="reason-modal">
                <h3>Enter Rejection Reason</h3>

                <textarea
                  className="reason-input"
                  placeholder="Enter reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />

                <div className="reason-actions">
                  <button
                    className="btn cancel"
                    onClick={() => setShowReasonModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn reject"
                    disabled={!rejectReason.trim()}
                    onClick={() => {
                      setShowReasonModal(false);
                      doAction("reject");
                    }}
                  >
                    Submit Reason
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
