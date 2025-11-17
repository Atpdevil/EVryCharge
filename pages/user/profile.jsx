import { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import ProfileCard from "../../components/User/ProfileCard";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("ev_user");
    if (data) setUser(JSON.parse(data));
  }, []);

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <ProfileCard user={user} />
      </div>
    </div>
  );
}
