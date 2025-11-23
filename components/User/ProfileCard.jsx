export default function ProfileCard({ user }) {
  const vehicle = user?.vehicle;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Profile Information</h3>

      <p><b>Name:</b> {user?.name}</p>
      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> {user?.role || "User"}</p>

      {/* Vehicle Name */}
      <p className="">
        <b>Vehicle:</b> {vehicle ? vehicle.name : "Not selected"}
      </p>

      {/* Vehicle Image */}
      {vehicle && (
        <div className="mt-1">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-60 h-48 object-cover rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
}
