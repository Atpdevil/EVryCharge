import Link from "next/link";

export default function HostSidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-6 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">Host Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link href="/host/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
        <Link href="/host/add-station" className="text-gray-700 hover:text-green-600">Add Station</Link>
        <Link href="/host/stations" className="text-gray-700 hover:text-green-600">My Stations</Link>
        <Link href="/host/bookings" className="text-gray-700 hover:text-green-600">Bookings</Link>
        <Link href="/host/earnings" className="text-gray-700 hover:text-green-600">Earnings</Link>

        <button
          onClick={() => {
            localStorage.removeItem("ev_user");
            window.location.href = "/login";
          }}
          className="text-red-500 mt-10"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
