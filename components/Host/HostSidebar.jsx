import Link from "next/link";
import StarBorder from "@/components/StarBorder/StarBorder";

export default function HostSidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-6 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">Host Panel</h2>

      <nav className="flex flex-col">

        <StarBorder color="#00FF7F" thickness={2}>
          <Link href="/host/dashboard" className="block text-black-700 hover:text-green-600">
            Dashboard
          </Link>
        </StarBorder>

        <StarBorder color="#00FF7F" thickness={2}>
          <Link href="/host/add-station" className="block text-black-700 hover:text-green-600">
            Add Station
          </Link>
        </StarBorder>

        <StarBorder color="#00FF7F" thickness={2}>
          <Link href="/host/stations" className="block text-black-700 hover:text-green-600">
            My Stations
          </Link>
        </StarBorder>

        <StarBorder color="#00FF7F" thickness={2}>
          <Link href="/host/earnings" className="block text-black-700 hover:text-green-600">
            Earnings
          </Link>
        </StarBorder>

        <StarBorder color="#FF4444" thickness={2}>
          <button
            onClick={() => {
              localStorage.removeItem("ev_user");
              window.location.href = "/login";
            }}
            className="block w-full text-red-500">
            Logout
          </button>
        </StarBorder>

      </nav>
    </div>
  );
}
