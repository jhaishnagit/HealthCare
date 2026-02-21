// src/components/Modals/AlertModal.jsx
import React from 'react';
import './Modals.css';

const AlertModal = ({ isOpen, title, message, type, onClose }) => {
  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return { icon: "fas fa-check-circle", color: "#2ecc71" };
      case "error":
        return { icon: "fas fa-exclamation-circle", color: "#e74c3c" };
      default:
        return { icon: "fas fa-info-circle", color: "#3498db" };
    }
  };

  if (!isOpen) return null;

  const { icon, color } = getIconAndColor();

  return (
    <div className="alert-modal" style={{ display: 'flex' }}>
      <div className="alert-content">
        <div className="alert-icon">
          <i className={icon} style={{ color }}></i>
        </div>
        <h3 className="alert-title">{title}</h3>
        <p className="alert-message">{message}</p>
        <button className="alert-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default AlertModal;