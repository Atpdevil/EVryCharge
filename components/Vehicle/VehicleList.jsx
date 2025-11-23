import { useStore } from "../../components/store";
import { evCars } from "../../data/evCars";
import { evScooters } from "../../data/evScooters";
import TiltedCard from "@/components/TiltedCard/TiltedCard";

export default function VehicleList({ onSelectDone }) {
  const vehicleType = useStore((s) => s.vehicleType);
  const setVehicle = useStore((s) => s.setSelectedVehicle);
  const selected = useStore((s) => s.selectedVehicle);

  const list = vehicleType === "car" ? evCars : evScooters;

  const cardConfig = {
    car: {
      containerHeight: "135px",
      imageHeight: "150px",
      containerWidth: "100%",
      imageWidth: "100%",
    },
    scooter: {
      containerHeight: "200px",
      imageHeight: "200px",
      containerWidth: "100%",
      imageWidth: "100%",
    },
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full pb">
      <h2 className="text-2xl font-bold">
        Choose Your {vehicleType === "car" ? "Car" : "Scooter"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {list.map((v, i) => (
          <div
          key={i}
          onClick={() => setVehicle(v)}
          className={`cursor-pointer rounded-xl ${
            selected?.name === v.name ? "neon-glow" : ""
          }`}
        >
          <TiltedCard
          imageSrc={v.image}
          altText={v.name}
          captionText={v.name}

          containerHeight={cardConfig[vehicleType].containerHeight}
          imageHeight={cardConfig[vehicleType].imageHeight}
          containerWidth={cardConfig[vehicleType].containerWidth}
          imageWidth={cardConfig[vehicleType].imageWidth}

          rotateAmplitude={20}
          scaleOnHover={1.08}
        />
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
