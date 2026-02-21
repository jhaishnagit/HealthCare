import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../css/DashboardHome.css";
import { UserContext } from "../../context/UserContext";

const DashboardHome = () => {
  const { user } = useContext(UserContext);

  const organizationId = user?.organizationId;

  const [summary, setSummary] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [summaryRes, medsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/medicines/dashboard-summary?organizationId=${organizationId}`),
          axios.get(`http://localhost:8080/api/medicines/filter?organizationId=${organizationId}`)
        ]);

        setSummary(summaryRes.data);
        setMedicines(medsRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organizationId]);

  if (loading) return <div className="dash-container">Loading...</div>;

  return (
    <div className="dash-home-wrapper">

      {/* TOP CARDS */}
      <div className="dash-summary-row">

        <div className="dash-card total">
          <h4>Total Medicines</h4>
          <p>{summary.total}</p>
        </div>

        <div className="dash-card instock">
          <h4>In Stock</h4>
          <p>{summary.inStock}</p>
        </div>

        <div className="dash-card low">
          <h4>Low Stock</h4>
          <p>{summary.lowStock}</p>
        </div>

        <div className="dash-card out">
          <h4>Out of Stock</h4>
          <p>{summary.outOfStock}</p>
        </div>

        <div className="dash-card expired">
          <h4>Expired</h4>
          <p>{summary.expired}</p>
        </div>

        <div className="dash-card expiring">
          <h4>Expiring Soon</h4>
          <p>{summary.expiringSoon}</p>
        </div>

      </div>

      {/* BOTTOM TABLES */}
      <div className="dash-bottom-row">

        {/* LOW STOCK */}
        <div className="dash-panel">
          <h3>Low Stock Medicines</h3>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Reorder Level</th>
                <th>Rack</th>
              </tr>
            </thead>
            <tbody>
              {summary.lowStock === 0 && (
                <tr>
                  <td colSpan="4">No low stock medicines</td>
                </tr>
              )}

              {medicines
                .filter(m => m.quantityAvailable <= m.reorderLevel && m.quantityAvailable > 0)
                .slice(0, 5)
                .map(m => (
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

        {/* EXPIRING SOON */}
        <div className="dash-panel">
          <h3>Expiring Soon</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {summary.expiringSoon === 0 && (
                <tr>
                  <td colSpan="4">No medicines expiring soon</td>
                </tr>
              )}

              {medicines
                .filter(m => m.expiryDate)
                .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
                .slice(0, 5)
                .map(m => (
                  <tr key={m.id}>
                    <td>{m.medicineName}</td>
                    <td>{m.batchNo}</td>
                    <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                    <td>{m.quantityAvailable}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* OUT OF STOCK */}
        <div className="dash-panel">
          <h3>Out of Stock</h3>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Category</th>
                <th>Rack</th>
              </tr>
            </thead>
            <tbody>
              {summary.outOfStock === 0 && (
                <tr>
                  <td colSpan="3">No out of stock medicines</td>
                </tr>
              )}

              {medicines
                .filter(m => m.quantityAvailable <= 0)
                .slice(0, 5)
                .map(m => (
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

    </div>
  );
};

export default DashboardHome;
