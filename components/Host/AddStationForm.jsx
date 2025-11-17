import { useState } from "react";

export default function AddStationForm() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    plug: "",
    status: "Available"
  });

  const submitForm = () => {
    if (!form.name || !form.price)
      return alert("Fill all fields");

    alert("Station added successfully!");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      <h3 className="text-xl font-semibold mb-4">Add Charging Station</h3>

      <input
        className="border p-3 rounded w-full mb-3"
        placeholder="Station Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="border p-3 rounded w-full mb-3"
        placeholder="Price (₹/kWh)"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <select
        className="border p-3 rounded w-full mb-3"
        value={form.plug}
        onChange={(e) => setForm({ ...form, plug: e.target.value })}
      >
        <option value="">Select Plug Type</option>
        <option>CCS2</option>
        <option>Type 2</option>
        <option>GB/T</option>
      </select>

      <button 
        className="bg-green-600 text-white p-3 rounded w-full"
        onClick={submitForm}
      >
        Submit
      </button>
    </div>
  );
}
