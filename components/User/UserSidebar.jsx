import Link from "next/link";

export default function UserSidebar() {
  return (
    <div className="w-60 bg-white h-screen shadow-lg p-6 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">EVryCharge</h2>

      <nav className="flex flex-col gap-4">
        <Link href="/user/home" className="text-gray-700 hover:text-green-600">
          Dashboard
        </Link>

        <Link href="/user/map" className="text-gray-700 hover:text-green-600">
          Find Chargers
        </Link>

        <Link href="/user/bookings" className="text-gray-700 hover:text-green-600">
          My Bookings
        </Link>

        <Link href="/user/wallet" className="text-gray-700 hover:text-green-600">
          Wallet
        </Link>

        <Link href="/user/profile" className="text-gray-700 hover:text-green-600">
          Profile
        </Link>

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
