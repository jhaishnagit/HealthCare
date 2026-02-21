import axios from "axios";

const API_BASE_URL = "http://localhost:9090/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// Doctor APIs
// ----------------------
export const DoctorAPI = {
  getAll: () => api.get("/doctors"),
  getCount: () => api.get("/doctors/count"),
  patchById: (id, data) => api.patch(`/doctors/${id}`, data),
  getById: (id) => api.get(`/doctors/${id}`),
};

// ----------------------
// Patient APIs
// ----------------------
export const PatientAPI = {
  getAll: () => api.get("/patient"), 
  getCount: () => api.get("/patient/count"),
  getFiltered: (params) => api.get("/patient/filter/native", { params }),
  add: (data) => api.post("/patient/add", data),
  getById: (id) => api.get(`/patient/${id}`),
  getFullDetails: (id) => api.get(`/patient/full-details/${id}`),
  updatePartial: (id, data) => api.patch(`/patient/${id}`, data),
  delete: (id) => api.delete(`/patient/${id}`),
   getTodayAll: () => api.get("/patient/today/all"),
};



// ----------------------
// Ward APIs
// ----------------------
export const WardAPI = {
  getAll: () => api.get("/wards/all"),
  add: (wardData) => api.post("/wards/add", wardData),
  getTotalBeds: (wardId) => api.get(`/wards/${wardId}/total-beds`),
  getBookedBeds: (wardId) => api.get(`/wards/${wardId}/booked-beds`),
  getAvailableBeds: (wardId) => api.get(`/wards/${wardId}/available-beds`),
  getAllBeds: (wardId) => api.get(`/wards/${wardId}/bedss`),
  getAvailableBedsList: (wardId) => api.get(`/wards/${wardId}/available-bedss`),
  getBookedBedsList: (wardId) => api.get(`/wards/${wardId}/booked-bedss`),
  deleteWard: (wardId) => api.delete(`/wards/delete/${wardId}`),
  
};

export const LabAPI = {
  // Categories
  getAllCategories: () => api.get("/labs/categories"),
  addCategory: (data) => api.post("/labs/categories", data),
  updateCategory: (id, data) => api.put(`/labs/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/labs/categories/${id}`),

  // Tests
  getAllTests: () => api.get("/labs/tests"),
  addTest: (data) => api.post("/labs/tests", data),
  updateTest: (id, data) => api.patch(`/labs/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/labs/tests/${id}`),

  getUrgent: () => api.get("/labs/status/urgent"),
  getPending: () => api.get("/labs/status/pending"),
  getCompleted: () => api.get("/labs/status/completed"),
  getAll: () => api.get("/labs/status/all"),
  getFullHistory: (patientId) => api.get(`/labs/history/${patientId}`),


  // Reports
  uploadReport: (patientId, testId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/labs/reports/upload/${patientId}/${testId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getPatientReports: (patientId) => api.get(`/labs/reports/patient/${patientId}`),
};
// ----------------------
// Bed Booking APIs
// ----------------------
export const BedBookingAPI = {
  bookBed: (bookingData) => api.post("/bed-booking/book", bookingData),
  updateBedByWardAndBed: (data) => api.put("/bed-booking/update-by-bed", data),
  deleteBed: (data) => api.post("/bed-booking/delete-bed", data),
  addBed: (data) => api.post("/bed-booking/add-bed", data),
};

// ---------------------- Medicine APIs ----------------------
export const MedicineAPI = {
  getAll: () => api.get("/medicines"),
  getOutOfStock: () => api.get("/medicines/out-of-stock"),
  getExpired: () => api.get("/medicines/expired"),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post("/medicines", data),
  update: (id, data) => api.patch(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};



/* ---------------------------------------------------
   MEDICINE API (with organizationId)
---------------------------------------------------- */
export const MedicineAPIS = {
  getAll: (orgId) => api.get(`/medicines/organization/${orgId}`),

  getOutOfStock: (orgId) =>
    api.get(`/medicines/out-of-stock/${orgId}`),

  getExpired: (orgId) =>
    api.get(`/medicines/expired/${orgId}`),

  getById: (id, orgId) =>
    api.get(`/medicines/${id}/organization/${orgId}`),

  create: (data) => api.post(`/medicines`, data),

  update: (id, data, orgId) =>
    api.patch(`/medicines/${id}/organization/${orgId}`, data),

  delete: (id, orgId) =>
    api.delete(`/medicines/${id}/organization/${orgId}`),

  uploadExcel: (file, personId, organizationId) => {
    const form = new FormData();
    form.append("file", file);
    form.append("personId", personId);
    form.append("organizationId", organizationId);

    return api.post("/medicines/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
// src/services/api.js  (or wherever your api file lives)

export const SupplierAPI = {
  getAll: () => api.get("/suppliers"),
  create: (data) => api.post("/suppliers", data),
  update: (id, data) => api.patch(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};
export const StaffAPI = {
  getAll: () => api.get("/staff"),
  getByDepartment: (dept) => api.get(`/staff/department/${dept}`),
  getByEmail: (email) => api.get(`/staff/email/${email}`),
  add: (data) => api.post("/staff", data),
  delete: (id) => api.delete(`/staff/${id}`),
  update: (id, data) => api.put(`/staff/${id}`, data),
  uploadImage: (id, formData) => api.post(`/staff/${id}/upload-image`, formData),
  deleteImage: (id) => api.delete(`/staff/${id}/delete-image`),
  sendAccountMail: (email) =>
    api.post("/staff/send-account-created-mail", { email }),
};
export const LoginAPI = {
  login: (email, password) => api.post("/staff/login", { email, password }),
  verifyOtp: (email, otp) => api.post("/staff/verify-otp", { email, otp }),
  sendOtp: (email) => api.post("/staff/send-otp", { email }),
};
export const AuthAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  // ---------------------- Password Update API ----------------------

  updatePassword: (email, password) =>
    api.put("/staff/password/update", { email, password }),


};
export const HospitalAPI = {
  // ✔ 1) GET ALL HOSPITALS
  getAll: () => api.get("/hospitals"),

  // ✔ 2) GET PENDING HOSPITALS (your GET api)
getPending: () =>
  api.get("/hospitals/filter/light", {
    params: { type: "Hospital", level: 0 },
  }),

getPendingStores: () =>
  api.get("/hospitals/filter/light", {
    params: { type: "Medician", level: 0 },
  }),
  
  // ⭐ Approved Hospitals
getApprovedHospitals: () =>
  api.get("/hospitals/filter/light", {
    params: { type: "Hospital", level: 1 },
  }),

// ⭐ Rejected Hospitals
getRejectedHospitals: () =>
  api.get("/hospitals/filter/light", {
    params: { type: "Hospital", level: 2 },
  }),

// ⭐ Approved Medical Stores
getApprovedStores: () =>
  api.get("/hospitals/filter/light", {
    params: { type: "Medician", level: 1 },
  }),

// ⭐ Rejected Medical Stores
getRejectedStores: () =>
  api.get("/hospitals/filter/light", {
    params: { type: "Medician", level: 2 },
  }),




  // ✔ 3) UPDATE VERIFICATION (your PATCH api)
  updateVerification: (id, data) =>
    api.patch(`/hospitals/${id}/update`, data),


   // ✔ Get full hospital details by ID (View Details)
  getById: (id) => api.get(`/hospitals/${id}`),

  sendApprovalMail(data) {
  return api.post("/staff/send-approval-mail", data);
},

sendRejectionMail(data) {
  return api.post("/staff/send-rejection-mail", data);
},

  // ✔ 4) Update bank details
  updateBankDetails: (id, data) => api.patch(`/hospitals/${id}`, data),

  // ✔ 5) Upload passbook
  uploadPassbook: (id, file) => {
    const fd = new FormData();
    fd.append("passbook_image", file);
    return api.put(`/hospitals/${id}/update-passbook`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ✔ 6) Upload documents
  uploadDocuments: (id, files) => {
    const fd = new FormData();
    files.forEach((file) => file && fd.append("documents", file));
    return api.put(`/hospitals/${id}/update-documents`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
