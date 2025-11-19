"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStore } from "../../components/store";

function NominatimSearch({ onResult }) {
  const [q, setQ] = useState("");
  const searching = useRef(false);

  async function doSearch() {
    if (!q.trim() || searching.current) return;
    searching.current = true;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { "User-Agent": "EVryCharge/1.0" }});
      const json = await res.json();
      if (json && json.length) onResult(json[0]); // we take first match
      else onResult(null);
    } catch (e) {
      console.error("nominatim", e);
      onResult(null);
    } finally {
      searching.current = false;
    }
  }

  return (
    <div className="flex gap-2">
      <input className="border p-2 rounded" placeholder="Search area e.g. Bengaluru" value={q} onChange={(e)=>setQ(e.target.value)} />
      <button onClick={doSearch} className="px-3 py-1 bg-green-600 text-white rounded">Search</button>
    </div>
  );
}

export default function AddStationMap({ onPick }) {
  const mapRef = useRef();
  const [marker, setMarker] = useState(null);
  const [geoJsonLayer, setGeoJsonLayer] = useState(null);
  const store = useStore();

  useEffect(() => {
    // nothing to do here; map created in JSX via MapContainer
  }, []);

  // when Nominatim returns a result: draw polygon/bbox and flyTo
  async function handleNominatim(result) {
    const map = mapRef.current;
    if (!map) return;
    // clear previous
    if (geoJsonLayer) { geoJsonLayer.remove(); setGeoJsonLayer(null); }
    try {
      if (!result) {
        map.setView([20.5937,78.9629], 5); // fallback India
        return;
      }
      // if polygonGeoJSON exists, draw it. otherwise use bbox
      if (result.geojson) {
        const g = L.geoJSON(result.geojson, { style: { color: "#00a", weight: 2, fillOpacity: 0.05 } }).addTo(map);
        map.fitBounds(g.getBounds());
        setGeoJsonLayer(g);
      } else if (result.boundingbox) {
        const bb = result.boundingbox.map(Number); // [south, north, west, east] sometimes
        const poly = L.polygon([
          [result.boundingbox[0], result.boundingbox[2]],
          [result.boundingbox[0], result.boundingbox[3]],
          [result.boundingbox[1], result.boundingbox[3]],
          [result.boundingbox[1], result.boundingbox[2]]
        ], { color: "#00a", weight: 2, fillOpacity: 0.05 }).addTo(map);
        map.fitBounds(poly.getBounds());
        setGeoJsonLayer(poly);
      } else {
        if (result.lat && result.lon) map.setView([Number(result.lat), Number(result.lon)], 13);
      }
    } catch (e) { console.error(e); }
  }

  return (
    <div>
      <div className="mb-3">
        <NominatimSearch onResult={handleNominatim} />
      </div>

      <div className="h-[60vh] w-full">
        <MapContainer
          whenCreated={(mapInstance)=>{ mapRef.current = mapInstance; }}
          center={[13.0827,80.2707]}
          zoom={11}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* click on map to place marker */}
          <MapClickHandler
            onClick={(latlng) => {
              setMarker(latlng);
            }}
          />

          {marker && (
            <Marker position={[marker.lat, marker.lng]} icon={pinIcon} draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const p = e.target.getLatLng();
                  setMarker({ lat: p.lat, lng: p.lng });
                }
              }}
            >
              <Popup>Station pin. Drag to fine-tune.</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={()=>{
          if (!marker) return alert("Place a pin first on the map.");
          onPick && onPick(marker, geoJsonLayer && geoJsonLayer.getBounds ? geoJsonLayer.getBounds().toBBoxString() : null);
        }} className="bg-blue-600 text-white px-4 py-2 rounded">Use pin</button>

        <button onClick={()=>{
          setMarker(null);
          if (geoJsonLayer) { geoJsonLayer.remove(); setGeoJsonLayer(null); }
        }} className="px-4 py-2 border rounded">Reset</button>
      </div>
    </div>
  );
}

// helper component to allow clicking on map to place marker
function MapClickHandler({ onClick }) {
  const map = useMap();
  useEffect(() => {
    const handler = (e) => onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    map.on("click", handler);
    return () => map.off("click", handler);
  }, [map, onClick]);
  return null;
}
