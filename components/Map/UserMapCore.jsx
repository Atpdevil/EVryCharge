"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import { useStore } from "../store";
import { useState, useEffect, useMemo, useRef } from "react";
import LiveLocationMarker from "./LiveLocationMarker";
import BookingModal from "../../components/BookingModal";

// ---------------- ICON FIX ----------------
const chargerIcon = L.icon({
  iconUrl: "/icons/red-pin.png",
  iconSize: [40, 45],
  iconAnchor: [20, 45]
});

// remove default behavior that breaks cluster icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "/icons/red-pin.png",
  iconRetinaUrl: "/icons/red-pin.png",
  shadowUrl: null
});

// ---------------- DISTANCE ----------------
function distanceKm(a1, o1, a2, o2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dA = toRad(a2 - a1);
  const dO = toRad(o2 - o1);
  const t =
    Math.sin(dA / 2) ** 2 +
    Math.cos(toRad(a1)) *
      Math.cos(toRad(a2)) *
      Math.sin(dO / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t));
}

// ---------------- MAP CLICK ----------------
function MapClickHandler({ onClick }) {
  const map = useMap();
  useEffect(() => {
    if (!onClick) return;
    const fn = (e) => onClick(e.latlng);
    map.on("click", fn);
    return () => map.off("click", fn);
  }, [map, onClick]);
  return null;
}

// -------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------
export default function UserMapCore() {
  const mapRef = useRef(null);
  const [userPos, setUserPos] = useState(null);
  const [bookingStation, setBookingStation] = useState(null);

  const hostStations = useStore((s) => s.stations || []);
  const loadStations = useStore((s) => s.loadStationsFromLocal);

  // filters
  const [plugFilter, setPlug] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [priceMax, setPriceMax] = useState(100);
  const [radius, setRadius] = useState(99999);
  const [search, setSearch] = useState("");

  // load stations
  useEffect(() => {
    loadStations();
  }, []);

  // merge stations
  const allStations = useMemo(() => {
    return (hostStations || []).map((s, i) => ({
      ...s,
      id: s.id || `host-${i}`,
      lat: Number(s.lat),
      lng: Number(s.lng)
    }));
  }, [hostStations]);

  // filtering
  const filtered = useMemo(() => {
    return allStations
      .map((s) => ({
        ...s,
        distance: userPos ? distanceKm(userPos[0], userPos[1], s.lat, s.lng) : 99999
      }))
      .filter((s) => {
        if (plugFilter && s.plug !== plugFilter) return false;
        if (statusFilter && s.status !== statusFilter) return false;
        if (s.price > priceMax) return false;
        if (userPos && s.distance > radius) return false;
        if (
          search &&
          !(
            s.city?.toLowerCase().includes(search.toLowerCase()) ||
            s.pincode?.includes(search)
          )
        )
          return false;
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [allStations, plugFilter, statusFilter, priceMax, radius, userPos, search]);

  // ---------------- CLUSTER FIX ----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map._clusterLayer) {
      map.removeLayer(map._clusterLayer);
    }

    const cluster = L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        return L.divIcon({
          html: `<div style="background:#e11d48;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;">
            ${cluster.getChildCount()}
          </div>`,
          className: "cluster-icon",
          iconSize: [32, 32]
        });
      }
    });

    filtered.forEach((s) => {
      const marker = L.marker([s.lat, s.lng], {
        icon: chargerIcon,
        riseOnHover: true
      });

      marker.bindPopup(`
        <div style="min-width:180px">
          <b>${s.name}</b><br/>
          Price: ₹${s.price}<br/>
          Status: ${s.status}<br/>
          <button id="book-${s.id}" style="margin-top:8px;padding:6px 10px;border:none;background:#2563eb;color:white;border-radius:6px;cursor:pointer">
            Book
          </button>
        </div>
      `);

      marker.on("popupopen", () => {
        const btn = document.getElementById(`book-${s.id}`);
        if (btn) btn.onclick = () => setBookingStation(s);
      });

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    map._clusterLayer = cluster;
  }, [filtered]);

  return (
    <div className="ml-64 p-6 w-full">
      {/* FILTERS */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          className="border p-2 rounded"
          placeholder="Search city or pincode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={plugFilter}
          onChange={(e) => setPlug(e.target.value)}
        >
          <option value="">All Plugs</option>
          <option value="Type 2">Type 2</option>
          <option value="CCS2">CCS2</option>
        </select>

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Any Status</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
        </select>

        <div className="flex items-center gap-2">
          <label>Price ≤ ₹{priceMax}</label>
          <input
            type="range"
            min="5"
            max="100"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
          />
        </div>

        <select
          className="border p-2 rounded"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        >
          <option value={99999}>Anywhere</option>
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={20}>20 km</option>
        </select>
      </div>

      {/* MAP */}
      <div className="w-full h-[80vh] rounded shadow overflow-hidden">
        <MapContainer
          center={[12.9, 77.6]}
          zoom={12}
          whenCreated={(m) => (mapRef.current = m)}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LiveLocationMarker setUserPos={setUserPos} />

          <MapClickHandler />
        </MapContainer>
      </div>

      {bookingStation && (
        <BookingModal
          station={bookingStation}
          onClose={() => setBookingStation(null)}
        />
      )}
    </div>
  );
}
