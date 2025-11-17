export default function ProfileCard({ user }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3">Profile Information</h3>

      <p><b>Name:</b> {user?.name}</p>
      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> {user?.role}</p>
    </div>
  );
}
