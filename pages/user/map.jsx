import dynamic from "next/dynamic";
import UserSidebar from "../../components/User/UserSidebar";

const UserMapCore = dynamic(
  () => import("../../components/Map/UserMapCore"),
  { ssr: false }
);

export default function UserMap() {
  return (
    <div className="flex">
      <UserSidebar />
      <UserMapCore />
    </div>
  );
}
