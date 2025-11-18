import dynamic from "next/dynamic";
import { useState } from "react";
import { useStore } from "../../components/store";
import { evScooters } from "../../data/evScooters";
import { evCars } from "../../data/evCars";

const AddStationMap = dynamic(() => import("../../components/Host/AddStationMap"), { ssr: false });

const station = {
  id: uuidv4(),
  name: form.name,
  lat: Number(pin.lat),
  lng: Number(pin.lng),
  price: Number(form.price),
  plug: form.plug || "Type 2",
  status: form.status || "Available",

  supportedVehicleTypes,
  supportedModels,

  city: form.city || "",
  pincode: form.pincode || "",
};

addStation(station);

export default function AddStationPage() {
  const addStation = useStore((s) => s.addStation);
  const [form, setForm] = useState({ name: "", price: 10, plug: "Type 2", status: "Available", city: "", pincode: "" });
  const [supportedVehicleTypes, setSupportedVehicleTypes] = useState(["scooter"]); // default
  const [supportedModels, setSupportedModels] = useState([]);
  const [pin, setPin] = useState(null);

  function toggleType(t) {
    setSupportedVehicleTypes(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);
    setSupportedModels([]); // reset selections
  }

  function onPick(pinLatLng, bboxString) {
    setPin(pinLatLng);
    // try reverse geocode for city/pincode quickly
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pinLatLng.lat}&lon=${pinLatLng.lng}`)
      .then(r=>r.json()).then(j=>{
        if (j && j.address) {
          setForm(f => ({ ...f, city: j.address.city || j.address.town || j.address.village || j.address.county || "", pincode: j.address.postcode || "" }));
        }
      }).catch(()=>{});
  }

  const handleSubmit = () => {
    if (!pin) return alert("Place pin for station location.");
    if (!form.name) return alert("Add station name");
    if (supportedModels.length === 0) return alert("Select at least one supported model");

    const station = {
      name: form.name,
      lat: pin.lat,
      lng: pin.lng,
      price: Number(form.price),
      plug: form.plug,
      status: form.status,
      supportedVehicleTypes,
      supportedModels,
      city: form.city,
      pincode: form.pincode
    };

    addStation(station);
    alert("Station added");
    window.location.href = "/host/stations";
  };

  // model lists depend on selected types
  const modelOptions = (supportedVehicleTypes.includes("scooter") ? evScooters : []).concat(supportedVehicleTypes.includes("car") ? evCars : []);

  return (
    <div className="flex">
      {/* sidebar same as before */}
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-4">Add Station (Map)</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <AddStationMap onPick={onPick} />
          </div>

          <div>
            <div className="bg-white p-4 rounded shadow mb-4">
              <input placeholder="Station name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border p-2 mb-2" />
              <input placeholder="Price (₹/kWh)" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border p-2 mb-2" />
              <select value={form.plug} onChange={e=>setForm({...form,plug:e.target.value})} className="w-full border p-2 mb-2">
                <option>Type 2</option>
                <option>CCS2</option>
                <option>GB/T</option>
              </select>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full border p-2 mb-2">
                <option>Available</option>
                <option>Busy</option>
                <option>Offline</option>
              </select>

              <div className="mb-2">
                <label className="font-semibold">Supported vehicle types</label>
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>toggleType("scooter")} className={`px-3 py-1 rounded border ${supportedVehicleTypes.includes("scooter") ? "border-green-600" : ""}`}>Scooter</button>
                  <button onClick={()=>toggleType("car")} className={`px-3 py-1 rounded border ${supportedVehicleTypes.includes("car") ? "border-green-600" : ""}`}>Car</button>
                </div>
              </div>

              <div className="mb-2">
                <label className="font-semibold">Supported models (pick multiple)</label>
                <div className="max-h-40 overflow-auto grid grid-cols-1 gap-2 mt-2">
                  {modelOptions.map((m,i)=>(
                    <label key={i} className="flex items-center gap-2">
                      <input type="checkbox" value={m.name} checked={supportedModels.includes(m.name)} onChange={(e)=>{
                        const v = e.target.value;
                        setSupportedModels(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v]);
                      }} />
                      <span>{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <label className="font-semibold">Detected city / pincode</label>
                <div>{form.city} {form.pincode && `• ${form.pincode}`}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Add Station</button>
                <button onClick={()=>{ setPin(null); }} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Tip: search for the region (e.g. "Bengaluru") and then place the pin in the exact location. The map draws the region boundary if available.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
