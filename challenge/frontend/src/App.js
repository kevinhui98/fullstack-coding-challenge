import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from "./Dashboard";

import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));

  const handleSetToken = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <LoginPage setToken={handleSetToken} />
          }
        />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
