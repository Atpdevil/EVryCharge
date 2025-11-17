import { useState } from "react";
import { useStore } from "./store";
import format from "date-fns/format";

export default function BookingModal({ station, onClose }) {
  const createBooking = useStore(s => s.createBooking);
  const selectedVehicle = useStore(s => s.selectedVehicle);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("12:00");
  const [duration, setDuration] = useState(30); // minutes

  const handleSubmit = () => {
    if (!selectedVehicle) return alert("Select your scooter in Profile first.");
    const booking = createBooking({
      stationName: station.name,
      stationId: station.id || station.name,
      date,
      time,
      duration,
      vehicle: selectedVehicle,
      pricePerKwh: station.price || 12
    });
    onClose && onClose(booking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose()}></div>
      <div className="bg-white p-6 rounded shadow z-10 w-[420px]">
        <h3 className="text-lg font-semibold mb-2">Book: {station.name}</h3>
        <label className="block text-sm">Date</label>
        <input className="border p-2 w-full mb-2" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />

        <label className="block text-sm">Time</label>
        <input className="border p-2 w-full mb-2" type="time" value={time} onChange={(e)=>setTime(e.target.value)} />

        <label className="block text-sm">Duration (mins)</label>
        <input className="border p-2 w-full mb-4" type="number" value={duration} onChange={(e)=>setDuration(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button onClick={()=>onClose()} className="px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Book</button>
        </div>
      </div>
    </div>
  );
}
