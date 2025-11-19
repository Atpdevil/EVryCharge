// pages/host/bookings.jsx
"use client";
import { useEffect, useState } from "react";
import { useStore } from "../../components/store";
import HostSidebar from "../../components/Host/HostSidebar";

export default function HostBookingsPage() {
  const loadBookings = useStore((s) => s.loadBookingsFromLocal);
  const allBookings = useStore((s) => s.bookings);
  const stations = useStore((s) => s.stations);

  const [hostBookings, setHostBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("ev_user"));
    } catch {}
    const ownerId = user?.id;
    if (!ownerId) {
      setHostBookings([]);
      return;
    }

    const ownerStations = (stations || []).filter((s) => s.ownerId === ownerId).map((s) => s.id);
    const hb = (allBookings || []).filter((b) => ownerStations.includes(b.stationId));
    setHostBookings(hb);
  }, [allBookings, stations]);

  function markCompleted(id) {
    // safe, direct update to store & localStorage
    const current = useStore.getState().bookings || [];
    const updated = current.map((b) => (b.id === id ? { ...b, status: "Completed" } : b));
    useStore.setState({ bookings: updated });
    localStorage.setItem("ev_bookings_v1", JSON.stringify(updated));
    // refresh local list
    setHostBookings(updated.filter((b) => {
      const user = JSON.parse(localStorage.getItem("ev_user") || "{}");
      const ownerStations = (stations || []).filter((s) => s.ownerId === user?.id).map(s => s.id);
      return ownerStations.includes(b.stationId);
    }));
  }

  return (
    <div className="flex min-h-screen">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">Bookings for my stations</h1>

        {hostBookings.length === 0 ? (
          <p>No bookings.</p>
        ) : (
          <div className="grid gap-4">
            {hostBookings.map((b) => (
              <div key={b.id} className="p-4 rounded shadow bg-white flex justify-between items-center">
                <div>
                  <div className="font-semibold">{b.stationName}</div>
                  <div className="text-sm">User: {b.userName}</div>
                  <div className="text-sm">Date: {b.date} {b.time}</div>
                  <div className="text-sm">Vehicle: {b.vehicle?.name ?? "Unknown"}</div>
                  <div className="text-sm">Duration: {b.durationMinutes} mins</div>
                  <div className="text-sm">Status: {b.status}</div>
                </div>

                <div className="flex flex-col gap-2">
                  {b.status !== "Completed" && (
                    <button
                      onClick={() => { if (confirm("Mark completed?")) markCompleted(b.id); }}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Mark completed
                    </button>
                  )}

                  <button
                    onClick={() => window.open(`https://www.google.com/maps/?q=${b.stationLat},${b.stationLng}`, "_blank")}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View on map
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
