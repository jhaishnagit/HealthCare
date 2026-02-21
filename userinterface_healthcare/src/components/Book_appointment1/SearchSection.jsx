import React, { useEffect, useState } from "react";
import "./css/SearchSection.css";

const SearchSection = ({ onSearch, onNearHospitals }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 realtime debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <section className="search-section">
      <div className="search-box">
        <input
          className="search-input"
          placeholder="Search hospitals in India..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-options">
        <div className="filter-btn active">All India</div>
        <div className="filter-btn" onClick={onNearHospitals}>
          Near Hospitals
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
