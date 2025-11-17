"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet.heat/dist/leaflet-heat.js";
import { useEffect, useMemo, useState } from "react";

import UserSidebar from "../../components/User/UserSidebar";
import chargers from "../../data/chargers.json";
import BookingModal from "../../components/BookingModal";

import { distanceKm } from "../../components/Map/distance";
import LiveLocationMarker from "../../components/Map/LiveLocationMarker";
import { createClusterLayer } from "../../components/Map/ChargerCluster";

const heat = window.L?.heatLayer || L.heatLayer;
const chargerIcon = new L.Icon({
  iconUrl: "/charger.png",
  iconSize: [40, 45],
});

// ---------------- ROUTE DRAWING ----------------
function RouteDrawer({ userPos, dest }) {
  const map = useMap();

  useEffect(() => {
    if (!userPos || !dest) return;

    const routing = L.Routing.control({
      waypoints: [L.latLng(userPos[0], userPos[1]), L.latLng(dest.lat, dest.lng)],
      lineOptions: { styles: [{ color: "#00b300", weight: 6 }] },
      createMarker: () => null,
    }).addTo(map);

    return () => map.removeControl(routing);
  }, [userPos, dest, map]);

  return null;
}

export default function UserMap() {
  const [userPos, setUserPos] = useState(null);

  const [bookingStation, setBookingStation] = useState(null);
  const [navStation, setNavStation] = useState(null);

  // FILTERS
  const [plugFilter, setPlugFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fastFilter, setFastFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [radius, setRadius] = useState(99999); // km (big default)

  // FILTER + DISTANCE CALC
  const filteredChargers = useMemo(() => {
    return chargers
      .map((c) => ({
        ...c,
        distance: userPos
          ? distanceKm(userPos[0], userPos[1], c.lat, c.lng)
          : 99999,
      }))
      .filter((c) => {
        const byPlug = plugFilter ? c.plug === plugFilter : true;
        const byStatus = statusFilter ? c.status === statusFilter : true;
        const byFast = fastFilter ? c.fast === true : true;
        const byPrice = c.price <= maxPrice;

        const byRadius = userPos ? c.distance <= radius : true;

        const bySearch =
          searchText.trim() === "" ||
          c.city.toLowerCase().includes(searchText.toLowerCase()) ||
          c.pincode.includes(searchText);

        return byPlug && byStatus && byFast && byPrice && byRadius && bySearch;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [plugFilter, statusFilter, fastFilter, maxPrice, radius, searchText, userPos]);

  // HEATMAP LAYER
  function HeatmapLayer() {
  const map = useMap();

  useEffect(() => {
    if (!L.heatLayer) {
      console.warn("HeatLayer plugin not found");
      return;
    }

    const pts = chargers.map((c) => [c.lat, c.lng, 0.5]);

    const heat = L.heatLayer(pts, {
      radius: 25,
      blur: 15,
      maxZoom: 12,
    }).addTo(map);

    return () => {
      if (heat) heat.remove();
    };
  }, [map]);

  return null;
}

  // MARKER CLUSTER LAYER
  function ClusterLayer() {
    const map = useMap();

    useEffect(() => {
      const cluster = createClusterLayer(filteredChargers, chargerIcon, (charger) =>
        setBookingStation(charger)
      );
      map.addLayer(cluster);

      return () => map.removeLayer(cluster);
    }, [filteredChargers, map]);

    return null;
  }

  return (
    <div className="flex">
      <UserSidebar />

      <div className="ml-64 w-full h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Find Chargers</h1>

        {/* ---------------- FILTER PANEL ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-4">

          <input
            placeholder="Search city or pincode"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="p-3 border rounded bg-white shadow"
          />

          <select
            value={plugFilter}
            onChange={(e) => setPlugFilter(e.target.value)}
            className="p-3 border rounded bg-white shadow"
          >
            <option value="">All Plugs</option>
            <option value="Type 2">Type 2</option>
            <option value="CCS2">CCS2</option>
            <option value="GB/T">GB/T</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border rounded bg-white shadow"
          >
            <option value="">Any Status</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>

          <button
            onClick={() => setFastFilter(!fastFilter)}
            className={`p-3 rounded bg-white shadow border ${
              fastFilter ? "border-green-600" : "border-gray-300"
            }`}
          >
            ⚡ Fast Charger
          </button>

          {/* PRICE SLIDER */}
          <div>
            <label>Max Price: ₹{maxPrice}</label>
            <input
              type="range"
              min="5"
              max="20"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full"
            />
          </div>

          {/* RADIUS FILTER */}
          <div>
            <label>Radius: {radius} km</label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="p-3 border rounded bg-white shadow"
            >
              <option value={99999}>Anywhere</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>

          {/* RESET */}
          <button
            onClick={() => {
              setPlugFilter("");
              setStatusFilter("");
              setFastFilter(false);
              setMaxPrice(20);
              setRadius(99999);
              setSearchText("");
            }}
            className="p-3 rounded bg-gray-200 shadow"
          >
            Reset
          </button>

        </div>

        {/* ---------------- MAP ---------------- */}
        <div className="w-full h-[80vh] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LiveLocationMarker setUserPos={setUserPos} />

            {/* HEATMAP */}
            <HeatmapLayer />

            {/* CLUSTERS */}
            <ClusterLayer />

            {/* ROUTE DRAWING */}
            {navStation && userPos && (
              <RouteDrawer userPos={userPos} dest={navStation} />
            )}
          </MapContainer>
        </div>
      </div>

      {/* ---------------- BOOKING MODAL ---------------- */}
      {bookingStation && (
        <BookingModal
          station={bookingStation}
          onClose={() => setBookingStation(null)}
        />
      )}
    </div>
  );
}
