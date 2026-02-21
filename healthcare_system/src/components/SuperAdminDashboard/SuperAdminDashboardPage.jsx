import React from "react";
import "../SuperAdminDashboard/css/dashboard-analytics.css";

/* ---------------- MINI BAR ---------------- */
function MiniBar({ data = [], height = 30 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="mini-bar" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="mini-bar-col" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

/* ---------------- DONUT HELPERS ---------------- */
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ---------------- MINI DONUT ---------------- */
function MiniDonut({ series = [1, 1], size = 64 }) {
  const total = series.reduce((a, b) => a + b, 0) || 1;
  let angle = -90;

  const arcs = series.map((s, i) => {
    const portion = (s / total) * 360;
    const large = portion > 180 ? 1 : 0;

    const start = polarToCartesian(size / 2, size / 2, size / 2 - 6, angle);
    angle += portion;
    const end = polarToCartesian(size / 2, size / 2, size / 2 - 6, angle);

    return {
      d: `
        M ${size / 2} ${size / 2}
        L ${start.x} ${start.y}
        A ${size / 2 - 6} ${size / 2 - 6} 0 ${large} 1 ${end.x} ${end.y}
        Z
      `,
      i,
    };
  });

  return (
    <svg width={size} height={size} className="mini-donut">
      {arcs.map((a) => (
        <path key={a.i} d={a.d} className={`donut-slice s${a.i}`} />
      ))}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 18} fill="white" />
    </svg>
  );
}

/* ---------------- MINI LINE (Trend) ---------------- */
function MiniLine({ data = [], width = 200, height = 40 }) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="mini-line" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function SuperAdminDashboardPage({
  analytics,
  openApproval,
  showApprovedHospitals,
  showApprovedStores,
}) {
  // Extract API data + dummy additions
  const a = {
    approvedHospitals: analytics?.finalApprovedHospitalsCount || 0,
    approvedStores: analytics?.finalApprovedStoresCount || 0,
    pendingHospitals: analytics?.pendingHospitalsCount || 0,
    pendingStores: analytics?.pendingStoresCount || 0,
    hospitalsByCity: analytics?.hospitalsByCity || [],
    storesByMonth: analytics?.storesByMonth || [],
    approvalTrend: analytics?.approvalTrend || [5, 10, 7, 15, 12, 20],

    // ⭐ Dummy new fields
    totalDoctors: analytics?.totalDoctors || 120,
    totalPatients: analytics?.totalPatients || 450,
  };

  return (
    <div className="analytics-section">

      {/* ---------------- TOP METRICS ---------------- */}
      <div className="metrics-row">

        {/* 🏥 Approved Hospitals */}
        <div className="metric-card" onClick={showApprovedHospitals} style={{ cursor: "pointer" }}>
          <div className="m-left">🏥</div>
          <div className="m-right">
            <div className="m-label">Approved Hospitals</div>
            <div className="m-value">{a.approvedHospitals}</div>
            <div className="m-mini">
              <MiniDonut series={[a.approvedHospitals, a.pendingHospitals]} />
            </div>
          </div>
        </div>

        {/* 💊 Approved Stores */}
        <div className="metric-card" onClick={showApprovedStores} style={{ cursor: "pointer" }}>
          <div className="m-left">💊</div>
          <div className="m-right">
            <div className="m-label">Approved Stores</div>
            <div className="m-value">{a.approvedStores}</div>

            <div className="m-mini">
              <MiniBar data={a.storesByMonth} height={28} />
            </div>
          </div>
        </div>

        {/* 🧑‍⚕️ Total Doctors */}
        <div className="metric-card">
          <div className="m-left">🧑‍⚕️</div>
          <div className="m-right">
            <div className="m-label">Total Doctors</div>
            <div className="m-value">{a.totalDoctors}</div>
          </div>
        </div>

        {/* 👨‍🦽 Total Patients */}
        <div className="metric-card">
          <div className="m-left">🧑‍🦽</div>
          <div className="m-right">
            <div className="m-label">Total Patients</div>
            <div className="m-value">{a.totalPatients}</div>
          </div>
        </div>

        {/* ⏳ Pending Requests */}
        <div className="metric-card pending-card" onClick={openApproval} style={{ cursor: "pointer" }}>
          <div className="m-left">⏳</div>
          <div className="m-right">
            <div className="m-label">Pending Requests</div>

            <div className="pending-item">
              <span>Hospitals</span> <strong>{a.pendingHospitals}</strong>
            </div>
            <div className="pending-item">
              <span>Stores</span> <strong>{a.pendingStores}</strong>
            </div>

            <div className="pending-item total">
              <span>Total Pending</span>
              <strong>{a.pendingHospitals + a.pendingStores}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ---------------- CHARTS ---------------- */}

      <div className="charts-row">
        {/* Hospitals by City */}
        <div className="chart-card">
          <div className="chart-title">Hospitals by City</div>
          <div className="chart-body">
            {a.hospitalsByCity.map((c) => (
              <div key={c.city} className="city-row">
                <div className="city-label">{c.city}</div>
                <div className="city-bar">
                  <div
                    style={{
                      width: `${Math.round(
                        (c.value /
                          a.hospitalsByCity.reduce((s, x) => s + x.value, 0)) *
                          100
                      )}%`
                    }}
                  />
                </div>
                <div className="city-val">{c.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Registered Stores */}
        <div className="chart-card">
          <div className="chart-title">Monthly Registered Stores</div>
          <div className="chart-body">
            <MiniBar data={a.storesByMonth} height={80} />
            <div className="xlabels">
              Jan • Feb • Mar • Apr • May • Jun • Jul • Aug • Sep • Oct • Nov • Dec
            </div>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="charts-row">

        {/* Approval Trend */}
        <div className="chart-card">
          <div className="chart-title">Approval Trend (Last 14 Days)</div>
          <div className="chart-body">
            <MiniLine data={a.approvalTrend} />
          </div>
        </div>

        {/* Pending vs Approved */}
        <div className="chart-card small">
          <div className="chart-title">Pending vs Approved</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <MiniDonut
              series={[
                a.pendingHospitals + a.pendingStores,
                a.approvedHospitals + a.approvedStores,
              ]}
            />
            <div>
              <div className="tiny">Pending: {a.pendingHospitals + a.pendingStores}</div>
              <div className="tiny">Approved: {a.approvedHospitals + a.approvedStores}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
