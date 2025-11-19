export default function UserLayout({ children }) {
  return (
    <div className="flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 min-h-screen bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6">EVryCharge</h2>

        <nav className="flex flex-col gap-4">
          <a href="/user/home">Dashboard</a>
          <a href="/user/map">Find Chargers</a>
          <a href="/user/bookings">My Bookings</a>
          <a href="/user/wallet">Wallet</a>
          <a href="/user/profile">Profile</a>

          <a href="/login" className="text-red-500 mt-6">Logout</a>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
