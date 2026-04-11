import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  const demoAccounts = [
    { role: "Admin", email: "admin@aditya.edu", password: "admin123" },
    { role: "Principal", email: "principal@aditya.edu", password: "admin123" },
    { role: "HOD CSE", email: "hod.cse@aditya.edu", password: "admin123" },
    { role: "Teacher", email: "kiran.reddy@aditya.edu", password: "admin123" },
    {
      role: "Student",
      email: "arjun.sai@student.aditya.edu",
      password: "student123",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, var(--off-white) 0%, #FFF5E6 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🎓</span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            Aditya University, Surampalem
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {/* Login Form */}
        <div className="card fade-in" style={{ width: "100%", maxWidth: 400 }}>
          {/* Step indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--border)",
                color: "var(--gray-mid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              1
            </div>
            <div
              style={{ height: 2, width: 32, background: "var(--border)" }}
            />
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              2
            </div>
            <div
              style={{ height: 2, width: 32, background: "var(--border)" }}
            />
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--border)",
                color: "var(--gray-mid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              3
            </div>
            <span
              style={{ fontSize: 12, color: "var(--gray-mid)", marginLeft: 4 }}
            >
              Step 2 of 3 — Sign in
            </span>
          </div>

          <h2 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h2>
          <p
            style={{ color: "var(--gray-mid)", fontSize: 14, marginBottom: 28 }}
          >
            Sign in to access Aditya University OrgTree
          </p>

          {error && (
            <div
              style={{
                background: "#FEE2E2",
                border: "1px solid #FCA5A5",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#991B1B",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mid)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Institutional Email
              </label>
              <input
                type="email"
                placeholder="yourname@aditya.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--mid)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "12px", fontSize: 15 }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--gray-mid)",
              marginTop: 20,
            }}
          >
            Access is restricted to registered Aditya University members only.
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="fade-in-delay" style={{ width: "100%", maxWidth: 320 }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 12,
              color: "var(--mid)",
            }}
          >
            🎯 Demo Accounts — Click to fill
          </h3>
          <p
            style={{ fontSize: 12, color: "var(--gray-mid)", marginBottom: 16 }}
          >
            Use these to explore different role-based views
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {demoAccounts.map((acc, i) => (
              <div
                key={i}
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.password);
                }}
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.background = "rgba(139,0,0,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--white)";
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--dark)",
                    }}
                  >
                    {acc.role}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--gray-mid)" }}>
                    {acc.email}
                  </div>
                </div>
                <span style={{ color: "var(--primary)", fontSize: 16 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
