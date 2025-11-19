import HostSidebar from "../../components/Host/HostSidebar";
import BookingRow from "../../components/Host/BookingRow";

export default function HostBookings() {

  const bookings = [];

  return (
    <div className="flex">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Bookings</h1>

        {bookings.map((b, i) => (
          <BookingRow key={i} data={b} />
        ))}
      </div>
    </div>
  );
}
