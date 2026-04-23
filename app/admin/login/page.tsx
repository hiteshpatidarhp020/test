"use client";

import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      document.cookie = "admin=true";
      window.location.href = "/admin/dashboard";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Admin Login</h3>

      <input
        className="form-control mb-2"
        placeholder="Username"
        onChange={(e) =>
          setData({ ...data, username: e.target.value })
        }
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button
        className="btn btn-dark w-100"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}