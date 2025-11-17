import { useState, useEffect } from "react";
export default function Navbar() {
  const [dark, setDark] = useState(false);
  useEffect(()=> {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="p-3 flex justify-end gap-3">
      <button onClick={()=>setDark(!dark)} className="px-3 py-1 border rounded">
        {dark? "Light" : "Dark"}
      </button>
    </div>
  );
}
