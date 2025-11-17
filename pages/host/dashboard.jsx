import { useEffect, useState } from "react";
import HostSidebar from "../../components/Host/HostSidebar";
import EarningsCard from "../../components/Host/EarningsCard";
import StationCard from "../../components/Host/StationCard";

export default function HostDashboard() {
  const [user, setUser] = useState(null);

  const exampleStations = [
    { name: "Ather Grid - Chennai", status: "Available", price: 12 },
    { name: "Ola Hypercharger - Bangalore", status: "Busy", price: 10 }
  ];

  useEffect(() => {
    const stored = localStorage.getItem("ev_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="flex">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold">Welcome {user?.name || "Host"}</h1>
        <p className="text-gray-600 mb-6">Here's your station overview.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <EarningsCard amount={1250} />

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your Stations</h3>
            {exampleStations.map((s, i) => (
              <StationCard key={i} station={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
