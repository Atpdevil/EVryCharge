"use client";

import dynamic from "next/dynamic";
import UserSidebar from "../../components/User/UserSidebar";
import { useStore } from "../../components/store";
import { useEffect } from "react";

// dynamic map import
const UserMapCoreDynamic = dynamic(
  () => import("../../components/Map/UserMapCore"),
  { ssr: false }
);

export default function UserMap() {
  const loadStationsFromLocal = useStore((s) => s.loadStationsFromLocal);

  useEffect(() => {
    loadStationsFromLocal();
  }, []);

  return (
    <div className="flex min-h-screen">
      <UserSidebar />

      <div className="ml-64 p-6 w-full">
        <UserMapCoreDynamic />
      </div>
    </div>
  );
}
