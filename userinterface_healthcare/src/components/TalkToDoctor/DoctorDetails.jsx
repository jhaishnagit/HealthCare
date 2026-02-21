import { useEffect, useState } from "react";
import { DoctorAPI } from "./doctorApi";
import SlotPicker from "./SlotPicker";
import "./css/doctorDetails.css";

export default function DoctorDetails({ doctorId, onBack }) {
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    DoctorAPI.getDoctorDetails(doctorId)
      .then(res => setDoctor(res.data.data));

    DoctorAPI.getAvailableSlots(doctorId)
      .then(res => setSlots(res.data));
  }, [doctorId]);

  if (!doctor) return <p>Loading doctor...</p>;

  return (
  <div className="doctor-details-page">

    <div className="doctor-top-bar">
      <button className="back-btn" onClick={onBack}>← Back</button>
    </div>

    <div className="doctor-profile-card">
      <h2>{doctor.doctorName}</h2>
      <p className="spec">{doctor.specialization}</p>
      <p className="exp">{doctor.experience} yrs experience</p>
      <p className="fee">₹ {doctor.consultationFees || "—"}</p>
    </div>

    <SlotPicker doctorId={doctorId} slots={slots} />
  </div>
);
}
