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

  const formatDate = (ts) => {
    const d = new Date(ts);
    return (
      d.toLocaleDateString() +
      " • " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

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
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {my.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="grid gap-4">
            {my.map((b) => (
              <div
                key={b.id}
                className="p-5 bg-white shadow rounded border flex justify-between items-start"
              >
                {/* BOOKING INFO */}
                <div>
                  <div className="font-semibold text-lg">{b.stationName}</div>

                  <div className="text-sm text-gray-700 mt-1">
                    Rate: <span className="font-semibold">₹{b.pricePerKwh}/hour</span>
                  </div>

                  <div className="text-sm mt-1">
                    Date: {b.date} {b.time}
                  </div>

                  <div className="text-sm">
                    Duration: {b.durationMinutes} minutes
                  </div>

                  {/* COST PAID */}
                  <div className="text-sm mt-1">
                    Total Paid:{" "}
                    <span className="font-semibold text-green-600">
                      ₹{b.totalCost?.toFixed(2)}
                    </span>
                  </div>

                  {/* STATUS BADGE */}
                  <div
                    className={`mt-2 inline-block px-3 py-1 text-xs rounded font-semibold ${
                      b.status === "Cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {b.status}
                  </div>

                  {/* WALLET + HOST INFO */}
                  {b.totalCost && (
                    <div className="mt-3 text-xs text-gray-600">
                      <div>
                        Wallet Deducted:{" "}
                        <span className="font-semibold text-red-600">
                          ₹{b.totalCost.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        Host Credited:{" "}
                        <span className="font-semibold text-green-600">
                          ₹{b.totalCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CREATED DATE */}
                  <div className="text-gray-400 text-xs mt-2">
                    Booked At: {formatDate(b.createdAt)}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded"
                    onClick={() => openMaps(b)}
                  >
                    View in Map
                  </button>

                  {b.status !== "Cancelled" && (
                    <button
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {b.status === "Cancelled" && (
                    <button
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded"
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
