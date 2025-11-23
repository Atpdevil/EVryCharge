import Link from "next/link";
import StarBorder from "@/components/StarBorder";

export default function UserSidebar() {
  return (
    <div className="w-60 bg-white h-screen shadow-lg p-6 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-6">User Panel</h2>

      <nav className="flex flex-col">
        <Link href="/user/home">
          <StarBorder color="#00ff99" speed="6s" thickness={2}>
            Dashboard
          </StarBorder>
        </Link>

        <Link href="/user/map">
          <StarBorder color="#00ff99" speed="6s" thickness={2}>
            Find Chargers
          </StarBorder>
        </Link>

        <Link href="/user/bookings">
          <StarBorder color="#00ff99" speed="6s" thickness={2}>
            My Bookings
          </StarBorder>
        </Link>

        <Link href="/user/wallet">
          <StarBorder color="#00ff99" speed="6s" thickness={2}>
            Wallet
          </StarBorder>
        </Link>

        <Link href="/user/profile">
          <StarBorder color="#00ff99" speed="6s" thickness={2}>
            Profile
          </StarBorder>
        </Link>

          <StarBorder color="#FF4444" speed="6s" thickness={2}>
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
