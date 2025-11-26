"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../components/store";
import HostSidebar from "../../components/Host/HostSidebar";

export default function HostEarnings() {
  const earnings = useStore((s) => s.hostEarnings);
  const stations = useStore((s) => s.stations);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // prevent SSR mismatch
    setMounted(true);
  }, []);

  const formatDate = (ts) => {
    const d = new Date(ts);
    return (
      d.toLocaleDateString() +
      " • " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getStationName = (id) => {
    const st = stations.find((s) => s.id === id);
    return st?.name || "Unknown Station";
  };

  // total earnings AFTER mount only
  const totalEarned = mounted
    ? earnings.reduce((sum, e) => sum + Number(e.amount), 0)
    : 0;

  return (
    <div className="flex min-h-screen">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Earnings</h1>

        {/* Total Earnings */}
        <div className="bg-white shadow p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Total Earnings</h2>

          {/* placeholder for SSR */}
          <div className="text-3xl font-bold text-green-600">
            {mounted ? `₹${totalEarned.toFixed(2)}` : "₹0.00"}
          </div>

          <p className="text-gray-600 mt-2">Powered by your charging stations.</p>
        </div>

        {/* Earnings History */}
        <h2 className="text-xl font-semibold mb-4">Earnings History</h2>

        {/* While SSR: always render placeholder */}
        {!mounted ? (
          <p className="text-gray-500">Loading…</p>
        ) : earnings.length === 0 ? (
          <p className="text-gray-500">No earnings yet.</p>
        ) : (
          <div className="space-y-3">
            {earnings.map((e) => (
              <div
                key={e.id}
                className="p-4 bg-white border shadow rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-green-700">
                    + ₹{Number(e.amount).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-700">
                    From User: <span className="font-semibold">{e.fromUser}</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    Station:{" "}
                    <span className="font-semibold">
                      {getStationName(e.stationId)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {formatDate(e.time)}
                  </div>
                </div>

                <div className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Received
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-gray-600">
          Withdrawal options coming soon…
        </p>
      </div>
    </div>
  );
}
