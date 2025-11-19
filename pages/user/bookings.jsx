"use client";
import { useEffect, useState } from "react";
import { useStore } from "../../components/store";
import UserSidebar from "../../components/User/UserSidebar";

export default function MyBookingsPage() {
  const loadBookings = useStore((s) => s.loadBookingsFromLocal);
  const allBookings = useStore((s) => s.bookings);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let uid = JSON.parse(localStorage.getItem("ev_user") || "{}")?.id || "anon";
    const my = allBookings.filter((b) => b.userId === uid);
    setBookings(my);
  }, [allBookings]);

  function openMaps(b) {
    if (!b.stationLat || !b.stationLng) return alert("Coordinates missing");
    window.open(`https://www.google.com/maps/?q=${b.stationLat},${b.stationLng}`, "_blank");
  }

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 bg-white shadow rounded flex justify-between">
                <div>
                  <div className="font-semibold">{b.stationName}</div>
                  <div className="text-sm text-gray-600">Price: ₹{b.pricePerKwh}/kWh</div>
                  <div className="text-sm">Date: {b.date} {b.time}</div>
                  <div className="text-sm">Duration: {b.durationMinutes} min</div>
                  <div className="text-sm">Status: {b.status}</div>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded"
                          onClick={() => openMaps(b)}>
                    View in Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
