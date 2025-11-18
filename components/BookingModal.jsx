import { useState } from "react";
import { useStore } from "./store";
import format from "date-fns/format";

export default function BookingModal({ station, onClose }) {
  const createBooking = useStore((s)=>s.createBooking);
  const selectedVehicle = useStore((s)=>s.selectedVehicle);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("12:00");
  const [minutes, setMinutes] = useState(30);

  const handleSubmit = () => {
    if (!selectedVehicle) return alert("Select your vehicle first in Profile.");
    const booking = createBooking({
      stationName: station.name,
      stationId: station.id || station.name,
      date, time, durationMinutes: Number(minutes),
      vehicle: selectedVehicle,
      pricePerKwh: station.price || 12,
    });
    onClose?.(booking);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 z-[9998]" onClick={() => onClose()} />
      <div className="bg-white p-6 rounded shadow z-[10000] w-[420px]">
        <h3 className="text-lg font-semibold mb-2">{station.name}</h3>
        <p className="text-sm text-gray-600 mb-2">Price: ₹{station.price}/kWh</p>
        <p className="text-sm text-gray-600 mb-2">Selected vehicle: {selectedVehicle?.name || "None"}</p>

        <label className="block text-sm">Date</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border p-2 w-full mb-2" />

        <label className="block text-sm">Time</label>
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="border p-2 w-full mb-2" />

        <label className="block text-sm">Minutes</label>
        <input type="number" min="5" step="5" value={minutes} onChange={e=>setMinutes(e.target.value)} className="border p-2 w-full mb-4" />

        <div className="flex justify-end gap-2">
          <button onClick={()=>onClose()} className="px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Book</button>
        </div>
      </div>
    </div>
  );
}
