import { useNavigate } from "react-router-dom";

export default function UniversityPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--primary)",
          padding: "16px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <span style={{ fontSize: 24 }}>🌳</span>
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 800,
              fontSize: 20,
              color: "var(--gold)",
            }}
          >
            OrgTree
          </span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          Select Institution
        </span>
      </div>

      {/* University Card */}
      <div
        style={{
          maxWidth: 800,
          margin: "60px auto",
          padding: "0 24px",
        }}
      >
        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "var(--white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            1
          </div>
          <div style={{ height: 2, width: 40, background: "var(--border)" }} />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--border)",
              color: "var(--gray-mid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            2
          </div>
          <div style={{ height: 2, width: 40, background: "var(--border)" }} />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--border)",
              color: "var(--gray-mid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            3
          </div>
          <span
            style={{ fontSize: 13, color: "var(--gray-mid)", marginLeft: 8 }}
          >
            Step 1 of 3 — Select your institution
          </span>
        </div>

        <h1 style={{ fontSize: 32, marginBottom: 8, color: "var(--dark)" }}>
          Select Your Institution
        </h1>
        <p style={{ color: "var(--gray-mid)", marginBottom: 36, fontSize: 15 }}>
          Choose your university or school to access its organisational
          structure.
        </p>

        {/* University option */}
        <div
          onClick={() => navigate("/login")}
          style={{
            background: "var(--white)",
            border: "2px solid var(--border)",
            borderRadius: 16,
            padding: "28px",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            gap: 20,
            alignItems: "center",
            marginBottom: 16,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          {/* Logo placeholder */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 32,
            }}
          >
            🎓
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontFamily: "Playfair Display, serif",
                  color: "var(--dark)",
                }}
              >
                Aditya University
              </h3>
              <span
                style={{
                  background: "rgba(139,0,0,0.08)",
                  color: "var(--primary)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 100,
                  letterSpacing: "0.04em",
                }}
              >
                NAAC A++
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--gray-mid)",
                marginBottom: 8,
              }}
            >
              📍 Surampalem, East Godavari District, Andhra Pradesh, India
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                "5000+ Students",
                "500+ Faculty",
                "4 Schools",
                "NIRF Ranked",
                "NBA Accredited",
              ].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "var(--mid)",
                    background: "var(--gray)",
                    padding: "3px 10px",
                    borderRadius: 6,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ color: "var(--primary)", fontSize: 24 }}>→</div>
        </div>

        {/* Coming soon */}
        {["Partner Schools — Coming Soon"].map((s, i) => (
          <div
            key={i}
            style={{
              background: "var(--gray)",
              border: "2px dashed var(--border)",
              borderRadius: 16,
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
              opacity: 0.6,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🏫
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--gray-mid)",
                }}
              >
                {s}
              </p>
              <p style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                More institutions joining OrgTree soon
              </p>
            </div>
          </div>
        ))}

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--gray-mid)",
            marginTop: 24,
          }}
        >
          Is your institution not listed?{" "}
          <span
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Request access →
          </span>
        </p>
      </div>
    </div>
  );
}
