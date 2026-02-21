// src/services/doctor.api.js
import api from "../../services/api";

export const DoctorAPI = {
  searchDoctors: ({ search = "", page = 0, size = 10 }) =>
    api.get("/doctors/talk-available/search", {
      params: { search, page, size },
    }),

  getDoctorDetails: (id) =>
    api.get(`/doctors/${id}/details`),

  getAvailableSlots: (doctorId) =>
    api.get(`/doctors/${doctorId}/available-slots`),

  bookAppointment: ({ userId, doctorId, slotId }) =>
    api.post("/doctors/appointments/book", null, {
      params: { userId, doctorId, slotId },
    }),

  cancelAppointment: ({ appointmentId, userId }) =>
    api.delete(`/doctors/appointments/${appointmentId}/cancel`, {
      params: { userId },
    }),
};
