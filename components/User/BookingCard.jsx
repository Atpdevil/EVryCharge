import { useEffect } from "react";
import SessionController from "../SessionController";

export default function BookingCard({ booking }) {
  useEffect(() => {
    if (!booking) console.warn("BookingCard: received undefined booking from parent");
  }, [booking]);

  if (!booking) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border">
        <p className="text-sm text-red-600">Booking data unavailable — check parent</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{booking.station}</h3>
        <p className="text-sm text-gray-600">Date: {booking.date} • {booking.time}</p>
        <p className="text-sm text-gray-600">Status: {booking.status}</p>
      </div>
      <div>
        {booking.status === "Booked" && booking.id && (
          <SessionController bookingId={booking.id} />
        )}
      </div>
    </div>
  );
}
