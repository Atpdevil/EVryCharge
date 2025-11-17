import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import UserSidebar from "../../components/User/UserSidebar";
import chargers from "../../data/chargers.json";

const chargerIcon = new L.Icon({
  iconUrl: "/charger.png",
  iconSize: [40, 45]
});

export default function UserMap() {
  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 w-full h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Find Chargers</h1>

        <div className="w-full h-[85vh] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {chargers.map((c, i) => (
              <Marker key={i} icon={chargerIcon} position={[c.lat, c.lng]}>
                <Popup>
                  <b>{c.name}</b><br />
                  Price: ₹{c.price}/kWh<br />
                  Status: {c.status}<br />
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        </div>
      </div>
    </div>
  );
}
