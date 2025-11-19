import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import chargers from "../../data/chargers.json";

export default function EVMap() {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full">
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {chargers.map((c, i) => (
        <Marker key={i} icon={chargerIcon} position={[c.lat, c.lng]}>
          <Popup>
            <b>{c.name}</b> <br />
            Price: ₹{c.price}/kWh <br />
            Status: {c.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
