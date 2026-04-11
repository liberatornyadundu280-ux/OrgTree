import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function PersonModal({ person, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--white)",
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <img
              src={person.profilePhoto}
              alt={person.name}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--primary)",
              }}
              onError={(e) =>
                (e.target.src = `https://ui-avatars.com/api/?name=${person.name}&background=8B0000&color=fff&size=60`)
              }
            />
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>{person.name}</h2>
              <p style={{ fontSize: 13, color: "var(--gray-mid)" }}>
                {person.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "var(--gray-mid)",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "rgba(139,0,0,0.08)",
              color: "var(--primary)",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 100,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {person.role}
          </span>
          {person.department && (
            <span
              style={{
                background: "var(--gray)",
                color: "var(--mid)",
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 100,
              }}
            >
              {person.department}
            </span>
          )}
        </div>

        {person.bio && (
          <p
            style={{
              fontSize: 13,
              color: "var(--mid)",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            {person.bio}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {[
            { icon: "✉️", label: "Email", value: person.email },
            {
              icon: "🎓",
              label: "Qualifications",
              value: person.qualifications,
            },
          ].map(
            (f) =>
              f.value && (
                <div
                  key={f.label}
                  style={{
                    background: "var(--gray)",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--gray-mid)",
                      marginBottom: 3,
                    }}
                  >
                    {f.icon} {f.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--dark)",
                      fontWeight: 500,
                    }}
                  >
                    {f.value}
                  </div>
                </div>
              ),
          )}
        </div>

        {person.subjects?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--gray-mid)",
                marginBottom: 8,
              }}
            >
              SUBJECTS
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {person.subjects.map((s) => (
                <span
                  key={s}
                  style={{
                    background: "var(--gray)",
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 6,
                    color: "var(--mid)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn-primary"
          style={{ width: "100%" }}
          onClick={onClose}
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}

function TreeNode({ node, children, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const roleColors = {
    principal: "#8B0000",
    admin: "#8B0000",
    hod: "#065F46",
    teacher: "#92400E",
    support: "#1E40AF",
    student: "#374151",
  };

  const color = roleColors[node.role] || "#374151";

  const loadChildren = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/users/${node._id}/children`,
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setMembers(data);
      setExpanded(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Node Card */}
      <div
        style={{
          background: "var(--white)",
          border: `2px solid ${color}44`,
          borderRadius: 14,
          padding: "16px",
          width: 180,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${color}44`;
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
        }}
        onClick={() => onSelect(node)}
      >
        <img
          src={node.profilePhoto}
          alt={node.name}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 10,
            border: `3px solid ${color}33`,
          }}
          onError={(e) =>
            (e.target.src = `https://ui-avatars.com/api/?name=${node.name}&background=${color.replace("#", "")}&color=fff&size=52`)
          }
        />
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 4,
            fontFamily: "Playfair Display, serif",
            color: "var(--dark)",
            lineHeight: 1.3,
          }}
        >
          {node.name.split(" ").slice(0, 2).join(" ")}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--gray-mid)",
            marginBottom: 8,
            lineHeight: 1.4,
          }}
        >
          {node.title?.split("—")[0]?.trim() || node.title}
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 100,
            background: `${color}15`,
            color,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {node.role}
        </span>

        {children > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              loadChildren();
            }}
            style={{
              marginTop: 10,
              background: `${color}15`,
              border: `1px solid ${color}33`,
              borderRadius: 100,
              padding: "3px 10px",
              color,
              fontSize: 10,
              cursor: "pointer",
              fontWeight: 600,
              width: "100%",
            }}
          >
            {loading
              ? "..."
              : expanded
                ? "▲ Hide"
                : `▼ ${children} member${children !== 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {/* Children Cards */}
      {expanded && members.length > 0 && (
        <>
          <div style={{ width: 2, height: 24, background: `${color}66` }} />
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {members.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: 2,
                  background: `${color}33`,
                }}
              />
            )}
            {members.map((member) => (
              <div
                key={member._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ width: 2, height: 20, background: `${color}66` }}
                />
                <div
                  onClick={() => onSelect(member)}
                  style={{
                    background: "var(--white)",
                    border: `1px solid ${color}33`,
                    borderRadius: 10,
                    padding: "12px",
                    width: 160,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${color}33`;
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <img
                    src={member.profilePhoto}
                    alt={member.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: 8,
                      border: `2px solid ${color}22`,
                    }}
                    onError={(e) =>
                      (e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=8B0000&color=fff&size=40`)
                    }
                  />
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "Playfair Display, serif",
                      color: "var(--dark)",
                      marginBottom: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    {member.name.split(" ").slice(0, 2).join(" ")}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--gray-mid)",
                      lineHeight: 1.3,
                    }}
                  >
                    {member.title?.split("—")[0]?.trim()?.split("—")[0] ||
                      member.role}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      fontSize: 8,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 100,
                      background: `${color}15`,
                      color,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgTree() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [treeNodes, setTreeNodes] = useState([]);
  const [childCounts, setChildCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/tree",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setTreeNodes(data);

        // Get child counts
        const counts = {};
        for (const node of data) {
          const res = await axios.get(
            `http://localhost:5000/api/users/${node._id}/children`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            },
          );
          counts[node._id] = res.data.length;
        }
        setChildCounts(counts);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    const fetchAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAllUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTree();
    fetchAll();
  }, []);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    const q = search.toLowerCase();
    setSearchResults(
      allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.department?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q) ||
          u.title?.toLowerCase().includes(q),
      ),
    );
  }, [search, allUsers]);

  // Build tree structure
  const principal = treeNodes.find((n) => n.role === "principal");
  const hods = treeNodes.filter((n) => n.role === "hod");
  const admins = treeNodes.filter((n) => n.role === "admin");

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
      {/* Navbar */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <span style={{ fontSize: 22 }}>🌳</span>
            <span
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 800,
                fontSize: 18,
                color: "var(--gold)",
              }}
            >
              OrgTree
            </span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            Organisation Tree
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "var(--white)",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ← Dashboard
        </button>
      </nav>

      <div style={{ padding: "40px 48px" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 6 }}>Organisation Tree</h1>
            <p style={{ color: "var(--gray-mid)", fontSize: 14 }}>
              Aditya University — Full institutional hierarchy. Click any node
              to expand.
            </p>
          </div>
          {/* Search */}
          <div style={{ position: "relative", width: 280 }}>
            <span
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--gray-mid)",
                fontSize: 14,
              }}
            >
              🔍
            </span>
            <input
              placeholder="Search staff, departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
            {searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  right: 0,
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 100,
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {searchResults.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => {
                      setSelected(u);
                      setSearch("");
                    }}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--gray)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "")
                    }
                  >
                    <img
                      src={u.profilePhoto}
                      alt={u.name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      onError={(e) =>
                        (e.target.src = `https://ui-avatars.com/api/?name=${u.name}&background=8B0000&color=fff&size=32`)
                      }
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--dark)",
                        }}
                      >
                        {u.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--gray-mid)" }}>
                        {u.title || u.role} · {u.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          {[
            { role: "Principal", color: "#8B0000" },
            { role: "HOD", color: "#065F46" },
            { role: "Teacher", color: "#92400E" },
            { role: "Support", color: "#1E40AF" },
            { role: "Student", color: "#374151" },
          ].map((l) => (
            <div
              key={l.role}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: l.color,
                }}
              />
              <span style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                {l.role}
              </span>
            </div>
          ))}
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 80,
              color: "var(--gray-mid)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🌳</div>
            <p>Loading organisation tree...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto", paddingBottom: 40 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                minWidth: "max-content",
                padding: "20px 40px",
              }}
            >
              {/* Principal */}
              {principal && (
                <>
                  <TreeNode
                    node={principal}
                    children={childCounts[principal._id] || 0}
                    onSelect={setSelected}
                  />
                  <div
                    style={{ width: 2, height: 32, background: "#8B000066" }}
                  />
                </>
              )}

              {/* Second level — HODs and Admin side by side */}
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[...hods, ...admins].map((node) => (
                  <div
                    key={node._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ width: 2, height: 24, background: "#8B000033" }}
                    />
                    <TreeNode
                      node={node}
                      children={childCounts[node._id] || 0}
                      onSelect={setSelected}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <PersonModal person={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
