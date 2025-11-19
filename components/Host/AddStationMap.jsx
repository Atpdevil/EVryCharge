"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* -------------------------------------------------------
   RED PIN ICON (MAKE SURE /public/icons/red-pin.png EXISTS!)
--------------------------------------------------------*/
const pinIcon = L.icon({
  iconUrl: "/icons/red-pin.png",
  iconSize: [40, 45],
  iconAnchor: [20, 45],
});

/* ---------- MAP CLICK HANDLER ---------- */
function MapClickHandler({ onClick }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, onClick]);

  return null;
}

/* ---------- NOMINATIM SEARCH ---------- */
function NominatimSearch({ onResult }) {
  const [q, setQ] = useState("");

  async function searchArea() {
    if (!q.trim()) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(
        q
      )}`
    );
    const json = await res.json();

    onResult(json[0] || null);
  }

  return (
    <div className="flex gap-2 mb-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="p-2 border rounded w-full"
        placeholder="Search region (e.g. Bengaluru)"
      />
      <button
        onClick={searchArea}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Search
      </button>
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
export default function AddStationMap({ onPick }) {
  const mapRef = useRef();
  const [marker, setMarker] = useState(null);
  const [geoLayer, setGeoLayer] = useState(null);

  async function handleAreaResult(result) {
    const map = mapRef.current;
    if (!map) return;

    // Remove previous polygons
    if (geoLayer) {
      geoLayer.remove();
      setGeoLayer(null);
    }

    if (!result) {
      map.setView([20.5937, 78.9629], 5);
      return;
    }

    // Draw polygon region
    if (result.geojson) {
      const layer = L.geoJSON(result.geojson, {
        style: { color: "#0066cc", weight: 2, fillOpacity: 0.05 },
      }).addTo(map);

      map.fitBounds(layer.getBounds());
      setGeoLayer(layer);
    } else if (result.boundingbox) {
      const b = result.boundingbox.map(Number);

      const poly = L.polygon(
        [
          [b[0], b[2]],
          [b[0], b[3]],
          [b[1], b[3]],
          [b[1], b[2]],
        ],
        { color: "#0066cc", weight: 2, fillOpacity: 0.05 }
      ).addTo(map);

      map.fitBounds(poly.getBounds());
      setGeoLayer(poly);
    }
  }

  return (
    <div>
      <NominatimSearch onResult={handleAreaResult} />

      <div className="h-[60vh] w-full mb-3">
        <MapContainer
          whenCreated={(map) => (mapRef.current = map)}
          center={[13.0827, 80.2707]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapClickHandler
            onClick={(pos) => {
              setMarker(pos);
            }}
          />

          {marker && (
            <Marker position={[marker.lat, marker.lng]} icon={pinIcon} draggable>
              <Popup>Station Pin — drag to adjust</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          if (!marker) return alert("Tap on the map to place the station pin!");
          onPick(marker);
        }}
      >
        Use This Location
      </button>
    </div>
  );
}
