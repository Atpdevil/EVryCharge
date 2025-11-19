"use client";

import dynamic from "next/dynamic";
import UserSidebar from "../../components/User/UserSidebar";
import { useStore } from "../../components/store";
import { useEffect } from "react";

const UserMapCore = dynamic(
  () => import("../../components/Map/UserMapCore"),
  { ssr: false }
);

export default function UserMap() {
  const loadStationsFromLocal = useStore((s) => s.loadStationsFromLocal);

  useEffect(() => {
    loadStationsFromLocal();
  }, []);

  return (
    <div className="flex">
      <UserSidebar />
      <UserMapCore />
    </div>
  );
}
