import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUser } from "../redux/userSlice";

export default function StaffRoute({ allowedRole, children }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    dispatch(fetchUser())
      .unwrap()
      .then((data) => {
        if (!active) return;
        setUser(data);
        setStatus("done");
      })
      .catch(() => {
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  if (status === "checking") {
    return (
      <p style={{ textAlign: "center", marginTop: "80px" }}>
        Checking session...
      </p>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin-manager-login" replace />;
  }

  if (user?.role !== allowedRole) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "manager") return <Navigate to="/manager" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
