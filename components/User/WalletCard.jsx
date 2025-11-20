export default function WalletCard({ balance }) {
  return (
    <div className="p-6 bg-green-600 text-white rounded-lg shadow-md h-48 flex flex-col justify-center">
      <h3 className="text-xl font-semibold">Wallet Balance</h3>
      <p className="text-4xl font-bold mt-2">₹{balance}</p>
    </div>
  );
}
