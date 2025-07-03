import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import React from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate(); // ✅ create navigation hook
  const mode = location.pathname.includes("register") ? "register" : "login";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/api-auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ✅ needed to include cookie
    });

    const data = await res.json();
    if (res.ok) {
  const { userId } = data;
  localStorage.setItem("userId", userId); // ✅ store userId in localStorage
  alert(`${mode === "login" ? "Logged in" : "Registered"} successfully`);
  navigate("/"); // ✅ redirect after login
}
else {
      alert(data.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className={`w-full text-white px-4 py-2 rounded ${
            mode === "login" ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
