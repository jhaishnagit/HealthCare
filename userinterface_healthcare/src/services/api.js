import axios from "axios";

/* ================= BASE CONFIG ================= */

const API_BASE_URL = "http://192.168.68.133:9090/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= STAFF ================= */

export const StaffAPI = {
  getAll: () => api.get("/staff"),
  getByDepartment: (dept) => api.get(`/staff/department/${dept}`),
  getByEmail: (email) => api.get(`/staff/email/${email}`),
};

/* ================= AUTH ================= */

export const AuthAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  verifyOtp: (email, otp) =>
    api.post("/auth/verify-otp", { email, otp }),
};

/* ================= MEDICINES ================= */

export const MedicineAPI = {  
    getGlobalMedicines: (params) => api.get("/medicines/global", { params }),

  getMedicineDetails: (id) => api.get(`/medicines/${id}/details`),

  getReviews: (id) => api.get(`/medicines/${id}/reviews`),

  getMedicineOrgDetails: (medicineId, organizationId) =>
  api.get(`/medicines/${medicineId}/organization/${organizationId}/details`),

};

/* ================= HOSPITAL / ORGANIZATION ================= */

/* ================= HOSPITAL APIs ================= */

export const OrganizationAPI = {
  // ✅ DEFAULT LOAD (PAGINATION)
  getAllHospitals: ({ page = 0, size = 10 } = {}) =>
    api.get("/hospitals/page", {
      params: { page, size },
    }),

  // ✅ NEARBY (MAP)
  getNearby: ({ latitude, longitude, radius = 5, type = "Hospital" }) =>
    api.get("/hospitals/nearby", {
      params: { latitude, longitude, radius, type },
    }),

  // ✅ DETAILS
  getDetails: (id) =>
    api.get(`/hospitals/${id}`),
};
export const CartAPI = {
  addToCart: (data) => api.post("/cart/add", data),
  getCartCount: (userId) => api.get(`/cart/count/${userId}`),
  getCartItems: (userId) => api.get(`/cart/items/${userId}`),
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`),

};

export default api;
