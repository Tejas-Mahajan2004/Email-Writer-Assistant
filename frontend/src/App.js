import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { BACKEND_URL } from "./config";
import "./App.css";

function App() {
  // ================= STATE =================
  const [token, setToken] = useState("");
const [user, setUser] = useState(null);

  const [userMessage, setUserMessage] = useState("");
  const [tone, setTone] = useState("formal");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // ================= FETCH USER HISTORY =================
  const fetchReplies = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/replies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

// auto-clear old session on first load
  useEffect(() => {
  if (!localStorage.getItem("token")) {
    setToken("");
    setUser(null);
  }
}, []);

  // Load history when user logs in
  useEffect(() => {
  if (token) {
    fetchReplies();

    //  clear previous session UI
    setSubject("");
    setBody("");
    setUserMessage("");
  }
}, [token]);

  // ================= AUTH (LOGIN / SIGNUP) =================
  const handleAuth = async () => {

  //  ADD VALIDATION HERE (TOP)
  if (!email || !password) {
    return alert("Email and password are required");
  }

  try {
    const url = `${BACKEND_URL}/api/auth/${authMode}`;

    const res = await axios.post(url, {
      email,
      password,
      name: email.split("@")[0],
    });

    setToken(res.data.token);
    setUser(res.data.user);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

  } catch (err) {
    alert(err.response?.data?.message || "Authentication failed");
  }
};
  // ================= GOOGLE LOGIN =================
  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/google-login`, {
      tokenId: credentialResponse.credential,
    });

    setToken(res.data.token);
    setUser(res.data.user);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

  } catch (err) {
    alert(err.response?.data?.message || "Google login failed");
  }
};

  // ================= GENERATE EMAIL =================
  const handleGenerate = async () => {
  if (!userMessage) return alert("Please enter a message");

  try {
    setLoading(true);

    const res = await axios.post(
      `${BACKEND_URL}/api/replies/generate-reply`,
      { userMessage, tone },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSubject(res.data.subject);
    setBody(res.data.body);

  } catch (err) {
    if (err.response?.status === 401) {
      alert("Session expired. Please login again.");
      handleLogout();
    } else {
      alert("Failed to generate reply");
    }
  } finally {
    setLoading(false);
  }
};

  // ================= LOGOUT =================
  const handleLogout = () => {
  setToken("");
  setUser(null);

  //  clear generated email
  setSubject("");
  setBody("");
  setUserMessage("");

  //  clear history UI
  setReplies([]);
  setShowHistory(false);
  setShowDropdown(false);

  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

  // ================= HISTORY =================
  const handleHistoryClick = async () => {
    await fetchReplies();
    setShowHistory(true);
    setShowDropdown(false);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">AutoMail AI ✉️</h1>

      {/* ================= AUTH UI ================= */}
      {!token ? (
        <div className="auth-container">
          <h2>{authMode === "login" ? "Login" : "Sign Up"}</h2>

          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary" onClick={handleAuth}>
            {authMode === "login" ? "Login" : "Sign Up"}
          </button>

          <p
            className="switch-mode"
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            {authMode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </p>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google login failed")}
          />
        </div>
      ) : (
        <div className="main-container">

          {/* ================= PROFILE ================= */}
          <div className="top-bar">
            <div className="profile-container">
              <div
                className="profile-circle"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user?.email.charAt(0).toUpperCase()}
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <button onClick={handleLogout}>Logout</button>
                  <button onClick={handleHistoryClick}>History</button>
                </div>
              )}
            </div>
          </div>

          {/* ================= INPUT ================= */}
          <textarea
            className="input-box"
            placeholder="Enter message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />

          {/* ================= TONE SELECT ================= */}
          <select
            className="tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="appreciative">Appreciative</option>
            <option value="polite">Polite</option>
            <option value="apologetic">Apologetic</option>
          </select>

          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Reply"}
          </button>

          {/* ================= CURRENT RESULT ================= */}
          {subject && (
            <div className="current-reply">
              <h3>{subject}</h3>
              <p>{body}</p>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gmail"
              >
                Compose in Gmail
              </a>
            </div>
          )}

          {/* ================= HISTORY ================= */}
          {showHistory && (
            <div className="previous-replies">
              <h2>Reply History</h2>

              <button onClick={() => setShowHistory(false)}>Close</button>

              {replies.map((reply, index) => (
                <div key={index} className="reply-item">
                  <strong>{reply.subject}</strong>
                  <p>{reply.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;