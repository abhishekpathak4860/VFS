import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_LOCAL_URL;

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Please log in again."
            : response.status === 403
              ? "Admin access required."
              : "Failed to fetch users.",
        );
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to log out this user from all devices?",
      )
    ) {
      return;
    }

    try {
      setActionLoading(userId);

      const response = await fetch(`${API_URL}/users/${userId}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to log out user.");
      }

      window.alert(data.message || "User logged out successfully.");

      await fetchUsers();
    } catch (err) {
      window.alert(err.message || "Unable to log out user.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(query) ||
      String(user.id || "")
        .toLowerCase()
        .includes(query)
    );
  });

  const loggedInCount = users.filter((user) => user.isLogin).length;

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        .user-row:hover { background: #f8fafc; }
        .user-action:hover { opacity: .82; }
        .search-box:focus {
          outline: 2px solid #c7d2fe;
          border-color: #6366f1;
        }
        @media (max-width: 650px) {
          .dashboard-header {
            align-items: flex-start !important;
            flex-direction: column;
          }
          .table-wrap { overflow-x: auto; }
        }
      `}</style>

      <header style={styles.header}>
        <div>
          <div style={styles.brand}>
            <span style={styles.brandIcon}>A</span>
            Admin Console
          </div>
          <p style={styles.breadcrumb}>Dashboard / User Management</p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          style={styles.refreshButton}
        >
          ↻ Refresh
        </button>
      </header>

      <main style={styles.main}>
        <div className="dashboard-header" style={styles.titleRow}>
          <div>
            <h1 style={styles.title}>User Management</h1>
            <p style={styles.subtitle}>
              Monitor users and manage their active sessions.
            </p>
          </div>

          <div style={styles.totalBadge}>{users.length} total users</div>
        </div>

        <div style={styles.statsGrid}>
          <StatCard
            label="Total Users"
            value={users.length}
            icon="♙"
            color="#6366f1"
          />

          <StatCard
            label="Logged In"
            value={loggedInCount}
            icon="↗"
            color="#059669"
          />

          <StatCard
            label="Logged Out"
            value={users.length - loggedInCount}
            icon="↙"
            color="#d97706"
          />
        </div>

        <section style={styles.panel}>
          <div className="dashboard-header" style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>All Users</h2>
              <p style={styles.panelSubtitle}>
                View account details and session status.
              </p>
            </div>

            <input
              className="search-box"
              type="text"
              placeholder="Search name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.search}
            />
          </div>

          {loading ? (
            <div style={styles.message}>Loading users...</div>
          ) : error ? (
            <div style={styles.error}>
              <p>{error}</p>
              <button onClick={fetchUsers} style={styles.retryButton}>
                Try again
              </button>
            </div>
          ) : (
            <div className="table-wrap">
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>USER</th>
                    <th style={styles.th}>USER ID</th>
                    <th style={styles.th}>LOGIN STATUS</th>
                    <th style={styles.th}>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="user-row">
                      <td style={styles.td}>
                        <div style={styles.userInfo}>
                          <div style={styles.avatar}>
                            {(user.name || "U").trim().charAt(0).toUpperCase()}
                          </div>
                          <span style={styles.userName}>
                            {user.name || "Unnamed User"}
                          </span>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.userId}>{user.id}</span>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            ...(user.isLogin ? styles.online : styles.offline),
                          }}
                        >
                          <span
                            style={{
                              ...styles.statusDot,
                              background: user.isLogin ? "#10b981" : "#94a3b8",
                            }}
                          />
                          {user.isLogin ? "Logged In" : "Logged Out"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {user.isLogin ? (
                          <button
                            className="user-action"
                            onClick={() => handleLogout(user.id)}
                            disabled={actionLoading === user.id}
                            style={{
                              ...styles.logoutButton,
                              opacity: actionLoading === user.id ? 0.6 : 1,
                            }}
                          >
                            {actionLoading === user.id
                              ? "Logging out..."
                              : "Log out"}
                          </button>
                        ) : (
                          <span style={styles.noAction}>No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div style={styles.empty}>
                  {search ? "No users match your search." : "No users found."}
                </div>
              )}
            </div>
          )}

          <div style={styles.footer}>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={styles.statCard}>
      <div>
        <p style={styles.statLabel}>{label}</p>
        <h2 style={styles.statValue}>{value}</h2>
      </div>
      <div
        style={{
          ...styles.statIcon,
          color,
          background: `${color}14`,
        }}
      >
        {icon}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #e8edf4",
    padding: "18px 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 750,
    fontSize: 17,
  },
  brandIcon: {
    display: "grid",
    placeItems: "center",
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#4f46e5",
    color: "#fff",
  },
  breadcrumb: {
    margin: "7px 0 0",
    color: "#8993a5",
    fontSize: 12,
  },
  refreshButton: {
    padding: "10px 15px",
    background: "#fff",
    border: "1px solid #dfe5ef",
    borderRadius: 9,
    color: "#334155",
    fontWeight: 600,
    cursor: "pointer",
  },
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "36px 24px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 26,
  },
  title: {
    margin: 0,
    fontSize: 28,
    letterSpacing: "-0.8px",
  },
  subtitle: {
    color: "#778196",
    margin: "8px 0 0",
    fontSize: 14,
  },
  totalBadge: {
    background: "#eef2ff",
    color: "#4f46e5",
    borderRadius: 8,
    padding: "9px 13px",
    fontSize: 13,
    fontWeight: 650,
    whiteSpace: "nowrap",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
    marginBottom: 28,
  },
  statCard: {
    background: "#fff",
    border: "1px solid #e8edf4",
    borderRadius: 13,
    padding: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statLabel: {
    color: "#778196",
    fontSize: 13,
    margin: 0,
  },
  statValue: {
    fontSize: 29,
    margin: "10px 0 0",
    letterSpacing: "-0.8px",
  },
  statIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontSize: 23,
  },
  panel: {
    background: "#fff",
    border: "1px solid #e8edf4",
    borderRadius: 14,
    overflow: "hidden",
  },
  panelHeader: {
    padding: "23px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    borderBottom: "1px solid #edf0f5",
  },
  panelTitle: {
    margin: 0,
    fontSize: 17,
  },
  panelSubtitle: {
    margin: "6px 0 0",
    color: "#8993a5",
    fontSize: 13,
  },
  search: {
    width: "min(100%, 270px)",
    padding: "11px 13px",
    border: "1px solid #dfe5ef",
    borderRadius: 9,
    fontSize: 13,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    minWidth: 650,
  },
  th: {
    background: "#fafbfe",
    color: "#8490a4",
    fontSize: 11,
    letterSpacing: "0.7px",
    fontWeight: 700,
    padding: "15px 20px",
    borderBottom: "1px solid #edf0f5",
  },
  td: {
    padding: "17px 20px",
    borderBottom: "1px solid #f0f2f6",
    fontSize: 13,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 11,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "grid",
    placeItems: "center",
    fontWeight: 750,
    flexShrink: 0,
  },
  userName: {
    fontWeight: 650,
    color: "#263248",
  },
  userId: {
    color: "#788398",
    fontSize: 12,
    overflowWrap: "anywhere",
  },
  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "7px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  online: {
    color: "#047857",
    background: "#ecfdf5",
  },
  offline: {
    color: "#64748b",
    background: "#f1f5f9",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  logoutButton: {
    padding: "8px 12px",
    background: "#fff1f2",
    color: "#e11d48",
    border: "1px solid #ffe0e5",
    borderRadius: 8,
    fontWeight: 650,
    fontSize: 12,
    cursor: "pointer",
  },
  noAction: {
    color: "#a0a8b7",
    fontSize: 12,
  },
  message: {
    padding: 45,
    textAlign: "center",
    color: "#778196",
    fontSize: 14,
  },
  error: {
    padding: 30,
    textAlign: "center",
    color: "#be123c",
  },
  retryButton: {
    padding: "9px 14px",
    background: "#4f46e5",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: 35,
    color: "#8993a5",
    fontSize: 14,
  },
  footer: {
    padding: "15px 24px",
    color: "#8993a5",
    fontSize: 12,
    background: "#fcfcfe",
  },
};
