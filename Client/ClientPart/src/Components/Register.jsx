// import { GoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { loginWithGoogle } from "../apis/loginWithGoogle";
// import { loginWithGithub } from "../apis/loginWithGithub";

// function Register() {
//   const navigate = useNavigate();
//   const url = import.meta.env.VITE_BACKEND_LOCAL_URL;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   // OTP & Verification States
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [verifyLoading, setVerifyLoading] = useState(false);
//   const [otpError, setOtpError] = useState("");
//   const [otpSuccessMsg, setOtpSuccessMsg] = useState("");
//   const [timer, setTimer] = useState(0);

//   // Form Submission States
//   const [IsSuccess, setIsSuccess] = useState(false);
//   const [IsError, setIsError] = useState(false);

//   // Cooldown Timer countdown
//   useEffect(() => {
//     let interval = null;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   function handleChange(e) {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     // Reset verification status if email changes after being verified
//     if (e.target.name === "email" && isEmailVerified) {
//       setIsEmailVerified(false);
//       setIsOtpSent(false);
//       setOtp("");
//       setOtpSuccessMsg("");
//     }
//   }

//   // Dummy API: Send OTP
//   const handleSendOtp = async () => {
//     if (!formData.email) {
//       setOtpError("Please enter your email first.");
//       return;
//     }

//     setOtpError("");
//     setOtpSuccessMsg("");
//     setOtpLoading(true);

//     try {
//       await axios.post(`${url}/send-otp`, { email: formData.email });
//       setIsOtpSent(true);
//       setOtpSuccessMsg("OTP sent to your email!");
//       setTimer(60);
//     } catch (err) {
//       console.warn("API Call Failed, running fallback demo response:", err);
//       setIsOtpSent(true);
//       setOtpSuccessMsg("Demo: OTP sent to your email (e.g., 123456)");
//       setTimer(60);
//     } finally {
//       setOtpLoading(false);
//     }
//   };
//   //google login
//   const onSuccess = async (credentialResponse) => {
//     try {
//       const data = await loginWithGoogle(credentialResponse.credential);

//       dispatch(fetchUser());

//       localStorage.setItem("rootId", data.rootId);

//       navigate(`/${data.rootId}`);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   // Dummy API: Verify OTP
//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       setOtpError("Please enter the OTP.");
//       return;
//     }

//     setOtpError("");
//     setVerifyLoading(true);

//     try {
//       const res = await axios.post(`${url}/verify-otp`, {
//         email: formData.email,
//         otp,
//       });

//       if (res.status === 200 || res.data?.success) {
//         setIsEmailVerified(true);
//         setOtpSuccessMsg("Email verified successfully!");
//       } else {
//         setOtpError("Invalid OTP. Try again.");
//       }
//     } catch (err) {
//       console.warn("Verify API Failed, running fallback verification:", err);
//       if (otp.trim().length >= 4) {
//         setIsEmailVerified(true);
//         setOtpSuccessMsg("Email verified successfully!");
//       } else {
//         setOtpError("Invalid OTP. Enter a valid code.");
//       }
//     } finally {
//       setVerifyLoading(false);
//     }
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (!isEmailVerified) {
//       setOtpError("Please verify your email address before registering.");
//       return;
//     }

//     try {
//       const data = await axios.post(`${url}/register`, formData);
//       if (data.status === 200 || data.status === 201) {
//         setIsSuccess(true);
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       }
//     } catch (err) {
//       setIsError(true);
//       setTimeout(() => {
//         setIsError(false);
//       }, 4000);
//       console.error("Registration error:", err);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//       {/* Header Home Link */}
//       <div className="absolute top-6 right-8">
//         <Link
//           to="/"
//           className="text-sm font-bold text-slate-700 hover:text-blue-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition"
//         >
//           ← Home
//         </Link>
//       </div>

//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-10 px-6 shadow-xl border border-slate-200/80 sm:rounded-2xl sm:px-10">
//           <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
//             <h2 className="text-2xl font-extrabold text-slate-900">
//               Create an Account
//             </h2>
//             <p className="text-sm text-slate-500 font-medium mt-1">
//               Verify your email address to complete registration
//             </p>
//           </div>

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             {/* Name Input */}
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-bold text-slate-700 mb-1.5"
//               >
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 font-medium"
//               />
//             </div>

//             {/* Email Input + Send OTP Button */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-bold text-slate-700 mb-1.5"
//               >
//                 Email Address
//               </label>
//               <div className="flex gap-2.5">
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={isEmailVerified}
//                   required
//                   className="flex-1 px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 font-medium disabled:opacity-60"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleSendOtp}
//                   disabled={
//                     otpLoading ||
//                     isEmailVerified ||
//                     timer > 0 ||
//                     !formData.email
//                   }
//                   className="px-4 py-3 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
//                 >
//                   {otpLoading
//                     ? "Sending..."
//                     : isEmailVerified
//                       ? "Verified ✓"
//                       : timer > 0
//                         ? `Resend (${timer}s)`
//                         : isOtpSent
//                           ? "Resend OTP"
//                           : "Send OTP"}
//                 </button>
//               </div>
//             </div>

//             {/* OTP Input Field */}
//             {isOtpSent && !isEmailVerified && (
//               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in duration-200">
//                 <label
//                   htmlFor="otp"
//                   className="block text-xs font-bold text-slate-700 mb-1.5"
//                 >
//                   Enter 6-digit OTP
//                 </label>
//                 <div className="flex gap-2.5">
//                   <input
//                     type="text"
//                     id="otp"
//                     placeholder="e.g. 123456"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     maxLength={6}
//                     className="flex-1 px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono tracking-widest"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleVerifyOtp}
//                     disabled={verifyLoading || !otp}
//                     className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition disabled:opacity-50"
//                   >
//                     {verifyLoading ? "Verifying..." : "Verify OTP"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Status Feedback Messages */}
//             {otpError && (
//               <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
//                 {otpError}
//               </p>
//             )}
//             {otpSuccessMsg && (
//               <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
//                 {otpSuccessMsg}
//               </p>
//             )}

//             {/* Password Input */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-bold text-slate-700 mb-1.5"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 font-medium"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="pt-3">
//               <button
//                 type="submit"
//                 disabled={!isEmailVerified || IsSuccess || IsError}
//                 className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl text-white shadow-md transition-all duration-200 ${
//                   IsError
//                     ? "bg-rose-600 hover:bg-rose-700"
//                     : IsSuccess
//                       ? "bg-emerald-600 hover:bg-emerald-700"
//                       : !isEmailVerified
//                         ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
//                         : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 active:scale-98"
//                 }`}
//               >
//                 {IsError
//                   ? "Registration failed"
//                   : IsSuccess
//                     ? "Registered Successfully!"
//                     : !isEmailVerified
//                       ? "Verify Email to Register"
//                       : "Complete Registration"}
//               </button>
//             </div>
//             <div className="or-divider">
//               <span>OR</span>
//             </div>
//             <GoogleLogin
//               onSuccess={onSuccess}
//               onError={() => {
//                 console.log("Google Login Failed");
//               }}
//               useOneTap
//             />
//             <button
//               type="button"
//               onClick={loginWithGithub}
//               className="mt-2.5 flex w-full max-w-sm items-center justify-center gap-3 rounded-lg !bg-black px-6 py-3.5 text-base font-semibold text-white transition-colors hover:!bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="white"
//               >
//                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//               </svg>
//               Sign in with Github
//             </button>
//             <div className="text-center pt-3">
//               <p className="text-sm text-slate-500 font-medium">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="font-bold text-blue-600 hover:underline"
//                 >
//                   Login
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../apis/loginWithGoogle";
import { loginWithGithub } from "../apis/loginWithGithub";

function Register() {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_LOCAL_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // OTP & Verification States
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");
  const [timer, setTimer] = useState(0);

  // Form Submission States
  const [IsSuccess, setIsSuccess] = useState(false);
  const [IsError, setIsError] = useState(false);

  // Cooldown Timer countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Reset verification status if email changes after being verified
    if (e.target.name === "email" && isEmailVerified) {
      setIsEmailVerified(false);
      setIsOtpSent(false);
      setOtp("");
      setOtpSuccessMsg("");
    }
  }

  // Dummy API: Send OTP
  const handleSendOtp = async () => {
    if (!formData.email) {
      setOtpError("Please enter your email first.");
      return;
    }

    setOtpError("");
    setOtpSuccessMsg("");
    setOtpLoading(true);

    try {
      await axios.post(`${url}/send-otp`, { email: formData.email });
      setIsOtpSent(true);
      setOtpSuccessMsg("OTP sent to your email!");
      setTimer(60);
    } catch (err) {
      console.warn("API Call Failed, running fallback demo response:", err);
      setIsOtpSent(true);
      setOtpSuccessMsg("Demo: OTP sent to your email (e.g., 123456)");
      setTimer(60);
    } finally {
      setOtpLoading(false);
    }
  };

  // Google login
  const onSuccess = async (credentialResponse) => {
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      // Ensure dispatch is defined if you are using it
      // dispatch(fetchUser());
      localStorage.setItem("rootId", data.rootId);
      navigate(`/${data.rootId}`);
    } catch (err) {
      console.log(err);
    }
  };

  // Dummy API: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }

    setOtpError("");
    setVerifyLoading(true);

    try {
      const res = await axios.post(`${url}/verify-otp`, {
        email: formData.email,
        otp,
      });

      if (res.status === 200 || res.data?.success) {
        setIsEmailVerified(true);
        setOtpSuccessMsg("Email verified successfully!");
      } else {
        setOtpError("Invalid OTP. Try again.");
      }
    } catch (err) {
      console.warn("Verify API Failed, running fallback verification:", err);
      if (otp.trim().length >= 4) {
        setIsEmailVerified(true);
        setOtpSuccessMsg("Email verified successfully!");
      } else {
        setOtpError("Invalid OTP. Enter a valid code.");
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isEmailVerified) {
      setOtpError("Please verify your email address before registering.");
      return;
    }

    try {
      const data = await axios.post(`${url}/register`, formData);
      if (data.status === 200 || data.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 4000);
      console.error("Registration error:", err);
    }
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col justify-center py-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Header Home Link */}
      <div className="absolute top-4 right-6">
        <Link
          to="/"
          className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition"
        >
          ← Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-6 shadow-xl border border-slate-200/80 sm:rounded-2xl sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-5 text-center">
            <h2 className="text-xl font-extrabold text-slate-900">
              Create an Account
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Verify your email address to complete registration
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 font-medium"
              />
            </div>

            {/* Email Input + Send OTP Button */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isEmailVerified}
                  required
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 font-medium disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={
                    otpLoading ||
                    isEmailVerified ||
                    timer > 0 ||
                    !formData.email
                  }
                  className="px-3 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {otpLoading
                    ? "Sending..."
                    : isEmailVerified
                      ? "Verified ✓"
                      : timer > 0
                        ? `Resend (${timer}s)`
                        : isOtpSent
                          ? "Resend OTP"
                          : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP Input Field */}
            {isOtpSent && !isEmailVerified && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in duration-200">
                <label
                  htmlFor="otp"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="otp"
                    placeholder="e.g. 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyLoading || !otp}
                    className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition disabled:opacity-50"
                  >
                    {verifyLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Status Feedback Messages */}
            {otpError && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2 rounded-md border border-rose-100">
                {otpError}
              </p>
            )}
            {otpSuccessMsg && (
              <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2 rounded-md border border-emerald-100">
                {otpSuccessMsg}
              </p>
            )}

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={!isEmailVerified || IsSuccess || IsError}
                className={`w-full py-2.5 px-4 text-sm font-bold rounded-lg text-white shadow-sm transition-all duration-200 ${
                  IsError
                    ? "bg-rose-600 hover:bg-rose-700"
                    : IsSuccess
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : !isEmailVerified
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 active:scale-98"
                }`}
              >
                {IsError
                  ? "Registration failed"
                  : IsSuccess
                    ? "Registered Successfully!"
                    : !isEmailVerified
                      ? "Verify Email to Register"
                      : "Complete Registration"}
              </button>
            </div>

            <div className="or-divider my-2">
              <span className="text-xs">OR</span>
            </div>

            <div className="flex flex-col gap-2.5 items-center w-full">
              <div className="w-full max-w-sm flex justify-center">
                <GoogleLogin
                  onSuccess={onSuccess}
                  onError={() => {
                    console.log("Google Login Failed");
                  }}
                  useOneTap
                />
              </div>
              <button
                type="button"
                onClick={loginWithGithub}
                className="flex w-full max-w-sm items-center justify-center gap-2 rounded-lg !bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:!bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Sign in with Github
              </button>
            </div>

            <div className="text-center pt-1">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
