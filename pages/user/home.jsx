"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../components/store";
import UserSidebar from "../../components/User/UserSidebar";
import WalletCard from "../../components/User/WalletCard";

export default function UserHome() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const loadBookings = useStore((s) => s.loadBookingsFromLocal);
  const bookings = useStore((s) => s.bookings);
  const cancelBooking = useStore((s) => s.cancelBooking);

  useEffect(() => {
    loadBookings();
    const stored = localStorage.getItem("ev_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const upcoming =
    bookings
      .filter((b) => b.userId === user?.id && b.status === "Booked")
      .sort((a, b) => a.createdAt - b.createdAt)[0];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-black/40 text-white p-3 rounded-xl backdrop-blur"
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 z-40 h-full w-64 bg-white border-r transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <UserSidebar onClose={() => setOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 w-full">
        
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome {user?.name}
        </h1>

        <p className="text-gray-600 mb-6">Here’s your EV overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <WalletCard balance={750} />

          <div className="p-6 bg-white rounded shadow">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Upcoming Booking
            </h3>

            {!upcoming ? (
              <p>No upcoming booking.</p>
            ) : (
              <div className="space-y-1">
                <p><b>Charger:</b> {upcoming.stationName}</p>
                <p><b>Date:</b> {upcoming.date} {upcoming.time}</p>
                <p><b>Duration:</b> {upcoming.durationMinutes} min</p>
                <p><b>Status:</b> {upcoming.status}</p>

                <button
                  className="mt-3 p-2 bg-green-600 text-white rounded w-full sm:w-auto"
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
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded w-full sm:w-auto"
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
