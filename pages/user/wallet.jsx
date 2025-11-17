import { useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import WalletCard from "../../components/User/WalletCard";
import { useStore } from "../../components/store";

export default function UserWallet() {
  const balance = useStore(s => s.wallet);
  const addMoney = useStore(s => s.addMoney);
  const [amount, setAmount] = useState("");

  const onAdd = () => {
    const a = Number(amount);
    if (!a || a <= 0) return alert("Enter a valid amount");
    addMoney(a);
    setAmount("");
  };

  return (
    <div className="flex">
      <UserSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        <WalletCard balance={balance} />
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Add Money</h3>
          <div className="flex gap-4">
            <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="border p-3 rounded w-60" placeholder="Amount" />
            <button onClick={onAdd} className="bg-green-600 text-white px-6 py-3 rounded">Add Money</button>
          </div>
        </div>
      </div>
    </div>
  );
}
