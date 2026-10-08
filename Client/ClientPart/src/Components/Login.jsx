import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../apis/loginWithGoogle";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const onSuccess = async (credentialResponse) => {
    try {
      const data = await loginWithGoogle(credentialResponse.credential);

      dispatch(fetchUser());

      localStorage.setItem("rootId", data.rootId);

      navigate(`/${data.rootId}`);
    } catch (err) {
      console.log(err);
    }
  };

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_LOCAL_URL}/login`,
        formData,
        {
          withCredentials: true,
        },
      );
      //  rootId:
      if (res.status == 200) {
        dispatch(fetchUser());
        localStorage.setItem("rootId", res.data.rootId);
        setTimeout(() => {
          navigate(`/${res.data.rootId}`);
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "20px",
          gap: "8px",
        }}
      >
        <Link to="/">Home</Link>
      </div>

      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Login</button>
          <div className="or-divider">
            <span>OR</span>
          </div>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
              console.log("Google Login Failed");
            }}
            useOneTap
          />
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
}
