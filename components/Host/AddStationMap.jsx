"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = L.icon({
  iconUrl: "/icons/red-pin.png",
  iconSize: [40, 45],
  iconAnchor: [20, 45],
});

/* ---------------------------- MAP CLICK HANDLER ---------------------------- */
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

/* --------------------------- NOMINATIM SEARCH BAR -------------------------- */
function NominatimSearch({ onResult }) {
  const [q, setQ] = useState("");

  async function searchArea() {
    if (!q.trim()) return;

    const req = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(
        q
      )}`
    );

    const res = await req.json();

    onResult(res[0] || null);
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

/* ------------------------------- MAIN MAP UI ------------------------------- */
export default function AddStationMap({ onPick }) {
  const mapRef = useRef();
  const [marker, setMarker] = useState(null);
  const [geoLayer, setGeoLayer] = useState(null);

  /* ----------- HANDLE SEARCH RESULT (POLYGON OR BOUNDING BOX) ------------ */
  async function handleAreaResult(result) {
    const map = mapRef.current;
    if (!map) return;

    if (geoLayer) {
      geoLayer.remove();
      setGeoLayer(null);
    }

    // Reset view
    if (!result) {
      map.setView([20.5937, 78.9629], 5);
      return;
    }

    // Region polygon
    if (result.geojson) {
      const layer = L.geoJSON(result.geojson, {
        style: { color: "#0066cc", weight: 2, fillOpacity: 0.05 },
      }).addTo(map);

      map.fitBounds(layer.getBounds());
      setGeoLayer(layer);
    }

    // Fallback bounding box
    else if (result.boundingbox) {
      const bb = result.boundingbox.map(Number);

      const poly = L.polygon(
        [
          [bb[0], bb[2]],
          [bb[0], bb[3]],
          [bb[1], bb[3]],
          [bb[1], bb[2]],
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

      {/* THE CONTAINER MUST BE RELATIVE (to make button float correctly) */}
      <div className="relative h-[60vh] w-full mb-10">
        <MapContainer
          whenCreated={(map) => (mapRef.current = map)}
          center={[13.0827, 80.2707]}
          zoom={13}
          className="h-full w-full rounded-lg z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <MapClickHandler
          onClick={(pos) => {
            setMarker(pos);

            const map = mapRef.current;
            if (map && map.setView) {
              map.setView([pos.lat, pos.lng], 15);
            }
          }}
        />

          {marker && (
            <Marker position={[marker.lat, marker.lng]} icon={pinIcon} draggable>
              <Popup>Drag to adjust location</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* FLOATING BUTTON*/}
        <button
          className="
            absolute bottom-4 left-1/2 transform -translate-x-1/2
            bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg
            text-lg font-semibold z-9999
          "
          onClick={() => {
            if (!marker) return alert("Tap anywhere on the map to set the station location!");
            onPick(marker);
          }}
        >
          Use This Location
        </button>
      </div>
    </div>
  );
}
