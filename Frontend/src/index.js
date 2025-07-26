import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import './index.css';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="364874495698-lec5sa5n63eu4l65jskm1v27ief0n83t.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
