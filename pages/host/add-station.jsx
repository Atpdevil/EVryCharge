"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useStore } from "../../components/store";
import { v4 as uuidv4 } from "uuid";

// Load map component without SSR
const AddStationMap = dynamic(
  () => import("../../components/Host/AddStationMap"),
  { ssr: false }
);

export default function AddStationPage() {
  /* -------------------------
      FORM STATE
  --------------------------*/
  const [form, setForm] = useState({
    name: "",
    city: "",
    pincode: "",
    price: "",
    plug: "Type 2",
    status: "Available",

    // NEW DEFAULTS (important for filters)
    supportedModels: [],
    supportedVehicleTypes: [],
  });

  /* -------------------------
      MAP PIN STATE
  --------------------------*/
  const [pin, setPin] = useState(null);

  /* -------------------------
      STORE FUNCTIONS
  --------------------------*/
  const addStation = useStore((s) => s.addStation);
  const loadStationsFromLocal = useStore((s) => s.loadStationsFromLocal);

  useEffect(() => {
    loadStationsFromLocal();
  }, []);

  /* -------------------------
      SUBMIT STATION
  --------------------------*/
  function submitStation() {
    if (!pin) {
      alert("Please select location on the map.");
      return;
    }

    if (!form.name || !form.price) {
      alert("Please fill all required fields.");
      return;
    }

    const station = {
      id: uuidv4(),
      name: form.name,

      // coordinates from map pin
      lat: Number(pin.lat),
      lng: Number(pin.lng),

      price: Number(form.price),
      plug: form.plug,
      status: form.status,
      city: form.city,
      pincode: form.pincode,

      // VERY IMPORTANT for User Map filters
      supportedModels: form.supportedModels || [],
      supportedVehicleTypes: form.supportedVehicleTypes || [],

      createdAt: Date.now(),
    };

    addStation(station);

    alert("Station added successfully!");
    window.location.href = "/host/dashboard";
  }

  /* -------------------------
      RENDER COMPONENT
  --------------------------*/
  return (
    <div className="p-6 flex gap-6">
      {/* MAP SECTION */}
      <div className="w-1/2 h-[80vh] border rounded-xl overflow-hidden shadow">
        <AddStationMap onPick={(coords) => setPin(coords)} />
      </div>

      {/* FORM SECTION */}
      <div className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">Add Charging Station</h1>

        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
          <input
            className="border p-3 rounded"
            placeholder="Station Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />

          <input
            className="border p-3 rounded"
            placeholder="Price (₹/kWh)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <select
            className="border p-3 rounded"
            value={form.plug}
            onChange={(e) => setForm({ ...form, plug: e.target.value })}
          >
            <option>Type 2</option>
            <option>CCS2</option>
            <option>GB/T</option>
          </select>

          <select
            className="border p-3 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Available</option>
            <option>Busy</option>
            <option>Offline</option>
          </select>

          {/* optional future fields */}
          {/* supportedModels and supportedVehicleTypes stay empty for now */}

          <button
            onClick={submitStation}
            className="bg-green-600 text-white p-3 rounded"
          >
            Save Station
          </button>
        </div>
      </div>
    </div>
  );
}
