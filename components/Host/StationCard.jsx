export default function StationCard({ station }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border mb-4">
      <h3 className="text-lg font-semibold">{station.name}</h3>
      <p>Status: {station.status}</p>
      <p>Price: ₹{station.price}/kWh</p>
    </div>
  );
}
