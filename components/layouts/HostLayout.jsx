"use client";
import { useState } from "react";
import Link from "next/link";

export default function HostLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">

      {/* MOBILE TOGGLE BUTTON */}
      <button
        className="md:hidden p-4 text-white fixed top-4 left-4 z-50 bg-black/40 rounded-xl backdrop-blur"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-full w-64 bg-white border-r p-6 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">Host Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link href="/host/dashboard">Dashboard</Link>
          <Link href="/host/add-station">Add Station</Link>
          <Link href="/host/stations">My Stations</Link>
          <Link href="/host/bookings">Bookings</Link>
          <Link href="/host/earnings">Earnings</Link>

          <Link href="/login" className="text-red-500 mt-6">Logout</Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:ml-0 ml-0 w-full">{children}</main>
    </div>
  );
}
