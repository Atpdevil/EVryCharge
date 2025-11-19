"use client";

import { useEffect, useState } from "react";
import HostSidebar from "../../components/Host/HostSidebar";
import EarningsCard from "../../components/Host/EarningsCard";
import StationCard from "../../components/Host/StationCard";
import { useStore } from "../../components/store";

export default function HostDashboard() {
  const [user, setUser] = useState(null);

  // GET REAL STATIONS FROM STORE
  const stations = useStore((s) => s.stations);
  const loadStationsFromLocal = useStore((s) => s.loadStationsFromLocal);

  useEffect(() => {
    // Load user
    const stored = localStorage.getItem("ev_user");
    if (stored) setUser(JSON.parse(stored));

    // Load stations from localStorage
    loadStationsFromLocal();
  }, []);

  return (
    <div className="flex">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold">Welcome {user?.name || "Host"}</h1>
        <p className="text-gray-600 mb-6">Here's your station overview.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Earnings Summary */}
          <EarningsCard amount={1250} />

          {/* Station List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your Stations</h3>

            {/* If none */}
            {stations.length === 0 && (
              <p className="text-gray-500">You haven't added any stations yet.</p>
            )}

            {/* Render stations */}
            {stations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
