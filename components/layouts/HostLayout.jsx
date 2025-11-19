export default function HostLayout({ children }) {
  return (
    <div className="flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 min-h-screen bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6">Host Panel</h2>

        <nav className="flex flex-col gap-4">
          <a href="/host/dashboard">Dashboard</a>
          <a href="/host/add-station">Add Station</a>
          <a href="/host/stations">My Stations</a>
          <a href="/host/bookings">Bookings</a>
          <a href="/host/earnings">Earnings</a>

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
