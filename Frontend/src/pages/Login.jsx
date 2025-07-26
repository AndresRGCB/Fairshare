import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import "../styles/login.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log(API_BASE_URL)

const Login = () => {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setLoginEmail("");
    setLoginPassword("");
    setName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setConfirmPassword("");
    setEmailSent(false);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
      } else if (response.status === 409) {
        alert("🚫 That email is already taken. Please try a different one.");
      } else {
        alert(`Registration failed: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error during signup:", err);
      alert("Error connecting to the server. Please try again.");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const tokenParts = data.access_token.split(".");
        const decodedPayload = JSON.parse(atob(tokenParts[1]));

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", decodedPayload.user_id);

        navigate("/home");
      } else if (response.status === 403) {
        // User not verified
        await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // ✅ Correct format
        });
        setSignUpEmail(email); // to reuse it in the resend button
        setEmailSent(true);
      } else {
        alert("Login failed: " + data.detail);
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("Error during login. Please try again.");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin(loginEmail, loginPassword);
  };

  return (
    <div className="login-container">
      <div className="left-column">
        <img src="/logo.png" alt="Logo" className="logo" />

        <div className="form-wrapper">
          <AnimatePresence mode="wait">
            {emailSent ? (
              <motion.div
              key="confirmation"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="form-container"
              style={{
                fontFamily: '"Berlin Sans FB", sans-serif',
                textAlign: "center",
                padding: "3rem",
                color: "#333",
              }}
            >
              <img
                src="/email.png"
                alt="Email Sent"
                style={{ width: "200px", marginBottom: "2rem" }}
              />
        
              <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                📧 Verification Email Sent
              </h2>
              <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
                Please check your inbox and verify your email to continue.
              </p>
        
              <button
              onClick={async () => {
                try {
                  const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: signUpEmail }),
                  });

                  const data = await response.json();

                  console.log("📦 Response from /resend-verification:", data); // ✅ Log full response details

                  if (response.ok) {
                    alert(data.message || "Verification email resent.");
                  } else {
                    alert(`❌ Error: ${data.detail || "Unknown issue"}`);
                  }
                } catch (err) {
                  console.error("🚨 Failed to resend email:", err);
                  alert("Error resending verification email.");
                }
              }}
              style={{
                fontSize: "1.5rem",
                padding: "0.75rem 2rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Resend Verification Email
            </button>

            </motion.div>
            ) : isLogin ? (
              <motion.div
                key="login"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="form-container"
              >
                <LoginForm
                  email={loginEmail}
                  setEmail={setLoginEmail}
                  password={loginPassword}
                  setPassword={setLoginPassword}
                  handleSubmit={handleLoginSubmit}
                  toggleForm={toggleForm}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="form-container"
              >
                <SignUpForm
                  name={name}
                  setName={setName}
                  email={signUpEmail}
                  setEmail={setSignUpEmail}
                  password={signUpPassword}
                  setPassword={setSignUpPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  handleSubmit={handleSignUpSubmit}
                  toggleForm={toggleForm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="right-column">
        <div className="right-column-wrapper">
          <img src="/4575-removebg.png" alt="Illustration" className="right-column-image" />
        </div>
      </div>
    </div>
  );
};

export default Login;
