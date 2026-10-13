import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_LOCAL_URL;

export default function AdminManagerLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/admin-manager/login`,
        { role, passkey },
        { withCredentials: true },
      );

      navigate(res.data.role === "admin" ? "/admin" : "/manager", {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.icon}>🔐</div>
        <h1 style={styles.heading}>Staff Portal</h1>
        <p style={styles.subtitle}>Sign in to your dashboard</p>

        <label style={styles.label}>Select role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>

        <label style={styles.label}>Passkey</label>
        <input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          placeholder="Enter your passkey"
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <Link to="/login" style={styles.link}>
          Back to user login
        </Link>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "36px",
    borderRadius: "18px",
    boxShadow: "0 12px 40px rgba(15, 23, 42, 0.10)",
    boxSizing: "border-box",
  },
  icon: { fontSize: "36px", textAlign: "center" },
  heading: {
    textAlign: "center",
    marginBottom: "8px",
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "28px",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff",
  },
  button: {
    width: "100%",
    padding: "13px",
    marginTop: "24px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: { color: "#dc2626", fontSize: "14px", marginTop: "12px" },
  link: {
    display: "block",
    textAlign: "center",
    marginTop: "20px",
    color: "#4f46e5",
    textDecoration: "none",
  },
};
