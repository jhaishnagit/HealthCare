import React, { useState, useEffect } from "react";
import { Bell, Menu, Search, Sun, Moon } from "lucide-react";
import "../SuperAdminDashboard/css/super-admin-header.css"

export default function SuperAdminHeader({ onToggleSidebar, unreadCount, onOpenNotifications, dark, setDark, onSearch }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch && onSearch(q), 250);
    return () => clearTimeout(t);
  }, [q, onSearch]);

  return (
    
    <header className={`super-header ${dark ? "dark" : ""}`}>

  
{/* LEFT: LOGO + MENU */}
  <div className="header-left">
   

    <button onClick={onToggleSidebar} className="icon-btn menu">
      <Menu size={18} />
    </button>

     <div className="top-logo">Medi<span className="accent">Admin</span></div>
  </div>
  {/* CENTER: SEARCH */}
  {/* <div className="header-center">
    <div className="top-search">
      <Search size={16} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search hospitals, stores, ids..."
      />
    </div>
  </div> */}

  {/* RIGHT: ACTIONS */}
  <div className="header-right">
    <div className="header-actions">

      <button className="icon-btn" onClick={() => setDark(!dark)}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="notification-box" onClick={onOpenNotifications}>
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </div>

      <div className="profile-box">
        <div className="profile-name">
          <div className="name">Super Admin</div>
          <div className="role">Administrator</div>
        </div>
        <div className="avatar">SA</div>
      </div>

    </div>
  </div>

</header>

  );
}
