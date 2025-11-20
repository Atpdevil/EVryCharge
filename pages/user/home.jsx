"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../components/store";
import UserSidebar from "../../components/User/UserSidebar";
import WalletCard from "../../components/User/WalletCard";

export default function UserHome() {
  const [user, setUser] = useState(null);

  const loadBookings = useStore((s) => s.loadBookingsFromLocal);
  const bookings = useStore((s) => s.bookings);
  const cancelBooking = useStore((s) => s.cancelBooking);

  useEffect(() => {
    loadBookings();
    const stored = localStorage.getItem("ev_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const upcoming = bookings
    .filter((b) => b.userId === user?.id && b.status === "Booked")
    .sort((a, b) => a.createdAt - b.createdAt)[0];

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold">Welcome {user?.name}</h1>
        <p className="text-gray-600 mb-6">Here’s your EV overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WalletCard balance={750} />

          <div className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Upcoming Booking</h3>

            {!upcoming ? (
              <p>No upcoming booking.</p>
            ) : (
              <div>
                <p><b>Charger:</b> {upcoming.stationName}</p>
                <p><b>Date:</b> {upcoming.date} {upcoming.time}</p>
                <p><b>Duration:</b> {upcoming.durationMinutes} min</p>
                <p><b>Status:</b> {upcoming.status}</p>

                <button
                  className="mt-3 p-2 bg-green-600 text-white rounded mr-2"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${upcoming.stationLat},${upcoming.stationLng}`,
                      "_blank"
                    )
                  }
                >
                  View on Map
                </button>

                <button
                  onClick={() => cancelBooking(upcoming.id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
