import { useState } from "react";
import VehicleTypeSelector from "../../components/Vehicle/VehicleTypeSelector";
import VehicleList from "../../components/Vehicle/VehicleList";
import { useStore } from "../../components/store";

export default function UserSelectVehicle() {
  const [step, setStep] = useState(1);
  const selectedVehicle = useStore((s) => s.selectedVehicle);

  return (
    <div className="p-10 flex justify-center">
      {step === 1 && <VehicleTypeSelector onNext={() => setStep(2)} />}

      {step === 2 && (
        <VehicleList onSelectDone={() => (window.location.href = "/user/home")} />
      )}
    </div>
  );
}
