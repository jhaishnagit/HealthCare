// src/components/Modals/OnlineAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import './Modals.css';

const OnlineAppointmentModal = ({ isOpen, onClose, selectedHospital, onSubmit }) => {
  const [appointmentType, setAppointmentType] = useState('video');
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    healthIssue: ''
  });

  useEffect(() => {
    if (selectedHospital && isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      setFormData(prev => ({
        ...prev,
        appointmentDate: tomorrowStr,
        healthIssue: `Appointment at ${selectedHospital.name}`
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
      appointmentType: appointmentType === 'video' ? 'Video Consultation' : 'Chat Consultation',
      hospital: selectedHospital
    };
    onSubmit(appointmentDetails);
    onClose();
    // Reset form
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      appointmentDate: '',
      appointmentTime: '',
      healthIssue: ''
    });
    setAppointmentType('video');
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2 className="modal-title">Book Online Appointment</h2>
        <div className="appointment-type">
          <div 
            className={`type-option ${appointmentType === 'video' ? 'active' : ''}`}
            onClick={() => setAppointmentType('video')}
            id="typeVideo"
          >
            <i className="fas fa-video"></i>
            <h4>Video Consultation</h4>
            <p>Consult doctor via video call</p>
          </div>
          <div 
            className={`type-option ${appointmentType === 'chat' ? 'active' : ''}`}
            onClick={() => setAppointmentType('chat')}
            id="typeChat"
          >
            <i className="fas fa-comments"></i>
            <h4>Chat Consultation</h4>
            <p>Consult doctor via chat</p>
          </div>
        </div>
        <form id="onlineAppointmentForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patientName">Full Name</label>
            <input 
              type="text" 
              id="patientName" 
              className="form-control" 
              placeholder="Enter your full name" 
              required
              value={formData.patientName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="patientPhone">Phone Number</label>
            <input 
              type="tel" 
              id="patientPhone" 
              className="form-control" 
              placeholder="Enter your phone number" 
              required
              value={formData.patientPhone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="patientEmail">Email Address</label>
            <input 
              type="email" 
              id="patientEmail" 
              className="form-control" 
              placeholder="Enter your email address" 
              required
              value={formData.patientEmail}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="appointmentDate">Preferred Date</label>
            <input 
              type="date" 
              id="appointmentDate" 
              className="form-control" 
              required
              min={today}
              value={formData.appointmentDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="appointmentTime">Preferred Time</label>
            <select 
              id="appointmentTime" 
              className="form-control" 
              required
              value={formData.appointmentTime}
              onChange={handleInputChange}
            >
              <option value="">Select time slot</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="healthIssue">Health Issue (Brief)</label>
            <textarea 
              id="healthIssue" 
              className="form-control" 
              rows="3" 
              placeholder="Briefly describe your health issue"
              value={formData.healthIssue}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
            Book Online Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnlineAppointmentModal;