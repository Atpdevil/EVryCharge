import { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import BookingCard from "../../components/User/BookingCard";
import { useStore } from "../../components/store";

export default function UserBookings() {
  const bookings = useStore(s => s.bookings);

  return (
    <div className="flex">
      <UserSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <div className="grid gap-4 mt-6">
          {bookings.length === 0 ? <div className="text-gray-500">No bookings yet.</div> :
            bookings.map(b => <BookingCard key={b.id} booking={{
              station: b.stationName,
              date: b.date,
              time: b.time,
              status: b.status
            }} />)
          }
        </div>
      </div>
    </div>
  );
}
