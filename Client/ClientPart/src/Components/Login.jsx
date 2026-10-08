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
          />
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
}

// Google credential: eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk0M2EzYTVkN2Q5MTk2MjVhNDU0ZTQ4OWI3NWMyOWFkYWI1N2FjYmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDIzNzgyNDQ3OTEtaGRwMnM3aG9hdmY0aHY3NDhhYmg2Y2NtbGE1b2dtZ2EuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMDIzNzgyNDQ3OTEtaGRwMnM3aG9hdmY0aHY3NDhhYmg2Y2NtbGE1b2dtZ2EuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTY2MTAzNjAwOTE4ODI4ODgwMjEiLCJlbWFpbCI6ImFiaGlzaGVrcGF0aGFrMzc3MzNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc5MTE3MDIyNiwibmFtZSI6IkFiaGlzaGVrIFBhdGhhayIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKeFpadnlfSnUxOUlFQW9FM1FDbkhDZ0U0LXRnbWxFWnlsczhwWWxzZGVvVTc4VDE5YT1zOTYtYyIsImdpdmVuX25hbWUiOiJBYmhpc2hlayIsImZhbWlseV9uYW1lIjoiUGF0aGFrIiwiaWF0IjoxNzkxMTcwNTI2LCJleHAiOjE3OTExNzQxMjYsImp0aSI6Ijg3MjkwM2Y0MjliNmMzODUwMmUwOTQ2MjYyNDZkZmY5YTNjYTliNzYifQ.EmAcmiNCD3zUgEcEBqNiQIa32291QEsvS-Cc1lW4A8xIwNJVpgoHbex349f-WH1pk4AMDVPa9NJaXuBeyIFemgqjkcBx6kxtlQEG_8EMiBHUliOaQVwuPBPhO45eHsz3rfsy55oH7imNVX0IWbdW23-oMomm8g1QWvSne6jaXHZCjIBY15y5x5ZG33gZjA2xb60xcV5d-fn-FznR00ASxUoBK07-_ourxZehrGkl1kIyaiStbKLvEzVJpFwz2lX-J-3uPfiaT37uD9Curb8jJn0PX-JgiTxZs6ESbKjGsW9GNBqgUNkTklaOfsewHaE8n3IXZm56tjrKd_RindAhXQ
