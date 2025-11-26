"use client";

import { useEffect, useState } from "react";
import HostSidebar from "../../components/Host/HostSidebar";
import StationCard from "../../components/Host/StationCard";
import { useStore } from "../../components/store";

export default function HostDashboard() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const stations = useStore((s) => s.stations);
  const loadStationsFromLocal = useStore((s) => s.loadStationsFromLocal);

  const hostEarnings = useStore((s) => s.hostEarnings); // new earnings

  useEffect(() => {
    const stored = localStorage.getItem("ev_user");
    if (stored) setUser(JSON.parse(stored));

    loadStationsFromLocal();
    setMounted(true);
  }, []);

  const todayDate = new Date().toDateString();

  // Compute total earnings for today (after mount only)
  const todaysEarnings = mounted
    ? hostEarnings
        .filter(
          (e) =>
            e.hostId === user?.id &&
            new Date(e.time).toDateString() === todayDate
        )
        .reduce((sum, e) => sum + Number(e.amount), 0)
    : 0;

  // Compute earnings per station (optional)
  const earningsByStation = mounted
    ? hostEarnings
        .filter((e) => e.hostId === user?.id)
        .reduce((acc, e) => {
          acc[e.stationId] = (acc[e.stationId] || 0) + Number(e.amount);
          return acc;
        }, {})
    : {};

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
        <HostSidebar onClose={() => setOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome {user?.name || "Host"}
        </h1>

        <p className="text-gray-600 mb-6">Here's your station overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* TODAY'S EARNINGS BOX */}
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Today's Earnings</h2>

            <div className="text-4xl font-bold mt-3">
              ₹{todaysEarnings.toFixed(2)}
            </div>

            <p className="text-green-100 text-sm mt-2">
              From all completed user bookings today.
            </p>
          </div>

          {/* STATIONS */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your Stations</h3>

            {stations.length === 0 ? (
              <p className="text-gray-500">You haven't added any stations yet.</p>
            ) : (
              stations.map((station) => {
                const stEarn = earningsByStation[station.id] || 0;

                return (
                  <div key={station.id} className="mb-4">
                    <StationCard station={station} />
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
