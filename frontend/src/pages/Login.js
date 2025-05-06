import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(" showOTPField updated:", showOTPField);
  }, [showOTPField]);
  

  //  Handle Login Request
  const [triggerRerender, setTriggerRerender] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      if (response.data.otpRequired) {
        setMessage("OTP sent successfully. Please enter the OTP below.");
        setShowOTPField(true);
        setTriggerRerender(prev => !prev);
      } else if (response.data.token) {
        setMessage("Login successful! Redirecting...");
        // Handle login completion
        completeLogin(response.data.token);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.response?.data?.message || "Login failed.");
    }
  };

  //  Handle OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otp.trim(),
      });

      console.log(" OTP Verification Response:", response.data);

      if (response.data.token) {
        setMessage("Login successful! Redirecting...");
        completeLogin(response.data.token);
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error(" Error verifying OTP:", error);
      setError(error.response?.data?.message || "OTP verification failed.");
    }
  };

  //  Redirect Based on User Role
  const completeLogin = (token) => {
    try {
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token payload:", payload);
      
      // Update AuthContext state immediately
      setCurrentUser(payload);
      localStorage.setItem("currentUser", JSON.stringify(payload));
      
      // Navigate based on role
      switch (payload.role) {
        case "admin":
          navigate("/admin");
          break;
        case "service_provider":
          navigate("/service-provider/dashboard");
          break;
        case "customer":
          navigate("/customer-dashboard");
          break;
        default:
          console.error("Unknown user role:", payload.role);
          navigate("/");
      }
    } catch (error) {
      console.error("Error processing login:", error);
      setError("Error processing login. Please try again.");
    }
  };

  return (
    <div id="login-form-container">
      <h2>Login</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showOTPField ? (
        <form onSubmit={handleVerifyOTP} key={triggerRerender}>
          <div>
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify OTP</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
