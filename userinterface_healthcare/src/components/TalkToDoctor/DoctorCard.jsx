import "./css/doctorCard.css";

export default function DoctorCard({ doctor, onSelect }) {
  return (
    <div className="doctor-card" onClick={() => onSelect(doctor.doctorId)}>
      <h3>{doctor.doctorName}</h3>
      <p>{doctor.specialization}</p>
      <p>{doctor.experience} yrs experience</p>
    </div>
  );
}
