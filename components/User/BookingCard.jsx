export default function BookingCard({ booking }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold">{booking.station}</h3>
      <p className="text-sm text-gray-600">Date: {booking.date}</p>
      <p className="text-sm text-gray-600">Time: {booking.time}</p>
      <p className="text-sm text-gray-600">Status: {booking.status}</p>
    </div>
  );
}
