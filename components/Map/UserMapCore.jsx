"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet.markercluster";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";
import "leaflet.heat/dist/leaflet-heat.js";

import { useStore } from "../../components/store";
import { useState, useEffect, useMemo, useRef } from "react";

import chargers from "../../data/chargers.json";
import LiveLocationMarker from "./LiveLocationMarker";
import BookingModal from "../../components/BookingModal";

const chargerIcon = new L.Icon({
  iconUrl: "/charger.png",
  iconSize: [40, 45],
});

/* ---- small helper: haversine distance (km) ---- */
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------- ROUTE DRAWER (Leaflet Routing) ---------- */
function RouteDrawer({ userPos, dest }) {
  const map = useMap();
  useEffect(() => {
    if (!userPos || !dest) return;
    const routing = L.Routing.control({
      waypoints: [
        L.latLng(userPos[0], userPos[1]),
        L.latLng(dest.lat, dest.lng),
      ],
      lineOptions: { styles: [{ color: "#00b300", weight: 6 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => map.removeControl(routing);
  }, [userPos, dest, map]);

  return null;
}

/* ---------- HEATMAP LAYER ---------- */
function HeatmapLayer({ stations }) {
  const map = useMap();
  useEffect(() => {
    if (!L.heatLayer) return;
    if (!stations || stations.length === 0) return;

    const pts = stations.map((c) => [c.lat, c.lng, 0.6]);
    const heat = L.heatLayer(pts, { radius: 25, blur: 20 }).addTo(map);
    return () => heat.remove();
  }, [map, stations]);

  return null;
}

/* ---------- Cluster creation inline to avoid missing modules ---------- */
function createClusterLayer(stations, icon, onPopupBook, onPopupOpenDetail) {
  const clusterGroup = L.markerClusterGroup({ chunkedLoading: true });
  stations.forEach((st, idx) => {
    const id = st.id || `builtin-${idx}`;
    const marker = L.marker([st.lat, st.lng], { icon });

    // create popup HTML
    const statusColor =
      st.status === "Available" ? "green" : st.status === "Busy" ? "orange" : "gray";
    const popupHtml = `
      <div style="min-width:200px">
        <div style="font-weight:600;margin-bottom:6px">${st.name || "Station"}</div>
        <div style="font-size:13px;margin-bottom:6px">Price: ₹${st.price || "-"} / kWh</div>
        <div style="font-size:13px;margin-bottom:8px">Status: <span style="color:${statusColor};font-weight:600;">${st.status || "Unknown"}</span></div>
        <div style="font-size:13px;margin-bottom:8px">Supported: ${Array.isArray(st.supportedModels) ? st.supportedModels.slice(0,3).join(", ") : "—"}</div>
        ${
          st.status === "Available"
            ? `<div style="text-align:right"><button id="book-${id}" style="background:#16a34a;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer">Book this charger</button></div>`
            : `<div style="text-align:right;color:#666;font-size:13px">Booking unavailable</div>`
        }
      </div>
    `;

    marker.bindPopup(popupHtml);

    // when popup opens, attach handler to button
    marker.on("popupopen", (e) => {
      // optional detail callback
      onPopupOpenDetail && onPopupOpenDetail(st);

      // attach click to book button if available
      const btn = document.getElementById(`book-${id}`);
      if (btn) {
        btn.onclick = (ev) => {
          ev.preventDefault();
          onPopupBook && onPopupBook(st);
        };
      }
    });

    clusterGroup.addLayer(marker);
  });

  return clusterGroup;
}

/* ---------- Nominatim polygon drawing helper ---------- */
function drawGeoJsonOnMap(map, geojson, style = { color: "#0066cc", weight: 2, fillOpacity: 0.05 }) {
  try {
    const layer = L.geoJSON(geojson, { style }).addTo(map);
    map.fitBounds(layer.getBounds());
    return layer;
  } catch (e) {
    console.error("drawGeoJsonOnMap", e);
    return null;
  }
}

/* ---------- Map click handler for placing pin (not used here but kept) ---------- */
function MapClickHandler({ onClick }) {
  const map = useMap();
  useEffect(() => {
    const handler = (e) => onClick && onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    map.on("click", handler);
    return () => map.off("click", handler);
  }, [map, onClick]);
  return null;
}

/* ---------------------- MAIN COMPONENT ----------------------- */
export default function UserMapCore() {
  const [userPos, setUserPos] = useState(null);
  const [bookingStation, setBookingStation] = useState(null);
  const [navStation, setNavStation] = useState(null);
  const [selectedPopupStation, setSelectedPopupStation] = useState(null); // station currently opened popup

  const hostStations = useStore((s) => s.stations || []);
  const userVehicle = useStore((s) => s.selectedVehicle); // must have .name and .type

  // filters
  const [plugFilter, setPlug] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [priceMax, setPriceMax] = useState(20);
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(99999);

  // nominatim polygon layer ref
  const nomLayerRef = useRef(null);
  const mapRef = useRef(null);

  /* merge builtin chargers + host stations */
  const allStations = useMemo(() => {
    // Normalize host station fields if necessary
    const normalizedHost = (hostStations || []).map((h) => ({
      ...h,
      // ensure lat/lng are numbers
      lat: Number(h.lat),
      lng: Number(h.lng),
      id: h.id || `host-${h.name}-${h.lat}-${h.lng}`,
    }));
    // builtin chargers might not have id: assign
    const normalizedBuiltin = (chargers || []).map((c, i) => ({ ...c, id: c.id || `builtin-${i}` }));
    return [...normalizedBuiltin, ...normalizedHost];
  }, [hostStations]);

  /* filtered stations logic: includes userVehicle matching */
  const filtered = useMemo(() => {
    return allStations
      .map((c) => ({
        ...c,
        distance: userPos ? distanceKm(userPos[0], userPos[1], c.lat, c.lng) : 99999,
      }))
      .filter((c) => {
        // vehicle match: if user selected, station must support that model and type
        if (userVehicle) {
          const typeOK =
            !c.supportedVehicleTypes ||
            c.supportedVehicleTypes.length === 0 ||
            c.supportedVehicleTypes.includes(userVehicle.type);
          const modelOK =
            !c.supportedModels ||
            c.supportedModels.length === 0 ||
            c.supportedModels.includes(userVehicle.name);
          if (!typeOK || !modelOK) return false;
        }

        const plugOK = plugFilter ? c.plug === plugFilter : true;
        const statusOK = statusFilter ? c.status === statusFilter : true;
        const priceOK = c.price <= priceMax;
        const radiusOK = userPos ? c.distance <= radius : true;
        const searchOK =
          search === "" ||
          (c.city && c.city.toLowerCase().includes(search.toLowerCase())) ||
          (c.pincode && c.pincode.includes(search));

        return plugOK && statusOK && priceOK && radiusOK && searchOK;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [allStations, userPos, userVehicle, plugFilter, statusFilter, priceMax, radius, search]);

  /* ---------- handle map instance reference ---------- */
  useEffect(() => {
    // no-op; map ref set in MapContainer when created via whenCreated
  }, []);

  /* ---------- Search & draw region using Nominatim ---------- */
  async function handleSearchRegion(query) {
    if (!query || !mapRef.current) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { "User-Agent": "EVryCharge/1.0" } });
      const json = await res.json();
      if (!json || json.length === 0) {
        alert("No region found");
        return;
      }
      const best = json[0];
      // remove old
      if (nomLayerRef.current) {
        nomLayerRef.current.remove();
        nomLayerRef.current = null;
      }
      if (best.geojson) {
        const layer = drawGeoJsonOnMap(mapRef.current, best.geojson, { color: "#ff8c00", weight: 2, fillOpacity: 0.05 });
        nomLayerRef.current = layer;
      } else if (best.boundingbox) {
        const bb = best.boundingbox.map(Number);
        const poly = L.polygon(
          [
            [bb[0], bb[2]],
            [bb[0], bb[3]],
            [bb[1], bb[3]],
            [bb[1], bb[2]],
          ],
          { color: "#ff8c00", weight: 2, fillOpacity: 0.05 }
        ).addTo(mapRef.current);
        mapRef.current.fitBounds(poly.getBounds());
        nomLayerRef.current = poly;
      } else if (best.lat && best.lon) {
        mapRef.current.setView([Number(best.lat), Number(best.lon)], 12);
      }
    } catch (e) {
      console.error("region search fail", e);
      alert("Search failed");
    }
  }

  /* ---------- cluster creation requires direct map manipulation ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // remove any previously added cluster layer
    if (map._ev_cluster_layer) {
      try {
        map.removeLayer(map._ev_cluster_layer);
      } catch (e) {}
      map._ev_cluster_layer = null;
    }

    const cluster = createClusterLayer(
      filtered,
      chargerIcon,
      // onPopupBook
      (station) => {
        // Open booking modal only if station is Available
        if (station.status === "Available") setBookingStation(station);
      },
      // onPopupOpenDetail: set selected popup station for side details if needed
      (station) => setSelectedPopupStation(station)
    );

    map._ev_cluster_layer = cluster;
    map.addLayer(cluster);

    return () => {
      try {
        if (map._ev_cluster_layer) {
          map.removeLayer(map._ev_cluster_layer);
          map._ev_cluster_layer = null;
        }
      } catch (e) {}
    };
  }, [filtered]); // re-create cluster when filtered list changes

  /* ---------- Add heat layer separately (optional) ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // cleanup old heat
    if (map._ev_heat) {
      try {
        map.removeLayer(map._ev_heat);
      } catch (e) {}
      map._ev_heat = null;
    }
    if (filtered && filtered.length > 0 && L.heatLayer) {
      const pts = filtered.map((c) => [c.lat, c.lng, 0.5]);
      const heat = L.heatLayer(pts, { radius: 25, blur: 20 }).addTo(map);
      map._ev_heat = heat;
    }
    return () => {
      if (map && map._ev_heat) {
        try {
          map.removeLayer(map._ev_heat);
          map._ev_heat = null;
        } catch (e) {}
      }
    };
  }, [filtered]);

  /* ---------- UI render ---------- */
  return (
    <div className="ml-64 w-full h-screen p-6">
      {/* FILTER PANEL */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-center flex-wrap">
        <input
          className="p-3 border rounded flex-1 min-w-[240px]"
          placeholder="Search city / pincode (e.g. Bengaluru)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => handleSearchRegion(search)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>

        <select
          className="p-3 border rounded"
          value={plugFilter}
          onChange={(e) => setPlug(e.target.value)}
        >
          <option value="">All Plugs</option>
          <option value="Type 2">Type 2</option>
          <option value="CCS2">CCS2</option>
          <option value="GB/T">GB/T</option>
        </select>

        <select
          className="p-3 border rounded"
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Any Status</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Offline">Offline</option>
        </select>

        <div>
          <label>Price ≤ ₹{priceMax}</label>
          <input
            type="range"
            min="5"
            max="50"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-40"
          />
        </div>

        <div>
          <label>Radius: {radius} km</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="p-3 border rounded"
          >
            <option value={99999}>Anywhere</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        <button
          onClick={() => {
            setPlug("");
            setStatus("");
            setPriceMax(20);
            setRadius(99999);
            setSearch("");
            // remove nominatim layer
            if (nomLayerRef.current) {
              try {
                nomLayerRef.current.remove();
              } catch (e) {}
              nomLayerRef.current = null;
            }
          }}
          className="p-3 bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      {/* MAP */}
      <div className="w-full h-[80vh] rounded overflow-hidden shadow">
        <MapContainer
          whenCreated={(m) => (mapRef.current = m)}
          center={[20.59, 78.96]}
          zoom={5}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* live location dot only (no circle) */}
          <LiveLocationMarker setUserPos={setUserPos} />

          {/* Map click handler (not used but safe) */}
          <MapClickHandler onClick={() => {}} />

          {/* Heat (optional) - will be managed via effect */}
          <HeatmapLayer stations={filtered} />

          {/* Route (if any) */}
          {navStation && userPos && <RouteDrawer userPos={userPos} dest={navStation} />}
        </MapContainer>
      </div>

      {/* Booking modal */}
      {bookingStation && (
        <BookingModal station={bookingStation} onClose={() => setBookingStation(null)} />
      )}
    </div>
  );
}
