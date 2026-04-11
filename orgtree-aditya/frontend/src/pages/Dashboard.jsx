import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleColor = {
    superadmin: "#5B21B6",
    admin: "#8B0000",
    principal: "#8B0000",
    hod: "#065F46",
    teacher: "#92400E",
    support: "#1E40AF",
    student: "#374151",
    parent: "#374151",
    visitor: "#6B7280",
  };

  const roleLabel = {
    superadmin: "Super Administrator",
    admin: "System Administrator",
    principal: "Vice Chancellor",
    hod: "Head of Department",
    teacher: "Faculty Member",
    support: "Support Staff",
    student: "Student",
    parent: "Parent / Guardian",
    visitor: "Visitor",
  };

  const quickActions = [
    {
      icon: "◈",
      label: "Organisation Tree",
      desc: "View the full university hierarchy",
      path: "/tree",
      color: "#8B0000",
    },
    {
      icon: "◉",
      label: "Staff Directory",
      desc: "Search all faculty and staff",
      path: "/tree",
      color: "#065F46",
    },
    {
      icon: "⬡",
      label: "Departments",
      desc: "Browse all departments",
      path: "/tree",
      color: "#92400E",
    },
    {
      icon: "◎",
      label: "Notifications",
      desc: "View announcements and events",
      path: "/tree",
      color: "#1E40AF",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
      {/* Top navbar */}
      <nav
        style={{
          background: "var(--primary)",
          padding: "0 48px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              borderLeft: "1px solid rgba(255,255,255,0.2)",
              paddingLeft: 12,
            }}
          >
            Aditya University
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--gold)",
                fontFamily: "Playfair Display, serif",
              }}
            >
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div
                style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                {roleLabel[user?.role]}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "var(--white)",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        {/* Welcome */}
        <div className="fade-in" style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 4,
                height: 32,
                background: "var(--primary)",
                borderRadius: 2,
              }}
            />
            <h1 style={{ fontSize: 28, color: "var(--dark)" }}>
              Good day, {user?.name?.split(" ")[0]} 👋
            </h1>
          </div>
          <p style={{ color: "var(--gray-mid)", fontSize: 15, marginLeft: 16 }}>
            Welcome to Aditya University's institutional management portal.
          </p>
        </div>

        {/* Role badge */}
        <div className="fade-in" style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "12px 20px",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: roleColor[user?.role] || "var(--primary)",
              }}
            />
            <span style={{ fontSize: 13, color: "var(--mid)" }}>
              Logged in as
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: roleColor[user?.role] || "var(--primary)",
              }}
            >
              {roleLabel[user?.role]}
            </span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ fontSize: 13, color: "var(--gray-mid)" }}>
              {user?.department}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="fade-in" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16, color: "var(--dark)" }}>
            Quick Actions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {quickActions.map((action, i) => (
              <div
                key={i}
                className="card"
                onClick={() => navigate(action.path)}
                style={{ cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${action.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    color: action.color,
                    marginBottom: 12,
                  }}
                >
                  {action.icon}
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    marginBottom: 6,
                    fontFamily: "Playfair Display, serif",
                    color: "var(--dark)",
                  }}
                >
                  {action.label}
                </h3>
                <p style={{ fontSize: 13, color: "var(--gray-mid)" }}>
                  {action.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* University Info */}
        <div
          className="fade-in-delay"
          style={{
            background: "var(--primary)",
            borderRadius: 16,
            padding: "32px",
            display: "flex",
            gap: 32,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 48 }}>🎓</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, color: "var(--gold)", marginBottom: 6 }}>
              Aditya University, Surampalem
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              NAAC A++ · NBA Accredited · NIRF Ranked · Est. 2016
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Students", value: "5000+" },
                { label: "Faculty", value: "500+" },
                { label: "Programs", value: "30+" },
                { label: "Schools", value: "4" },
              ].map((stat, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "var(--gold)",
                      fontFamily: "Playfair Display, serif",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="btn-gold"
            onClick={() => navigate("/tree")}
            style={{ flexShrink: 0 }}
          >
            View Org Tree →
          </button>
        </div>

        {/* Guide */}
        <div className="fade-in-delay" style={{ marginTop: 24 }}>
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontSize: 24, flexShrink: 0 }}>📖</div>
            <div>
              <h3
                style={{
                  fontSize: 15,
                  marginBottom: 6,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                How to use OrgTree
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--gray-mid)",
                  lineHeight: 1.6,
                }}
              >
                Navigate to the <strong>Organisation Tree</strong> to explore
                the full university hierarchy. Click any node to expand its
                members. Click a person's card to view their full profile. Use
                the <strong>Directory</strong> to search anyone by name or
                department. Your view is personalised based on your role as{" "}
                <strong>{roleLabel[user?.role]}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
