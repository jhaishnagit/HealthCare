import React, { useState } from "react";
import "../SuperAdminDashboard/css/reports-premium.css";

export default function ReportsAnalyticsView() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const reports = [
    { id: 1, title: "Monthly Hospital Registrations", count: 42, generatedOn: "2025-02-01" },
    { id: 2, title: "Medical Store Registrations", count: 18, generatedOn: "2025-02-01" },
    { id: 3, title: "Total Billing Summary", count: "₹3,20,000", generatedOn: "2025-02-01" },
  ];

  return (
    <div className="rp-wrapper">
      <h2 className="rp-title">Reports & Analytics</h2>

      {/* KPI Cards */}
      <div className="rp-card-container">
        <div className="rp-card gradient-blue">
          <h3>Total Hospitals</h3>
          <p>42</p>
        </div>

        <div className="rp-card gradient-purple">
          <h3>Medical Stores</h3>
          <p>18</p>
        </div>

        <div className="rp-card gradient-green">
          <h3>Total Revenue</h3>
          <p>₹3,20,000</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rp-filters">
        <select className="rp-select" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Month</option>
          <option>01</option><option>02</option><option>03</option>
          <option>04</option><option>05</option><option>06</option>
          <option>07</option><option>08</option><option>09</option>
          <option>10</option><option>11</option><option>12</option>
        </select>

        <select className="rp-select" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          <option>2023</option>
          <option>2024</option>
          <option>2025</option>
          <option>2026</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="rp-table-box">
        <table className="rp-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Title</th>
              <th>Value</th>
              <th>Generated On</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title}</td>
                <td>{r.count}</td>
                <td>{r.generatedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
