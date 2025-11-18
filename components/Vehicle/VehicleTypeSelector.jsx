import { useStore } from "../../components/store";

export default function VehicleTypeSelector({ onNext }) {
  const setType = useStore((s) => s.setVehicleType);
  const vehicleType = useStore((s) => s.vehicleType);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Choose Vehicle Type</h2>

      <div className="flex gap-6">
        <div
          onClick={() => setType("car")}
          className={`cursor-pointer border p-6 rounded-xl w-48 text-center shadow ${
            vehicleType === "car" ? "border-green-600" : "border-gray-300"
          }`}
        >
          <div className="text-6xl mb-2">🚗</div>
          <p className="font-semibold">Car</p>
        </div>

        <div
          onClick={() => setType("scooter")}
          className={`cursor-pointer border p-6 rounded-xl w-48 text-center shadow ${
            vehicleType === "scooter" ? "border-green-600" : "border-gray-300"
          }`}
        >
          <div className="text-6xl mb-2">🛵</div>
          <p className="font-semibold">Scooter</p>
        </div>
      </div>

      <button
        disabled={!vehicleType}
        onClick={onNext}
        className={`mt-4 px-6 py-3 rounded text-white ${
          vehicleType ? "bg-green-600" : "bg-gray-400"
        }`}
      >
        Next
      </button>
    </div>
  );
}
