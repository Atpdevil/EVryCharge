// pages/login/host.jsx
import React, { useState } from "react";
import GoogleAuthButton from "../../components/GoogleAuthButton";

export default function HostSignup() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const handleSignup = () => {
    const user = { role: "host", ...form };
    localStorage.setItem("ev_user", JSON.stringify(user));
    window.location.href = "/host/dashboard";
  };

  const handleGoogle = (data) => {
    const user = {
      role: "host",
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
    localStorage.setItem("ev_user", JSON.stringify(user));
    window.location.href = "/host/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign up as Host</h1>

        <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 login-card">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 border rounded"
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-3 border rounded"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-3 border rounded"
          />

          <button onClick={handleSignup} className="bg-blue-600 text-white p-3 rounded">Signup</button>

          <div className="text-center text-gray-500">OR</div>

          <GoogleAuthButton onSuccess={handleGoogle} />
        </div>
      </div>
    </div>
  );
}
