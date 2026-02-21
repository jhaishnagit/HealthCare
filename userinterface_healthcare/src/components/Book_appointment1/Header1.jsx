// src/components/Header1.jsx
import React, { useState, useEffect } from 'react';
import './css/Header1.css';

const Header1 = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time
      let hours = now.getHours();
      let minutes = now.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      const timeString = hours + ':' + minutes;
      
      // Format date (DD-MM-YYYY)
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const dateString = `${day}-${month}-${year}`;
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="appointment-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-stethoscope"></i>
              <span>MediCare India</span>
            </div>
            <div className="top-info">
              <div className="temp-date">
                <i className="fas fa-thermometer-half"></i> 28°C | 
                <i className="far fa-clock"></i> <span id="currentTime">{currentTime}</span> | 
                <i className="far fa-calendar"></i> <span id="currentDate">{currentDate}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="appointment-nav">
        <div className="container">
          <ul className="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="medicines.html">Medicines</a></li>
            <li><a href="pharmacy.html">Pharmacy Near Me</a></li>
            <li><a href="prescription.html">Upload Prescription</a></li>
            <li><a href="doctor-appointment.html" className="active">Doctor Appointment</a></li>
            <li><a href="insurance.html">Health Insurance</a></li>
            <li><a href="lab-tests.html">Lab Tests</a></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header1;