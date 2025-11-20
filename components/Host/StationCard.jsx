"use client";
import { useState } from "react";
import { useStore } from "../store";

export default function StationCard({ station }) {
  const deleteStation = useStore((s) => s.deleteStation);
  const updateStation = useStore((s) => s.updateStation);
  const bookings = useStore((s) => s.bookings);

  const [isEditing, setIsEditing] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const [editData, setEditData] = useState({
    name: station.name,
    price: station.price,
    status: station.status,
  });

  // Get latest booking for this station
  const latestBooking = bookings
    .filter((b) => b.stationId === station.id)
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  function saveEdit() {
    updateStation(station.id, editData);
    setIsEditing(false);
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">

      {/* ---------- USER POPUP ---------- */}
      {showUserInfo && latestBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-[350px]">
            <h3 className="text-xl font-semibold mb-3">User Information</h3>

            <p><b>Name:</b> {latestBooking.userName}</p>
            <p><b>Email:</b> {latestBooking.userEmail}</p>
            <p><b>Date:</b> {latestBooking.date}</p>
            <p><b>Time:</b> {latestBooking.time}</p>
            <p><b>Duration:</b> {latestBooking.durationMinutes} min</p>
            <p><b>Status:</b> {latestBooking.status}</p>

            <button
              onClick={() => setShowUserInfo(false)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---------- NORMAL CARD ---------- */}
      {!isEditing ? (
        <>
          <h2 className="text-xl font-semibold">{station.name}</h2>

          <p className="text-gray-600">Status: {station.status}</p>
          <p className="text-gray-600">Price: ₹{station.price}/kWh</p>

          <p className="text-gray-600 mt-1">
            Revenue: <span className="font-semibold">₹{station.revenue || 0}</span>
          </p>

          <p className="text-gray-600">
            Bookings: <span className="font-semibold">{station.bookings || 0}</span>
          </p>

          <button
            className="mt-3 p-2 bg-green-500 text-white rounded mr-2"
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${station.lat},${station.lng}`,
                "_blank"
              )
            }
          >
            View on Map
          </button>

          <button
            className="mt-3 p-2 bg-green-500 text-white rounded mr-2"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>

          <button
            className="mt-3 p-2 bg-green-500 text-white rounded mr-2"
            onClick={() => deleteStation(station.id)}
          >
            Delete
          </button>

          {/* ⭐ SHOW ONLY IF BOOKINGS > 0 */}
          {station.bookings > 0 && (
            <button
              className="p-2 bg-green-600 text-white rounded"
              onClick={() => setShowUserInfo(true)}
            >
              View User Info
            </button>
          )}
        </>
      ) : (
        <>
          <input
            className="border p-2 w-full mb-2 rounded"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <input
            className="border p-2 w-full mb-2 rounded"
            type="number"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
          />
          <select
            className="border p-2 w-full mb-2 rounded"
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
          >
            <option>Available</option>
            <option>Busy</option>
            <option>Offline</option>
          </select>

          <button className="p-2 bg-green-600 text-white rounded mr-2" onClick={saveEdit}>
            Save
          </button>
          <button className="p-2 bg-gray-400 text-white rounded" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
