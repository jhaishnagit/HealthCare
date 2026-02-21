// src/components/MedicalDashboard/MedicalDashboard.jsx

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import MedicalSidebar from "./MedicalSidebar";
import MedicalHeader from "./MedicalHeader";
import "./css/MedicalDashboard.css";

import PatientPrescription from "./jsx_files/PatientPrescription";
import MedicalStock from "./jsx_files/MedicalStock";
import Customers from "./jsx_files/Customers";
import Inventory from "./jsx_files/Inventory";
import Billing from "./jsx_files/Billing";
import Orders from "./jsx_files/Orders";
import MedicinePage from "./jsx_files/MedicinePage";

import { UserContext } from "../../context/UserContext";

// 📈 Recharts for graphs (run: npm install recharts)
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";


const API_BASE = "http://localhost:8080/api/dashboard"; // you will create these APIs later

const MedicalDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState("dashboard");

  const { user } = useContext(UserContext);

  // 👉 you will store organizationId in user after login
  const organizationId = user?.organizationId || 1; // fallback for now

  // -------- DASHBOARD STATE (REAL-TIME STYLE) -----------
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashError, setDashError] = useState(null);

  // ---------- FETCH DASHBOARD DATA WHEN PAGE === "dashboard" ----------
  useEffect(() => {
    if (page !== "dashboard" || !organizationId) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingDashboard(true);
        setDashError(null);

        const [
          summaryRes,
          lowRes,
          expRes,
          outRes,
          ordersRes,
          paymentsRes,
          salesRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/summary`, {
            params: { organizationId },
          }),
          axios.get(`${API_BASE}/low-stock-medicines`, {
            params: { organizationId },
          }),
          axios.get(`${API_BASE}/expiring-soon-medicines`, {
            params: { organizationId },
          }),
          axios.get(`${API_BASE}/out-of-stock-medicines`, {
            params: { organizationId },
          }),
          axios.get(`${API_BASE}/recent-orders`, {
            params: { organizationId },
          }),
          axios.get(`${API_BASE}/recent-payments`, {
            params: { organizationId },
          }),
          axios.get(`${API_BASE}/monthly-sales`, {
            params: { organizationId },
          }),
        ]);

        setSummary(summaryRes.data);
        setLowStock(lowRes.data || []);
        setExpiringSoon(expRes.data || []);
        setOutOfStock(outRes.data || []);
        setRecentOrders(ordersRes.data || []);
        setRecentPayments(paymentsRes.data || []);
        setMonthlySales(salesRes.data || []);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setDashError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, [page, organizationId]);

  // -------- DUMMY FALLBACK (UNTIL YOU CREATE APIs) -----------
  // 👉 Remove this block when your backend is ready
  useEffect(() => {
    if (!summary && !loadingDashboard && !dashError) {
      // simple fallback so UI doesn't look empty in development
      setSummary({
        totalMedicines: 120,
        inStock: 95,
        lowStock: 15,
        outOfStock: 10,
        expired: 5,
        expiringSoon: 8,
        newOrders: 12,
        pendingOrders: 7,
        completedOrders: 30,
        totalCustomers: 85,
        totalRevenue: 150000,
        pendingPayments: 22000,
      });

      setLowStock([
        {
          id: 1,
          medicineName: "Paracetamol 500mg",
          quantityAvailable: 8,
          reorderLevel: 10,
          locationOfRack: "R1-A2",
        },
        {
          id: 2,
          medicineName: "Vitamin D3",
          quantityAvailable: 5,
          reorderLevel: 10,
          locationOfRack: "R2-B1",
        },
      ]);

      setExpiringSoon([
        {
          id: 3,
          medicineName: "Amoxicillin",
          batchNo: "AMX-234",
          expiryDate: new Date().toISOString(),
          quantityAvailable: 20,
        },
      ]);

      setOutOfStock([
        {
          id: 4,
          medicineName: "Cetirizine",
          category: "Anti-allergic",
          locationOfRack: "R3-C4",
        },
      ]);

      setRecentOrders([
        {
          orderId: "ORD-001",
          customerName: "Ramesh",
          totalAmount: 550,
          status: "PENDING",
          createdAt: "2025-12-01T10:15:00",
        },
        {
          orderId: "ORD-002",
          customerName: "Sita",
          totalAmount: 1200,
          status: "COMPLETED",
          createdAt: "2025-12-01T09:45:00",
        },
      ]);

      setRecentPayments([
        {
          paymentId: "PAY-001",
          customerName: "Ramesh",
          paidAmount: 300,
          pendingAmount: 250,
          status: "PARTIAL",
          date: "2025-12-01T10:30:00",
        },
        {
          paymentId: "PAY-002",
          customerName: "Sita",
          paidAmount: 1200,
          pendingAmount: 0,
          status: "PAID",
          date: "2025-12-01T10:00:00",
        },
      ]);

      setMonthlySales([
        { month: "Jan", amount: 25000 },
        { month: "Feb", amount: 30000 },
        { month: "Mar", amount: 28000 },
        { month: "Apr", amount: 35000 },
        { month: "May", amount: 32000 },
        { month: "Jun", amount: 40000 },
      ]);
    }
  }, [summary, loadingDashboard, dashError]);

  // ------------ HELPERS ------------
  const formatCurrency = (v) =>
    v != null ? `₹${v.toLocaleString("en-IN")}` : "₹0";

  // ------------ MAIN RENDER ------------
  return (
    <div className="med-wrapper">
      {/* HEADER */}
      <MedicalHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* SIDEBAR */}
      <MedicalSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setPage={setPage}
      />

      {/* MAIN CONTENT */}
      <div
        className="med-main"
        style={{
          marginLeft: sidebarOpen ? "250px" : "0",
          transition: "0.3s ease",
          paddingTop: "110px",
        }}
      >
        {/* ================== DASHBOARD PAGE ================== */}
        {page === "dashboard" && (
          <div className="med-dashboard-container">
            {dashError && (
              <div className="dash-error-banner">{dashError}</div>
            )}

            {/* TOP SUMMARY CARDS (MEDICINES + ORDERS + CUSTOMERS + PAYMENTS) */}
            <div className="cards-row">
              <div className="dash-card">
                <h3>Total Medicines</h3>
                <p>{summary?.totalMedicines ?? 0}</p>
                <span className="card-sub">All items in inventory</span>
              </div>

              <div className="dash-card instock">
                <h3>In Stock</h3>
                <p>{summary?.inStock ?? 0}</p>
                <span className="card-sub">Available for sale</span>
              </div>

              <div className="dash-card low">
                <h3>Low Stock</h3>
                <p>{summary?.lowStock ?? 0}</p>
                <span className="card-sub">Need to reorder</span>
              </div>

              <div className="dash-card out">
                <h3>Out of Stock</h3>
                <p>{summary?.outOfStock ?? 0}</p>
                <span className="card-sub">Completely unavailable</span>
              </div>
            </div>

            <div className="cards-row">
              <div className="dash-card expired">
                <h3>Expired</h3>
                <p>{summary?.expired ?? 0}</p>
                <span className="card-sub">Remove from shelf</span>
              </div>

              <div className="dash-card expiring">
                <h3>Expiring Soon</h3>
                <p>{summary?.expiringSoon ?? 0}</p>
                <span className="card-sub">Within 30 days</span>
              </div>

              <div className="dash-card orders">
                <h3>New Orders</h3>
                <p>{summary?.newOrders ?? 0}</p>
                <span className="card-sub">Today</span>
              </div>

              <div className="dash-card pending">
                <h3>Pending Orders</h3>
                <p>{summary?.pendingOrders ?? 0}</p>
                <span className="card-sub">Awaiting fulfillment</span>
              </div>

              <div className="dash-card completed">
                <h3>Completed Orders</h3>
                <p>{summary?.completedOrders ?? 0}</p>
                <span className="card-sub">Successfully delivered</span>
              </div>

              <div className="dash-card customers">
                <h3>Total Customers</h3>
                <p>{summary?.totalCustomers ?? 0}</p>
                <span className="card-sub">Registered</span>
              </div>
            </div>

            {/* PAYMENTS SUMMARY CARDS */}
            <div className="cards-row">
              <div className="dash-card payments">
                <h3>Total Revenue</h3>
                <p>{formatCurrency(summary?.totalRevenue ?? 0)}</p>
                <span className="card-sub">All time</span>
              </div>

              <div className="dash-card pending-payments">
                <h3>Pending Payments</h3>
                <p>{formatCurrency(summary?.pendingPayments ?? 0)}</p>
                <span className="card-sub">Outstanding from customers</span>
              </div>
            </div>

            {/* ========== GRAPHS ROW ========== */}
            <div className="dash-graphs-row">
              {/* Monthly Sales Graph */}
              <div className="graph-card">
                <h3>Monthly Sales (₹)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      name="Sales"
                      stroke="#1f77b4"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Orders Status Graph */}
              <div className="graph-card">
                <h3>Orders Status</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={[
                      {
                        name: "New",
                        value: summary?.newOrders ?? 0,
                      },
                      {
                        name: "Pending",
                        value: summary?.pendingOrders ?? 0,
                      },
                      {
                        name: "Completed",
                        value: summary?.completedOrders ?? 0,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2ecc71" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ========== LOWER TABLES ========== */}
            <div className="dash-tables-row">
              {/* Low Stock Medicines */}
              <div className="dash-table-card">
                <h3>Low Stock Medicines</h3>
                <table className="prescription-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Qty</th>
                      <th>Reorder</th>
                      <th>Rack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.length === 0 && (
                      <tr>
                        <td colSpan="4">No low stock medicines</td>
                      </tr>
                    )}
                    {lowStock.map((m) => (
                      <tr key={m.id}>
                        <td>{m.medicineName}</td>
                        <td>{m.quantityAvailable}</td>
                        <td>{m.reorderLevel}</td>
                        <td>{m.locationOfRack}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expiring Soon */}
              <div className="dash-table-card">
                <h3>Expiring Soon</h3>
                <table className="prescription-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Batch</th>
                      <th>Expiry</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringSoon.length === 0 && (
                      <tr>
                        <td colSpan="4">No medicines expiring soon</td>
                      </tr>
                    )}
                    {expiringSoon.map((m) => (
                      <tr key={m.id}>
                        <td>{m.medicineName}</td>
                        <td>{m.batchNo}</td>
                        <td>
                          {m.expiryDate
                            ? new Date(m.expiryDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>{m.quantityAvailable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Out of Stock */}
              <div className="dash-table-card">
                <h3>Out of Stock</h3>
                <table className="prescription-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Category</th>
                      <th>Rack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStock.length === 0 && (
                      <tr>
                        <td colSpan="3">No out of stock medicines</td>
                      </tr>
                    )}
                    {outOfStock.map((m) => (
                      <tr key={m.id}>
                        <td>{m.medicineName}</td>
                        <td>{m.category}</td>
                        <td>{m.locationOfRack}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ========== ORDERS + PAYMENTS ========== */}
            <div className="dash-tables-row">
              {/* Recent Orders */}
              <div className="dash-table-card">
                <h3>Recent Orders</h3>
                <table className="prescription-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan="5">No recent orders</td>
                      </tr>
                    )}
                    {recentOrders.map((o) => (
                      <tr key={o.orderId}>
                        <td>{o.orderId}</td>
                        <td>{o.customerName}</td>
                        <td>{formatCurrency(o.totalAmount)}</td>
                        <td>{o.status}</td>
                        <td>
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Payments */}
              <div className="dash-table-card">
                <h3>Recent Payments</h3>
                <table className="prescription-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Customer</th>
                      <th>Paid</th>
                      <th>Pending</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.length === 0 && (
                      <tr>
                        <td colSpan="6">No recent payments</td>
                      </tr>
                    )}
                    {recentPayments.map((p) => (
                      <tr key={p.paymentId}>
                        <td>{p.paymentId}</td>
                        <td>{p.customerName}</td>
                        <td>{formatCurrency(p.paidAmount)}</td>
                        <td>{formatCurrency(p.pendingAmount)}</td>
                        <td>{p.status}</td>
                        <td>
                          {p.date ? new Date(p.date).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================== OTHER PAGES ================== */}
        {page === "patient" && <PatientPrescription />}
        {page === "store" && <MedicalStock />}
        {page === "billing" && <Billing />}
        {page === "inventory" && <Inventory />}
        {page === "customers" && <Customers />}
        {page === "orders" && <Orders />}
        {page === "MedicinePage" && <MedicinePage />}
      </div>
    </div>
  );  
};

export default MedicalDashboard;
