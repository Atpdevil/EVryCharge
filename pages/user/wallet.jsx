"use client";

import { useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import WalletCard from "../../components/User/WalletCard";
import { useStore } from "../../components/store";

export default function UserWallet() {
  const balance = useStore((s) => s.wallet);
  const addMoney = useStore((s) => s.addMoney);
  const history = useStore((s) => s.walletHistory);

  const [amount, setAmount] = useState("");

  const onAdd = () => {
    const a = Number(amount);
    if (!a || a <= 0) {
      alert("Enter a valid amount.");
      return;
    }
    addMoney(a);
    setAmount("");
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return (
      d.toLocaleDateString() +
      " • " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>

        {/* Main Wallet Card */}
        <WalletCard balance={balance} />

        {/* Add Money */}
        <div className="mt-6 flex gap-4">
          <input
            className="border p-3 rounded w-60"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={onAdd}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Add Money
          </button>
        </div>

        {/* Transaction History */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Transaction History</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="p-4 bg-white shadow rounded border flex justify-between items-center"
              >
                <div>
                  <div
                    className={`font-bold ${
                      h.type === "debit" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {h.type === "debit" ? "-" : "+"} ₹{h.amount}
                  </div>
                  <div className="text-gray-600 text-sm">{h.message}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {formatDate(h.time)}
                  </div>
                </div>

                <div
                  className={`px-3 py-1 text-xs rounded ${
                    h.type === "debit"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {h.type === "debit" ? "Debited" : "Credited"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
