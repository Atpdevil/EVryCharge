"use client";

import { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import BookingCard from "../../components/User/BookingCard";
import WalletCard from "../../components/User/WalletCard";

export default function UserHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("ev_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold">Welcome {user?.name || "User"}</h1>
        <p className="text-gray-600 mb-6">Here’s your EV overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WalletCard balance={750} />
          <div className="p-6 bg-white rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Upcoming Booking</h3>
            <BookingCard booking={null} />
          </div>
        </div>
      </div>
    </div>
  );
}
