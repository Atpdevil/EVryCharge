"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../components/store";
import UserSidebar from "../../components/User/UserSidebar";

export default function MyBookingsPage() {
  const loadBookings = useStore((s) => s.loadBookingsFromLocal);
  const bookings = useStore((s) => s.bookings);
  const cancelBooking = useStore((s) => s.cancelBooking);
  const deleteBooking = useStore((s) => s.deleteBooking);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadBookings();
    const u = JSON.parse(localStorage.getItem("ev_user") || "{}");
    setUserId(u.id);
  }, []);

  const my = bookings.filter((b) => b.userId === userId);

  function openMaps(b) {
    window.open(
      `https://www.google.com/maps/?q=${b.stationLat},${b.stationLng}`,
      "_blank"
    );
  }

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

        {my.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="grid gap-4">
            {my.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white shadow rounded flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold">{b.stationName}</div>
                  <div className="text-sm text-gray-700">
                    Price: ₹{b.pricePerKwh}/kWh
                  </div>
                  <div className="text-sm">
                    Date: {b.date} {b.time}
                  </div>
                  <div className="text-sm">
                    Duration: {b.durationMinutes} min
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      b.status === "Cancelled"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    Status: {b.status}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => openMaps(b)}
                  >
                    View in Map
                  </button>

                  {/* Show Cancel button only for booked ones */}
                  {b.status !== "Cancelled" && (
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {/* Show Delete button only for cancelled ones */}
                  {b.status === "Cancelled" && (
                    <button
                      className="px-3 py-1 bg-gray-700 text-white rounded"
                      onClick={() => deleteBooking(b.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
