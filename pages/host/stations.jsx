import HostSidebar from "../../components/Host/HostSidebar";
import StationCard from "../../components/Host/StationCard";

export default function HostStations() {

  const stations = [
    { name: "Ather Grid - Chennai", status: "Available", price: 12 },
    { name: "Ola Hypercharger - Bangalore", status: "Busy", price: 10 }
  ];

  return (
    <div className="flex">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">My Stations</h1>

        {stations.map((s, i) => (
          <StationCard key={i} station={s} />
        ))}
      </div>
    </div>
  );
}
