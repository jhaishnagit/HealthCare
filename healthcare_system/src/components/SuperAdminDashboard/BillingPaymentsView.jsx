import React, { useState } from "react";
import "../SuperAdminDashboard/css/super-admin-table.css";

export default function BillingPaymentsView() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const bills = [
    { id: 1, patient: "Aman", hospital: "Sunrise Hospital", amount: 2500, status: "Paid", date: "2025-02-01" },
    { id: 2, patient: "Rani", hospital: "City Care Hospital", amount: 1800, status: "Pending", date: "2025-02-04" },
    { id: 3, patient: "Karthik", hospital: "Green Valley Hospital", amount: 4200, status: "Paid", date: "2025-02-06" },
  ];

  const totalRevenue = bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = bills.filter(b => b.status === "Pending").reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="bp-wrapper">
      <h2 className="bp-title">Billing & Payments</h2>

      {/* Summary Cards */}
      <div className="bp-card-container">
        <div className="bp-card gradient-blue">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>

        <div className="bp-card gradient-purple">
          <h3>Pending Amount</h3>
          <p>₹{pendingAmount}</p>
        </div>

        <div className="bp-card gradient-green">
          <h3>Total Bills</h3>
          <p>{bills.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bp-filters">
        <input type="text" placeholder="Search bill, patient..." className="bp-search" />

        {/* Month Filter */}
        <select className="bp-select" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Month</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {/* Year Filter */}
        <select className="bp-select" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          <option>2023</option>
          <option>2024</option>
          <option>2025</option>
          <option>2026</option>
        </select>

        {/* Hospital Filter */}
        <select className="bp-select">
          <option value="">Hospital</option>
          <option>Sunrise Hospital</option>
          <option>City Care Hospital</option>
          <option>Green Valley Hospital</option>
        </select>

        {/* Status Filter */}
        <select className="bp-select">
          <option value="">Status</option>
          <option>Paid</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bp-table-box">
        <table className="bp-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Patient</th>
              <th>Hospital</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.patient}</td>
                <td>{b.hospital}</td>
                <td>₹{b.amount}</td>
                <td>
                  <span className={`bp-badge ${b.status === "Paid" ? "bp-paid" : "bp-pending"}`}>
                    {b.status}
                  </span>
                </td>
                <td>{b.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
