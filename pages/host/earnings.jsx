import HostSidebar from "../../components/Host/HostSidebar";
import EarningsCard from "../../components/Host/EarningsCard";

export default function HostEarnings() {
  return (
    <div className="flex">
      <HostSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Earnings</h1>

        <EarningsCard amount={5400} />

        <p className="mt-4 text-gray-600">Withdrawal features coming soon...</p>
      </div>
    </div>
  );
}
