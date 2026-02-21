    export default function AppointmentSuccessModal({ onClose }) {
  return (
    <div className="modal">
      <h3>Appointment Booked 🎉</h3>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
