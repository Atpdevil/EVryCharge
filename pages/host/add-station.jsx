import HostSidebar from "../../components/Host/HostSidebar";
import AddStationForm from "../../components/Host/AddStationForm";

export default function AddStation() {
  return (
    <div className="flex">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Add Station</h1>
        <AddStationForm />
      </div>
    </div>
  );
}
