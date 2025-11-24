import { useStore } from "../../components/store";
import PixelTransition from "@/components/PixelTransition/PixelTransition";

export default function VehicleTypeSelector({ onNext }) {
  const setType = useStore((s) => s.setVehicleType);
  const vehicleType = useStore((s) => s.vehicleType);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Choose Vehicle Type</h2>

      <div className="flex gap-6">

        {/* CAR */}
        <div
          onClick={() => setType("car")}
          className={`cursor-pointer p-2 rounded-xl border ${
            vehicleType === "car" ? "border-green-600" : "border-gray-300"
          }`}
        >
          <PixelTransition
            firstContent={
              <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="text-xl font-semibold">Car</p>
              </div>
            }
            secondContent={
              <img
                src="/vehicles/car.png"
                alt="Car"
                className="object-contain w-full h-full scale-180"
              />
            }
            gridSize={26}
            pixelColor="#bfbfbf"
            once={false}
            animationStepDuration={0.3}
            className="w-60 h-40 rounded-xl overflow-hidden"
          />
        </div>

        {/* SCOOTER */}
        <div
          onClick={() => setType("scooter")}
          className={`cursor-pointer p-2 rounded-xl border ${
            vehicleType === "scooter" ? "border-green-600" : "border-gray-300"
          }`}
        >
          <PixelTransition
            firstContent={
              <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="text-xl font-semibold">Scooter</p>
              </div>
            }
            secondContent={
              <img
                src="/vehicles/scooter.png"
                alt="Scooter"
                className="object-contain w-full h-full scale-160"
              />
            }
            gridSize={26}
            pixelColor="#bfbfbf"
            once={false}
            animationStepDuration={0.3}
            className="w-60 h-40 rounded-xl overflow-hidden"
          />
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
