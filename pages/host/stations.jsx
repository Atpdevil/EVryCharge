// pages/host/stations.jsx
"use client";

import { useEffect } from "react";
import HostSidebar from "../../components/Host/HostSidebar";
import StationCard from "../../components/Host/StationCard";
import { useStore } from "../../components/store";

export default function HostStations() {
  const stations = useStore((s) => s.stations);
  const loadStationsFromLocal = useStore((s) => s.loadStationsFromLocal);

  useEffect(() => {
    loadStationsFromLocal();
  }, []);

  return (
    <div className="flex min-h-screen">
      <HostSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">My Stations</h1>

        {stations.length === 0 ? (
          <p className="text-gray-500">No stations added yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {stations.map((s) => (
              <StationCard key={s.id} station={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
