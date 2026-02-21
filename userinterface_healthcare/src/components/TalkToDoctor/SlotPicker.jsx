import React, { useContext } from "react";
import { DoctorAPI } from "./doctorApi";
import "./css/slotPicker.css";
import { UserContext } from "../../context/UserContext";

export default function SlotPicker({ slots = [], doctorId }) {

  const { user } = useContext(UserContext);

  // ❌ Stop if not logged in
  if (!user || !user.id) {
    return <p>Please login to book an appointment.</p>;
  }

  const userId = user.id;

  // ✅ Helper: extract HH:mm from time
  const formatTime = (time) => {
    if (!time) return "";
    // handles "10:30", "2025-12-20T10:30:00"
    return time.length > 5 ? time.substring(11, 16) : time;
  };

  // ✅ Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    const date = slot.slotDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  // ✅ Book slot
  const book = async (slotId) => {
    try {
      await DoctorAPI.bookAppointment({
        userId,
        doctorId,
        slotId
      });

      alert("✅ Appointment booked successfully");
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
        "❌ Failed to book appointment"
      );
    }
  };

  return (
    <div className="slot-picker">

      {Object.keys(groupedSlots).length === 0 && (
        <p>No slots available</p>
      )}

      {Object.keys(groupedSlots).map((date) => (
        <div key={date} className="slot-day">
          <h4>{date}</h4>

          <div className="slots">
            {groupedSlots[date].map((slot) => (
              <button
                key={slot.slotId}
                className={`slot-btn ${slot.slotStatus}`}
                disabled={slot.slotStatus !== "AVAILABLE"}
                onClick={() => book(slot.slotId)}
              >
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </button>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}
