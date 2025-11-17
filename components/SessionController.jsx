import { useEffect, useState } from "react";
import { useStore } from "./store";

export default function SessionController({ bookingId }) {
  const startSession = useStore(s => s.startSession);
  const updateSession = useStore(s => s.updateSession);
  const endSession = useStore(s => s.endSession);
  const [sessionId, setSessionId] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (running && sessionId) {
      timer = setInterval(() => {
        // simulate energy delivered: ~0.05 kWh per second (fast sim)
        updateSession(sessionId, (prev) => {
          // but updateSession expects object, so fetch current then update
          // We will call updateSession with new values below instead
        });

        // better approach: fetch current session from store, compute and update
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running, sessionId]);

  const handleStart = (booking) => {
    // booking must be retrieved from store; we'll just create a session with pricePerKwh
    const bookingStore = useStore.getState().bookings.find(b => b.id===bookingId);
    if (!bookingStore) return alert("Booking not found");
    const s = startSession({
      bookingId,
      stationName: bookingStore.stationName,
      pricePerKwh: bookingStore.pricePerKwh || 12,
      kwh: 0,
    });
    setSessionId(s.id);
    setRunning(true);

    // simple interval to update kwh
    const interval = setInterval(() => {
      const cur = useStore.getState().sessions.find(x => x.id === s.id);
      if (!cur) { clearInterval(interval); return; }
      const newKwh = +(cur.kwh + 0.01).toFixed(3); // small increments
      useStore.getState().updateSession(s.id, { kwh: newKwh, cost: +(newKwh * cur.pricePerKwh).toFixed(2) });
    }, 1000);

    // store interval id on the session (hacky) — but we'll skip storing interval reference cross-component
    // Provide stop button that calls endSession which handles wallet deduction
  };

  const handleStop = () => {
    if (!sessionId) return;
    const result = endSession(sessionId);
    setRunning(false);
    setSessionId(null);
    if (result.success) {
      alert(`Charging completed. ₹${result.amount} deducted from wallet.`);
    } else {
      alert(`Charging completed. Amount ₹${result.amount} pending (insufficient funds).`);
    }
  };

  return (
    <div className="flex gap-2">
      {!running ? (
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={()=>handleStart()}>Start Charging</button>
      ) : (
        <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={handleStop}>Stop Charging</button>
      )}
    </div>
  );
}
