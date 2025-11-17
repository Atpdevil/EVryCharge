import { scooters } from "../data/scooters";
import { useStore } from "./store";

export default function VehicleSelector() {
  const selected = useStore(s => s.selectedVehicle);
  const setSelected = useStore(s => s.setSelectedVehicle);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold mb-2">Select your scooter</h4>
      <div className="grid grid-cols-1 gap-2">
        {scooters.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className={`p-3 text-left rounded border ${selected?.id===s.id ? "border-green-600 bg-green-50" : "border-gray-200"}`}
          >
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-gray-500">Battery ≈ {s.battery} kWh</div>
          </button>
        ))}
      </div>
    </div>
  );
}
