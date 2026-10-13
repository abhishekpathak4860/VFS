import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_LOCAL_URL;

export default function ManagerPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/users`, { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load users."),
      );
  }, []);

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Manager Dashboard</h1>
      <p>View user login status.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "24px",
            }}
          >
            <thead>
              <tr>
                <th style={cell}>Name</th>
                <th style={cell}>User ID</th>
                <th style={cell}>Login Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={cell}>{user.name}</td>
                  <td style={cell}>{user.id}</td>
                  <td style={cell}>
                    {user.isLogin ? "Logged in" : "Logged out"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const cell = {
  padding: "12px",
  border: "1px solid #e5e7eb",
  textAlign: "left",
};
