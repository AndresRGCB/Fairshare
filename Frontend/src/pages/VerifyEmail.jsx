import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatus("✅ Email verified! Redirecting to login...");
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus(`❌ ${data.detail || "Verification failed."}`);
        }
      } catch (err) {
        console.error(err);
        setStatus("Error verifying email. Please try again later.");
      }
    };

    verify();
  }, [navigate]);

  return (
    <div className="centered-page">
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
