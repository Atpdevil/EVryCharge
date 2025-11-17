import { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import BookingCard from "../../components/User/BookingCard";

export default function UserBookings() {
  const [user, setUser] = useState(null);

  const exampleBookings = [
    { station: "Ather Grid - Chennai", date: "20 Nov 2025", time: "4:00 PM", status: "Upcoming" },
    { station: "Ola Hypercharger - Bangalore", date: "10 Nov 2025", time: "2:00 PM", status: "Completed" }
  ];

  useEffect(() => {
    const stored = localStorage.getItem("ev_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold">My Bookings</h1>

        <div className="grid gap-4 mt-6">
          {exampleBookings.map((b, i) => (
            <BookingCard key={i} booking={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
