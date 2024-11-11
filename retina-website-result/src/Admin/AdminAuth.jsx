import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const AdminAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  const defaultPassword = "Raj@RetinaAdmin.2024"; 

  const handleLogin = () => {
    if (inputPassword === defaultPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Try again.");
    }
  };

  if (isAuthenticated) {
    return children; // Render the protected route
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
      <input
        type="password"
        placeholder="Enter Admin Password"
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
        className="input input-bordered mb-4"
      />
      <button onClick={handleLogin} className="btn btn-primary">
        Enter Admin Panel
      </button>
    </div>
  );
};

export default AdminAuth;
