// src/components/Modals/OfflineAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import './Modals.css';

const OfflineAppointmentModal = ({ isOpen, onClose, selectedHospital, onSubmit }) => {
  const [formData, setFormData] = useState({
    offlinePatientName: '',
    offlinePatientPhone: '',
    offlineAppointmentDate: '',
    doctorSelect: '',
    offlineHealthIssue: ''
  });

  useEffect(() => {
    if (selectedHospital && isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      setFormData(prev => ({
        ...prev,
        offlineAppointmentDate: tomorrowStr,
        offlineHealthIssue: `Appointment at ${selectedHospital.name}`,
        doctorSelect: selectedHospital.doctors[0] || ''
      }));
    }
  }, [selectedHospital, isOpen]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointmentDetails = {
      ...formData,
      hospital: selectedHospital
    };
    onSubmit(appointmentDetails);
    onClose();
    // Reset form
    setFormData({
      offlinePatientName: '',
      offlinePatientPhone: '',
      offlineAppointmentDate: '',
      doctorSelect: '',
      offlineHealthIssue: ''
    });
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2 className="modal-title">Book Offline Appointment</h2>
        <div id="selectedHospitalInfo" style={{ backgroundColor: '#f0f7ff', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          {selectedHospital && (
            <>
              <h4>{selectedHospital.name}</h4>
              <p><i className="fas fa-map-marker-alt"></i> {selectedHospital.address}, {selectedHospital.city}</p>
              <p><i className="fas fa-phone"></i> {selectedHospital.phone}</p>
            </>
          )}
        </div>
        <form id="offlineAppointmentForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="offlinePatientName">Full Name</label>
            <input 
              type="text" 
              id="offlinePatientName" 
              className="form-control" 
              placeholder="Enter your full name" 
              required
              value={formData.offlinePatientName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="offlinePatientPhone">Phone Number</label>
            <input 
              type="tel" 
              id="offlinePatientPhone" 
              className="form-control" 
              placeholder="Enter your phone number" 
              required
              value={formData.offlinePatientPhone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="offlineAppointmentDate">Preferred Date</label>
            <input 
              type="date" 
              id="offlineAppointmentDate" 
              className="form-control" 
              required
              min={today}
              value={formData.offlineAppointmentDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="doctorSelect">Select Doctor</label>
            <select 
              id="doctorSelect" 
              className="form-control" 
              required
              value={formData.doctorSelect}
              onChange={handleInputChange}
            >
              <option value="">Select a doctor</option>
              {selectedHospital?.doctors.map((doctor, index) => (
                <option key={index} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="offlineHealthIssue">Health Issue (Brief)</label>
            <textarea 
              id="offlineHealthIssue" 
              className="form-control" 
              rows="3" 
              placeholder="Briefly describe your health issue"
              value={formData.offlineHealthIssue}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
            Book Offline Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfflineAppointmentModal;