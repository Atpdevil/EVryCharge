export default function EarningsCard({ amount }) {
  return (
    <div className="p-6 bg-green-600 text-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Today's Earnings</h3>
      <p className="text-4xl font-bold mt-2">₹{amount}</p>
    </div>
  );
}
