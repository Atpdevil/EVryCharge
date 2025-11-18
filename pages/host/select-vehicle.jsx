import { useState } from "react";
import VehicleTypeSelector from "../../components/Vehicle/VehicleTypeSelector";
import VehicleList from "../../components/Vehicle/VehicleList";

export default function HostSelectVehicle() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-10 flex justify-center">
      {step === 1 && <VehicleTypeSelector onNext={() => setStep(2)} />}

      {step === 2 && (
        <VehicleList onSelectDone={() => (window.location.href = "/host/dashboard")} />
      )}
    </div>
  );
}
