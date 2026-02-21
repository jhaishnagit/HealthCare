// src/components/MedicalDashboard/jsx_files/MedicinePage.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  FaBell,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaUpload,
  FaDownload,
} from "react-icons/fa";
import "../css/MedicinePage.css";
import { v4 as uuidv4 } from "uuid";
import { MedicineAPIS, SupplierAPI } from "../../../services/api";
import { UserContext } from "../../../context/UserContext";

const MedicinePage = () => {
  const { user } = useContext(UserContext);
  const organizationId = user?.organizationId || user?.organization_id;
  const personId = user?.id || user?.personId;

  /* COMMON */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  /* VIEW MODE */
  const [viewMode, setViewMode] = useState("medicines"); // "medicines" | "suppliers"

  /* MEDICINES & SUPPLIERS */
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  /* FILTERS */
  const [searchMed, setSearchMed] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [searchSup, setSearchSup] = useState("");

  /* MODALS & SELECTED */
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);

  /* UPLOAD EXCEL */
  const [uploadModal, setUploadModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [supplierSelection, setSupplierSelection] = useState(""); // keep as string to avoid NaN warnings
  const [isUploading, setIsUploading] = useState(false);

  /* FORM STATES for edit if needed */
  const [medForm, setMedForm] = useState({
    quantityAvailable: "",
    pricePerUnit: "",
  });
  const [supForm, setSupForm] = useState({
    supplierName: "",
    companyName: "",
    email: "",
    contact: "",
    status: "Active",
    supplyDate: "",
  });

  /* EFFECTS: initial data */
  useEffect(() => {
    if (!organizationId) {
      setError("No organization access. Please login again.");
      setLoading(false);
      return;
    }
    fetchMedicines();
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const { data } = await MedicineAPIS.getAll(organizationId);
      setMedicines(data || []);
    } catch (e) {
      console.error("Fetch medicines failed:", e);
      notify("Failed to load medicines.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data } = await SupplierAPI.getAll();
      // normalize supplier id into `id` and string format for selects
      const normalized = (data || []).map((s) => {
        const idVal = s.id ?? s.supplierId ?? s.supplier_id ?? null;
        return {
          id: idVal,
          supplierName: s.supplierName ?? s.name ?? "",
          companyName: s.companyName ?? s.company ?? "",
          email: s.email ?? "",
          contact: s.contact ?? "",
          status: s.status ?? "Active",
          supplyDate: s.supplyDate ?? s.createdAt ?? "",
          raw: s,
        };
      });
      setSuppliers(normalized);
    } catch (e) {
      console.error("Fetch suppliers failed:", e);
      notify("Failed to load suppliers.");
    }
  };

  /* NOTIFICATIONS */
  const notify = (msg) => {
    const id = uuidv4();
    setNotifications((p) => [...p, { id, text: msg, time: new Date().toLocaleTimeString(), read: false }]);
  };
  const markRead = (id) => setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  /* ALERTS */
  useEffect(() => {
    if (viewMode === "medicines" && medicines.length > 0) checkAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines]);

  const checkAlerts = () => {
    const next = new Date();
    next.setMonth(next.getMonth() + 2);

    const exp = medicines.filter((m) => m.expiryDate && new Date(m.expiryDate) <= next && m.quantityAvailable > 0);
    const low = medicines.filter((m) => m.quantityAvailable > 0 && m.quantityAvailable <= (m.reorderLevel ?? 0));
    const out = medicines.filter((m) => m.quantityAvailable === 0);

    if (exp.length) notify(`${exp.length} medicine(s) expiring soon!`);
    if (low.length) notify(`${low.length} medicine(s) low stock!`);
    if (out.length) notify(`${out.length} medicine(s) out of stock!`);
  };

  /* CRUD: edit and delete kept intact */
  const editMedicine = async () => {
    try {
      const payload = {
        quantityAvailable: medForm.quantityAvailable,
        pricePerUnit: medForm.pricePerUnit,
      };
      await MedicineAPIS.update(selected.id, payload, organizationId);
      await fetchMedicines();
      setEditModal(false);
      notify("Medicine updated!");
    } catch (err) {
      console.error("Edit medicine error:", err);
      notify("Update failed.");
    }
  };

  const deleteMedicine = async () => {
    try {
      await MedicineAPIS.delete(deleteModal, organizationId);
      setMedicines((p) => p.filter((m) => m.id !== deleteModal));
      setDeleteModal(false);
      notify("Medicine deleted!");
    } catch (err) {
      console.error("Delete medicine error:", err);
      notify("Delete failed.");
    }
  };

  const editSupplier = async () => {
    try {
      await SupplierAPI.update(selected.id || selected.supplierId, supForm);
      await fetchSuppliers();
      setEditModal(false);
      notify("Supplier updated!");
    } catch (err) {
      console.error("Edit supplier error:", err);
      notify("Update failed.");
    }
  };

  const deleteSupplier = async () => {
    try {
      await SupplierAPI.delete(deleteModal);
      setSuppliers((p) => p.filter((s) => (s.id ?? s.supplierId) !== deleteModal));
      setDeleteModal(false);
      notify("Supplier deleted!");
    } catch (err) {
      console.error("Delete supplier error:", err);
      notify("Delete failed.");
    }
  };

  /* FILTERS & HELPERS */
  const filteredMeds = () => {
    let list = (medicines || []).slice();
    if (filterType === "OutOfStock") list = list.filter((m) => m.quantityAvailable === 0);
    else if (filterType === "ExpiringSoon") {
      const nxt = new Date(); nxt.setMonth(nxt.getMonth() + 2);
      list = list.filter((m) => m.expiryDate && new Date(m.expiryDate) <= nxt && m.quantityAvailable > 0);
    } else if (filterType === "LowStock") {
      list = list.filter((m) => m.quantityAvailable > 0 && m.quantityAvailable <= (m.reorderLevel ?? 0));
    }
    if (searchMed) list = list.filter((m) => (m.medicineName || "").toLowerCase().includes(searchMed.toLowerCase()));
    return list;
  };

  const filteredSups = () => {
    if (!searchSup) return suppliers;
    return suppliers.filter((s) => (s.supplierName || "").toLowerCase().includes(searchSup.toLowerCase()));
  };

  const totalMeds = medicines.length;
  const outMeds = medicines.filter((m) => m.quantityAvailable === 0).length;
  const expMeds = medicines.filter((m) => m.expiryDate && new Date(m.expiryDate) <= (() => { const d = new Date(); d.setMonth(d.getMonth() + 2); return d; })() && m.quantityAvailable > 0).length;
  const lowMeds = medicines.filter((m) => m.quantityAvailable > 0 && m.quantityAvailable <= (m.reorderLevel ?? 0)).length;
  const totalSups = suppliers.length;

  /* UPLOAD EXCEL HANDLERS */
  const openUploadModal = () => {
    setExcelFile(null);
    setSupplierSelection("");
    setUploadModal(true);
  };

  const handleFile = (e) => {
    setExcelFile(e.target.files?.[0] ?? null);
  };

  const uploadExcel = async () => {
    if (!excelFile) {
      notify("Please select an Excel file.");
      return;
    }
    if (!supplierSelection) {
      notify("Please select a supplier.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", excelFile);
      // backend expects personId, organizationId, supplierId — send as strings
      formData.append("personId", String(personId ?? ""));
      formData.append("organizationId", String(organizationId ?? ""));
      formData.append("supplierId", String(supplierSelection));

      // debug print (console)
      console.log("FORM DATA:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const resp = await MedicineAPIS.uploadExcel(formData);
      console.log("Upload success response:", resp?.data);

      // Success: single success message as you asked
      notify("Excel uploaded successfully!");
      await fetchMedicines(); // refresh after upload
      setUploadModal(false);
      setExcelFile(null);
      setSupplierSelection("");
    } catch (err) {
      console.error("Upload failed:", err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Server error";
      notify("Upload failed: " + serverMsg);
    } finally {
      setIsUploading(false);
    }
  };

  /* DOWNLOAD TEMPLATE (CSV) */
  const downloadTemplate = () => {
    // headers you specified:
    const headers = [
      "Medicine Name",
      "Category",
      "Manufacturer",
      "Batch No",
      "Price Per Unit",
      "Purchase Cost",
      "Quantity",
      "Reorder Level",
      "Expiry Date (YYYY-MM-DD)",
      "Description",
      "Rack Location",
    ];
    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medicine_template.csv"; // Excel can open CSV
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* OPEN VIEW / EDIT */
  const openView = (item) => {
    setSelected(item);
    setViewModal(true);
  };

  const openEdit = (item) => {
    setSelected(item);
    // prefill medForm for edit if available
    setMedForm({
      quantityAvailable: item.quantityAvailable ?? "",
      pricePerUnit: item.pricePerUnit ?? "",
    });
    // prefill supplier form if editing supplier
    setSupForm({
      supplierName: item.supplierName ?? supForm.supplierName,
      companyName: item.companyName ?? supForm.companyName,
      email: item.email ?? supForm.email,
      contact: item.contact ?? supForm.contact,
      status: item.status ?? supForm.status,
      supplyDate: item.supplyDate ?? supForm.supplyDate,
    });
    setEditModal(true);
  };

  /* Render guards */
  if (loading) return (
    <div className="medicine-page"><div className="page-content"><div className="loading">Loading…</div></div></div>
  );

  if (!organizationId) return (
    <div className="medicine-page"><div className="page-content"><div className="error">No Organization Access</div></div></div>
  );

  /* MAIN RENDER */
  return (
    <div className="medicine-page">
      <div className="page-content active">
        {/* HEADER */}
        <div className="medicine-header">
          <h2>{viewMode === "medicines" ? "Medicine Management" : "Supplier Management"}</h2>

          <div className="header-right">
            <div className="notification-bell" onClick={() => setShowDropdown(!showDropdown)}>
              <FaBell />
              {notifications.some((n) => !n.read) && <span className="badge">{notifications.filter((n) => !n.read).length}</span>}
              {showDropdown && (
                <div className="notification-dropdown">
                  {notifications.length ? notifications.slice().reverse().map((n) => (
                    <div key={n.id} className={`notification-item ${n.read ? "read" : "unread"}`} onClick={() => markRead(n.id)}>
                      <p className={!n.read ? "unread-text" : ""}>{n.text}</p>
                      <span className="time">{n.time}</span>
                    </div>
                  )) : <p className="no-notify">No notifications</p>}
                </div>
              )}
            </div>

            {/* Search + Upload + Download */}
            <div className="medicine-controls">
              <input
                type="text"
                placeholder={`Search ${viewMode === "medicines" ? "medicine" : "supplier"}…`}
                value={viewMode === "medicines" ? searchMed : searchSup}
                onChange={(e) => viewMode === "medicines" ? setSearchMed(e.target.value) : setSearchSup(e.target.value)}
              />

              {/* Upload Excel button */}
              <button className="upload-btnn" onClick={openUploadModal} title="Upload Excel">
                <FaUpload />
              </button>

              {/* Download Template */}
              <button className="download-btnn" onClick={downloadTemplate} title="Download Template">
                <FaDownload />
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="summary-cards1">
          {viewMode === "medicines" ? (
            <>
              <div className={`card blue ${filterType === "All" ? "active-card" : ""}`} onClick={() => setFilterType("All")}>
                <h4>Total Medicines</h4><p>{totalMeds}</p>
              </div>
              <div className={`card red ${filterType === "OutOfStock" ? "active-card" : ""}`} onClick={() => setFilterType("OutOfStock")}>
                <h4>Out of Stock</h4><p>{outMeds}</p>
              </div>
              <div className={`card orange ${filterType === "ExpiringSoon" ? "active-card" : ""}`} onClick={() => setFilterType("ExpiringSoon")}>
                <h4>Expiring Soon</h4><p>{expMeds}</p>
              </div>
              <div className={`card green ${filterType === "LowStock" ? "active-card" : ""}`} onClick={() => setFilterType("LowStock")}>
                <h4>Low Stock</h4><p>{lowMeds}</p>
              </div>
              <div className="card teal" style={{ cursor: "pointer" }} onClick={() => setViewMode("suppliers")}>
                <h4>Suppliers</h4><p>{totalSups}</p>
              </div>
            </>
          ) : (
            <>
              <div className="card purple" style={{ cursor: "pointer" }} onClick={() => setViewMode("medicines")}>
                <h4>Back to Medicines</h4><p>{totalMeds}</p>
              </div>
              <div className="card teal"><h4>Total Suppliers</h4><p>{totalSups}</p></div>
            </>
          )}
        </div>

        {/* TABLE */}
        <div className="medicine-table">
          <table>
            <thead>
              <tr>
                {viewMode === "medicines" ? (
                  <>
                    <th>Name</th><th>Category</th><th>Stock</th><th>Price</th><th>Expiry</th><th>Actions</th>
                  </>
                ) : (
                  <>
                    <th>Name</th><th>Company</th><th>Email</th><th>Contact</th><th>Status</th><th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {viewMode === "medicines" ? (
                filteredMeds().length ? filteredMeds().map((m) => (
                  <tr key={m.id ?? m._id ?? JSON.stringify(m)}>
                    <td>{m.medicineName}</td>
                    <td>{m.category}</td>
                    <td className={m.quantityAvailable === 0 ? "stock out" : m.quantityAvailable <= (m.reorderLevel ?? 0) ? "stock low" : "stock ok"}>
                      {m.quantityAvailable}
                    </td>
                    <td>₹{m.pricePerUnit}</td>
                    <td>{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : "-"}</td>
                    <td className="action-buttons">
                      <button className="view" onClick={() => openView(m)}><FaEye /></button>
                      <button className="edit" onClick={() => openEdit(m)}><FaEdit /></button>
                      <button className="delete" onClick={() => setDeleteModal(m.id)}><FaTrashAlt /></button>
                    </td>
                  </tr>
                )) : (<tr><td colSpan="6" className="no-data">No medicines found.</td></tr>)
              ) : (
                filteredSups().length ? filteredSups().map((s) => (
                  <tr key={String(s.id)}>
                    <td>{s.supplierName}</td><td>{s.companyName}</td><td>{s.email}</td><td>{s.contact}</td>
                    <td><span className={`status-badge ${s.status === "Active" ? "available" : "out"}`}>{s.status}</span></td>
                    <td className="action-buttons">
                      <button className="view" onClick={() => openView(s)}><FaEye /></button>
                      <button className="edit" onClick={() => openEdit(s)}><FaEdit /></button>
                      <button className="delete" onClick={() => setDeleteModal(s.id)}><FaTrashAlt /></button>
                    </td>
                  </tr>
                )) : (<tr><td colSpan="6" className="no-data">No suppliers found.</td></tr>)
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW MODAL */}
        {viewModal && selected && (
          <div className="modal-overlay" onClick={() => setViewModal(false)}>
            <div className="modal-content view-popup" onClick={(e) => e.stopPropagation()}>
              <h3>{viewMode === "medicines" ? "Medicine Details" : "Supplier Details"}</h3>
              {viewMode === "medicines" ? (
                <>
                  <p><b>ID:</b> {selected.id}</p>
                  <p><b>Name:</b> {selected.medicineName}</p>
                  <p><b>Category:</b> {selected.category}</p>
                  <p><b>Manufacturer:</b> {selected.manufacturer}</p>
                  <p><b>Batch:</b> {selected.batchNo}</p>
                  <p><b>Stock:</b> {selected.quantityAvailable}</p>
                  <p><b>Price:</b> ₹{selected.pricePerUnit}</p>
                  <p><b>Expiry:</b> {selected.expiryDate ? new Date(selected.expiryDate).toLocaleDateString() : "-"}</p>
                  <p><b>Rack:</b> {selected.locationOfRack}</p>
                  <p><b>Supplier:</b> {selected.supplier?.supplierName || "N/A"}</p>
                </>
              ) : (
                <>
                  <p><b>ID:</b> {selected.id}</p>
                  <p><b>Name:</b> {selected.supplierName}</p>
                  <p><b>Company:</b> {selected.companyName}</p>
                  <p><b>Email:</b> {selected.email}</p>
                  <p><b>Contact:</b> {selected.contact}</p>
                  <p><b>Status:</b> {selected.status}</p>
                  <p><b>Supply Date:</b> {selected.supplyDate?.split?.("T")?.[0] ?? "-"}</p>
                </>
              )}
              <button onClick={() => setViewModal(false)}>Close</button>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editModal && selected && (
          <div className="modal-overlay" onClick={() => setEditModal(false)}>
            <div className="modal-content edit-popup" onClick={(e) => e.stopPropagation()}>
              <h3>Edit {viewMode === "medicines" ? selected.medicineName : selected.supplierName}</h3>
              {viewMode === "medicines" ? (
                <>
                  <label>Stock:</label>
                  <input type="number" value={medForm.quantityAvailable} onChange={(e) => setMedForm({ ...medForm, quantityAvailable: e.target.value })} />
                  <label>Price:</label>
                  <input type="number" value={medForm.pricePerUnit} onChange={(e) => setMedForm({ ...medForm, pricePerUnit: e.target.value })} />
                </>
              ) : (
                <>
                  <input placeholder="Supplier Name" value={supForm.supplierName} onChange={(e) => setSupForm({ ...supForm, supplierName: e.target.value })} />
                  <input placeholder="Company Name" value={supForm.companyName} onChange={(e) => setSupForm({ ...supForm, companyName: e.target.value })} />
                  <input placeholder="Email" value={supForm.email} onChange={(e) => setSupForm({ ...supForm, email: e.target.value })} />
                  <input placeholder="Contact" value={supForm.contact} onChange={(e) => setSupForm({ ...supForm, contact: e.target.value })} />
                  <select value={supForm.status} onChange={(e) => setSupForm({ ...supForm, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              )}
              <div className="popup-buttons">
                <button onClick={viewMode === "medicines" ? editMedicine : editSupplier}>Save</button>
                <button onClick={() => setEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM */}
        {deleteModal && (
          <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this {viewMode === "medicines" ? "medicine" : "supplier"}?</p>
              <div className="popup-buttons">
                <button onClick={() => { viewMode === "medicines" ? deleteMedicine() : deleteSupplier(); }}>Yes</button>
                <button onClick={() => setDeleteModal(false)}>No</button>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD EXCEL MODAL */}
        {uploadModal && (
          <div className="modal-overlay" onClick={() => { if (!isUploading) setUploadModal(false); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Upload Medicines (Excel)</h3>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 600 }}>Excel File (.xlsx / .xls)</label>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
                {excelFile && <small>Selected: {excelFile.name}</small>}

                <p style={{ fontSize: 12, color: "#666" }}>
                  Upload an Excel/CSV. The backend will apply selected supplier, personId and organizationId to all rows.
                </p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 600 }}>Supplier (required)</label>
                <select value={supplierSelection} onChange={(e) => setSupplierSelection(e.target.value)}>
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={String(s.id)} value={String(s.id)}>{s.supplierName}</option>
                  ))}
                </select>
              </div>

              <div className="popup-buttons">
                <button onClick={uploadExcel} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
                <button onClick={() => { if (!isUploading) { setUploadModal(false); setExcelFile(null); setSupplierSelection(""); } }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MedicinePage;
