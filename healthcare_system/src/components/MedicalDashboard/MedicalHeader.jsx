import React, { useContext } from "react";
import "./css/MedicalHeader.css";
import { FiBell } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";

const MedicalHeader = ({ toggleSidebar }) => {
  
  const { user } = useContext(UserContext); // ⭐ GET USER HERE

  return (
    <header className="med-header">
      <div className="header-left">
        <i className="menu-toggle-icon" onClick={toggleSidebar}>☰</i>
        <h1 className="header-title">Medical Dashboard</h1>
      </div>

      <div className="header-right">
        <FiBell className="notif-icon" />

        <div className="user-info">
          <img
            src={user?.profileImage || "/default_avatar.png"}
            className="user-avatar"
            alt="Profile"
          />
          <span className="user-name">{user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;
