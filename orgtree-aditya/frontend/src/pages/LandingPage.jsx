import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 48px",
          background: "var(--primary)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🌳</span>
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 800,
              fontSize: 22,
              color: "var(--gold)",
            }}
          >
            Org<span style={{ color: "green" }}>T</span>ree
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a
            href="#about"
            style={{
              color: "var(--gold-light)",
              fontSize: 14,
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            About
          </a>
          <a
            href="#features"
            style={{
              color: "var(--gold-light)",
              fontSize: 14,
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </a>
          <button
            className="btn-gold"
            onClick={() => navigate("/university")}
            style={{ padding: "8px 20px", fontSize: 13 }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          background:
            "linear-gradient(135deg, var(--off-white) 0%, #FFF5E6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(139,0,0,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(201,168,76,0.06)",
            pointerEvents: "none",
          }}
        />

        <div className="fade-in">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(139,0,0,0.08)",
              border: "1px solid rgba(139,0,0,0.15)",
              borderRadius: 100,
              padding: "6px 16px",
              fontSize: 12,
              color: "var(--primary)",
              fontWeight: 600,
              marginBottom: 28,
              letterSpacing: "0.04em",
            }}
          >
            🌳 Institutional Hierarchy Platform
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              maxWidth: 800,
              color: "var(--dark)",
            }}
          >
            Every branch of your{" "}
            <span style={{ color: "var(--primary)" }}>institution,</span>
            <br />
            visible.
          </h1>

          <p
            className="fade-in-delay"
            style={{
              fontSize: 18,
              color: "var(--mid)",
              maxWidth: 520,
              lineHeight: 1.7,
              marginBottom: 56,
            }}
          >
            OrgTree gives universities and schools a live, interactive map of
            their entire hierarchy — from the Vice Chancellor's office to every
            department. Know who's who, instantly.
          </p>
        </div>

        {/* Pulsing CTA */}
        <div
          className="fade-in-delay-2"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p
            style={{ fontSize: 13, color: "var(--gray-mid)", marginBottom: 8 }}
          >
            Select your institution to get started
          </p>
          <button className="btn-pulse" onClick={() => navigate("/university")}>
            🎓 Select Your University
          </button>
          <p style={{ fontSize: 12, color: "var(--gray-mid)", marginTop: 8 }}>
            Currently serving Aditya University, Surampalem
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ padding: "80px 48px", background: "var(--white)" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 36,
              marginBottom: 12,
              color: "var(--primary)",
            }}
          >
            Everything your institution needs
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "var(--gray-mid)",
              marginBottom: 48,
              fontSize: 15,
            }}
          >
            One platform. Every role. Always current.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                icon: "◈",
                title: "Live Org Tree",
                desc: "Interactive hierarchy from Vice Chancellor to every department head.",
              },
              {
                icon: "◉",
                title: "Staff Directory",
                desc: "Search anyone by name, role, or department instantly.",
              },
              {
                icon: "⬡",
                title: "Department Hub",
                desc: "Every department, its head, its members, its subjects.",
              },
              {
                icon: "◎",
                title: "Smart Notifications",
                desc: "Birthdays, events, holidays — delivered to the right people.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="card"
                style={{ textAlign: "center", transition: "all 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                <div
                  style={{
                    fontSize: 32,
                    marginBottom: 12,
                    color: "var(--primary)",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    marginBottom: 8,
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--gray-mid)",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        style={{
          padding: "80px 48px",
          background: "var(--primary)",
          color: "var(--white)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, color: "var(--gold)", marginBottom: 20 }}>
            About OrgTree
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.85)",
              marginBottom: 32,
            }}
          >
            OrgTree is an institutional structure and notification platform
            designed specifically for educational institutions. We believe that
            every student, parent, and staff member deserves to understand their
            institution without having to ask around.
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 40,
            }}
          >
            Starting with Aditya University, Surampalem — NAAC A++ accredited,
            home to 5000+ students and 500+ faculty across four schools of
            Engineering, Business, Sciences, and Pharmacy.
          </p>
          <button className="btn-gold" onClick={() => navigate("/university")}>
            Explore Aditya University →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "var(--dark)",
          color: "rgba(255,255,255,0.5)",
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>🌳</span>
          <span
            style={{
              color: "var(--gold)",
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
            }}
          >
            OrgTree
          </span>
        </div>
        <span>© 2026 OrgTree · Every branch, visible.</span>
        <span>Aditya University, Surampalem, Andhra Pradesh</span>
      </footer>
    </div>
  );
}
