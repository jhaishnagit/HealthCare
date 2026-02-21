import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Building2,
  Pill,
  FlaskConical,
  UserRound,
  Sparkles,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./OnboardingDashboard.css";

const onboardingTypes = [
  {
    id: "hospital",
    title: "Hospital",
    description: "Complete multi-department hospital onboarding",
    icon: Building2,
    path: "/onboarding/hospital",
    color: "blue"
  },
  {
    id: "clinic",
    title: "Clinic",
    description: "Set up your outpatient or specialty clinic",
    icon: Stethoscope,
    path: "/onboarding/clinic",
    color: "violet"
  },
  {
    id: "medical-store",
    title: "Medical Store",
    description: "Register your pharmacy or medical supply store",
    icon: Pill,
    path: "/onboarding/medical-store",
    color: "emerald"
  },
  {
    id: "diagnostic",
    title: "Diagnostic Center / Lab",
    description: "Onboard your pathology or diagnostic facility",
    icon: FlaskConical,
    path: "/onboarding/lab",
    color: "orange"
  },
  {
    id: "doctor",
    title: "Individual Doctor / Professional",
    description: "Quick setup for independent practitioners",
    icon: UserRound,
    path: "/onboarding/individual",
    color: "pink"
  }
];

const colorMap = {
  blue: {
    gradient: "linear-gradient(135deg,#3b82f6, #60a5fa)",
    accent: "#2563eb",
    glow: "rgba(59,130,246,0.18)"
  },
  violet: {
    gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    accent: "#7c3aed",
    glow: "rgba(124,58,237,0.14)"
  },
  emerald: {
    gradient: "linear-gradient(135deg,#10b981,#34d399)",
    accent: "#059669",
    glow: "rgba(16,185,129,0.14)"
  },
  orange: {
    gradient: "linear-gradient(135deg,#f97316,#fb923c)",
    accent: "#ea580c",
    glow: "rgba(249,115,22,0.14)"
  },
  pink: {
    gradient: "linear-gradient(135deg,#ec4899,#f472b6)",
    accent: "#db2777",
    glow: "rgba(236,72,153,0.14)"
  }
};

const OnboardingDashboard = () => {
  const navigate = useNavigate(); // works if react-router is set up
  const [hoveredTile, setHoveredTile] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // subtle mount animation
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleTileClick = (path) => {
    // prefer react-router navigate if available
    if (navigate) navigate(path);
    else window.location.href = path;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="oh-dashboard">
      {/* animated background shapes */}
      <div className="oh-bg">
        <div className="oh-blob b1" />
        <div className="oh-blob b2" />
        <div className="oh-blob b3" />
      </div>

      <div className="oh-container">
        <header className={`oh-header ${loaded ? "loaded" : ""}`}>
          <div className="oh-badge">
            <Sparkles className="oh-badge-icon" />
            <span>Your Healthcare Journey Starts Here</span>
          </div>
          <h1>Welcome to Jhaihealthcare</h1>
          <p className="oh-sub">
            Select your healthcare facility type to begin a seamless onboarding experience.
          </p>
        </header>

        <main className="oh-grid">
          {onboardingTypes.map((t, idx) => {
            const Icon = t.icon;
            const cm = colorMap[t.color] || colorMap.blue;
            const isHovered = hoveredTile === t.id;

            return (
              <div
                key={t.id}
                className={`oh-tile ${loaded ? "in" : ""}`}
                style={{
                  transitionDelay: `${idx * 70}ms`,
                  boxShadow: isHovered
                    ? `0 18px 36px ${cm.glow}`
                    : "0 8px 18px rgba(15,23,42,0.06)"
                }}
              >
                <button
                  className="oh-tile-btn"
                  onClick={() => handleTileClick(t.path)}
                  onMouseEnter={() => setHoveredTile(t.id)}
                  onMouseLeave={() => setHoveredTile(null)}
                  onMouseMove={handleMouseMove}
                  aria-label={`Start onboarding for ${t.title}`}
                >
                  {/* animated radial highlight */}
                  <div
                    className="oh-radial"
                    style={{
                      background: isHovered
                        ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.08), transparent 18%)`
                        : "transparent"
                    }}
                  />

                  {/* left accent strip */}
                  <div
                    className="oh-accent"
                    style={{ background: cm.accent, boxShadow: `0 6px 18px ${cm.glow}` }}
                  />

                  <div className="oh-content">
                    <div
                      className="oh-icon"
                      style={{
                        background: cm.gradient,
                        boxShadow: `0 8px 24px ${cm.glow}`
                      }}
                    >
                      <Icon strokeWidth={2.5} />
                    </div>

                    <div className="oh-text">
                      <h3 className="oh-title">{t.title}</h3>
                      <p className="oh-desc">{t.description}</p>
                    </div>

                    <div className="oh-cta">
                      <span className="oh-cta-text">Get Started</span>
                      <ArrowRight />
                    </div>
                  </div>

                  {/* decorative corner */}
                  <div
                    className="oh-corner"
                    style={{ background: cm.gradient, opacity: 0.12 }}
                  />
                </button>
              </div>
            );
          })}
        </main>

        <footer className="oh-footer">
          <div className="footer-card">
            <HelpCircle />
            <div>
              <div className="footer-title">Need help choosing?</div>
              <a className="footer-link" href="/support">Contact our team</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OnboardingDashboard;
