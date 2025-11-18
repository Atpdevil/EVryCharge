import { useStore } from "../../components/store";
import { evCars } from "../../data/evCars";
import { evScooters } from "../../data/evScooters";

export default function VehicleList({ onSelectDone }) {
  const vehicleType = useStore((s) => s.vehicleType);
  const setVehicle = useStore((s) => s.setSelectedVehicle);
  const selected = useStore((s) => s.selectedVehicle);

  const list = vehicleType === "car" ? evCars : evScooters;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-bold">
        Choose Your {vehicleType === "car" ? "Car" : "Scooter"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {list.map((v, i) => (
          <div
            key={i}
            onClick={() => setVehicle(v)}
            className={`cursor-pointer border rounded-xl p-4 text-center shadow ${
              selected?.name === v.name ? "border-green-600" : "border-gray-300"
            }`}
          >
            <img src={v.image} className="w-full h-32 object-contain" />
            <p className="mt-3 font-medium">{v.name}</p>
          </div>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={onSelectDone}
        className={`mt-4 px-6 py-3 rounded text-white ${
          selected ? "bg-green-600" : "bg-gray-400"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
