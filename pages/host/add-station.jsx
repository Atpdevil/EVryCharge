// pages/host/add-station.jsx
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useStore } from "../../components/store";
import { v4 as uuidv4 } from "uuid";
import HostSidebar from "../../components/Host/HostSidebar";

const AddStationMap = dynamic(
  () => import("../../components/Host/AddStationMap"),
  { ssr: false }
);

export default function AddStationPage() {
  const [form, setForm] = useState({
    name: "",
    city: "",
    pincode: "",
    price: "",
    plug: "Type 2",
    status: "Available",
  });
  const [pin, setPin] = useState(null);

  const addStation = useStore((s) => s.addStation);
  const loadStations = useStore((s) => s.loadStationsFromLocal);

  useEffect(() => {
    loadStations();
  }, []);

  function submitStation() {
    if (!pin) {
      alert("Please place a pin on map.");
      return;
    }
    if (!form.name || !form.price) {
      alert("Fill required fields.");
      return;
    }

    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem("ev_user"));
    } catch {}

    const station = {
      id: uuidv4(),
      ownerId: currentUser?.id ?? "host_anon",
      name: form.name,
      lat: Number(pin.lat),
      lng: Number(pin.lng),
      price: Number(form.price),
      plug: form.plug,
      status: form.status,
      city: form.city,
      pincode: form.pincode,
      createdAt: Date.now(),
    };

    addStation(station);
    alert("Station saved");
    window.location.href = "/host/stations";
  }

  return (
    <div className="flex min-h-screen">
      <HostSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Add Charging Station</h1>

        <div className="flex gap-6">
          <div className="w-1/2 h-[70vh] border rounded overflow-hidden shadow">
            <AddStationMap onPick={(coords) => setPin(coords)} />
          </div>

          <div className="w-1/2 bg-white p-6 rounded shadow">
            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Station Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Price (₹/kWh)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <select
              className="border p-3 rounded w-full mb-3"
              value={form.plug}
              onChange={(e) => setForm({ ...form, plug: e.target.value })}
            >
              <option>Type 2</option>
              <option>CCS2</option>
              <option>GB/T</option>
            </select>

            <select
              className="border p-3 rounded w-full mb-4"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Available</option>
              <option>Busy</option>
              <option>Offline</option>
            </select>

            <button
              onClick={submitStation}
              className="bg-green-600 text-white p-3 rounded w-full"
            >
              Save Station
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
