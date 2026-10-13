import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/userSlice";

export default function StaffLayout({ role, children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_LOCAL_URL}/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(logoutUser());
      navigate("/admin-manager-login", { replace: true });
    }
  };

  const isAdmin = role === "admin";

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <header
        style={{
          background: "#111827",
          color: "white",
          padding: "18px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            {isAdmin ? "Admin Dashboard" : "Manager Dashboard"}
          </h2>
          <small style={{ color: "#d1d5db" }}>
            {user?.name || role} · {role.toUpperCase()}
          </small>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: "24px" }}>{children}</main>
    </div>
  );
}
