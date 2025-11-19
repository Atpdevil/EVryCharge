"use client";
import { useState } from "react";
import { useStore } from "../store";

export default function StationCard({ station }) {
  const deleteStation = useStore((s) => s.deleteStation);
  const updateStation = useStore((s) => s.updateStation);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: station.name,
    price: station.price,
    status: station.status,
  });

  function saveEdit() {
    updateStation(station.id, editData);
    setIsEditing(false);
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      {!isEditing ? (
        <>
          <h2 className="text-xl font-semibold">{station.name}</h2>

          <p className="text-gray-600">Status: {station.status}</p>
          <p className="text-gray-600">Price: ₹{station.price}/kWh</p>

          {/* Revenue placeholder */}
          <p className="text-gray-600 mt-1">
            Revenue: <span className="font-semibold">₹{station.revenue || 0}</span>
          </p>

          {/* Booking count placeholder */}
          <p className="text-gray-600">
            Bookings: <span className="font-semibold">{station.bookings || 0}</span>
          </p>

          {/* View on Map */}
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

          {/* Edit */}
          <button
            className="mt-3 p-2 bg-green-500 text-white rounded mr-2"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>

          {/* Delete */}
          <button
            className="mt-3 p-2 bg-green-500 text-white rounded mr-2"
            onClick={() => deleteStation(station.id)}
          >
            Delete
          </button>
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
