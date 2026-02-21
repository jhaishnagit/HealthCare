import React from "react";
import "../style/footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-inner">

        {/* BRAND */}
        <div className="footer-col brand">
          <h2 className="footer-logo-text">JhaiHealthcare</h2>

          <p className="tagline">
            Your Trusted Buddy For Better Health
          </p>

          <p className="desc">
            Providing comprehensive healthcare solutions with cutting-edge
            technology and compassionate care since 2020.
          </p>
        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h3>Services</h3>
          <ul>
            <li>Talk to Doctor</li>
            <li>Order Medicine</li>
            <li>Book Appointment</li>
            <li>Lab Tests</li>
            <li>Surgery Support</li>
            <li>JhaiHealthcare GOLD</li>
          </ul>
        </div>

        {/* MEDICAL */}
        <div className="footer-col">
          <h3>Medical Specialties</h3>
          <ul>
            <li>Cardiology</li>
            <li>Dermatology</li>
            <li>Orthopedics</li>
            <li>Pediatrics</li>
            <li>Gynecology</li>
            <li>Neurology</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Emergency Care</li>
            <li>Insurance Partners</li>
            <li>Feedback</li>
            <li>Careers</li>
          </ul>
        </div>

        {/* CONNECT */}
        <div className="footer-col">
          <h3>Connect With Us</h3>

          <div className="socials">
            <span>F</span>
            <span>T</span>
            <span>I</span>
            <span>L</span>
          </div>

          <p><strong>24/7 Emergency:</strong> +91-911-JHAI-HELP</p>
          <p><strong>Email:</strong> support@jhaihealthcare.com</p>
          <p><strong>Location:</strong> Gannavaram, Andhra Pradesh</p>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2024 JhaiHealthcare. All rights reserved.</p>
        <div className="certs">
          <span>ISO 27001 Certified</span>
          <span>HIPAA Compliant</span>
        </div>
      </div>

    </footer>
  );
}
