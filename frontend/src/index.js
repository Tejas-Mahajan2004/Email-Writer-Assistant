import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./config";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
);
