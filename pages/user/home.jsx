import { useEffect, useState } from "react";

export default function HostDashboard() {
  const [user, setUser] = useState(null); // empty at first

  useEffect(() => {
    const stored = localStorage.getItem("ev_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome {user?.name || "User"}
      </h1>
      <p>This is the User dashboard placeholder.</p>
    </div>
  );
}
