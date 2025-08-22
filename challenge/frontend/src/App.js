import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from "./Dashboard";

import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [username, setUsername] = useState(() => localStorage.getItem("user"));
  const handleSetUser = (newUser) => {
    localStorage.setItem("user", newUser);
    setUsername(username);
  };
  const handleSetToken = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <LoginPage setToken={handleSetToken} setUser={handleSetUser} />
          }
        />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard token={token} onLogout={handleLogout} user={username} /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
