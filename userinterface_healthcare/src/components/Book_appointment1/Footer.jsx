// src/components/Footer.jsx
import React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MediCare India</h3>
            <p>Your trusted healthcare partner for medicines, doctor appointments, lab tests and health insurance across India.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="medicines.html">Medicines</a></li>
              <li><a href="doctor-appointment.html">Doctor Appointment</a></li>
              <li><a href="lab-tests.html">Lab Tests</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Health Conditions</h3>
            <ul className="footer-links">
              <li><a href="#">Diabetes Care</a></li>
              <li><a href="#">Cardiac Care</a></li>
              <li><a href="#">Stomach Care</a></li>
              <li><a href="#">Pain Relief</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="footer-links">
              <li><i className="fas fa-phone"></i> 1800-123-4567</li>
              <li><i className="fas fa-envelope"></i> support@medicareindia.com</li>
              <li><i className="fas fa-map-marker-alt"></i> Delhi, Mumbai, Bangalore, Chennai, Kolkata</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 MediCare India. All rights reserved. Serving across India.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;