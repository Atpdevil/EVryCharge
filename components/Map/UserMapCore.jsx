"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useStore } from "../store";
import BookingModal from "../BookingModal";
import LiveLocationMarker from "./LiveLocationMarker";

export default function UserMapCore() {
  const mapRef = useRef(null);
  const googleMap = useRef(null);
  const markersRef = useRef([]);

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

  useEffect(() => {
    loadStations();
  }, []);

  // normalized stations
  const allStations = useMemo(() => {
    return hostStations.map((st, i) => ({
      id: st.id || "st-" + i,
      name: st.name,
      lat: Number(st.lat),
      lng: Number(st.lng),
      price: Number(st.price),
      plug: st.plug,
      status: st.status,
      city: st.city || "",
      pincode: st.pincode || "",
    }));
  }, [hostStations]);

  // filtering
  const filtered = useMemo(() => {
    const distanceKm = (aLat, aLng, bLat, bLng) => {
      const R = 6371;
      const dLat = ((bLat - aLat) * Math.PI) / 180;
      const dLng = ((bLng - aLng) * Math.PI) / 180;
      const lat1 = (aLat * Math.PI) / 180;
      const lat2 = (bLat * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    return allStations
      .map((st) => ({
        ...st,
        distance: userPos ? distanceKm(userPos[0], userPos[1], st.lat, st.lng) : 0,
      }))
      .filter((st) => {
        if (plugFilter && st.plug !== plugFilter) return false;
        if (statusFilter && st.status !== statusFilter) return false;
        if (st.price > priceMax) return false;
        if (userPos && st.distance > radius) return false;

        if (
          search &&
          !(st.city.toLowerCase().includes(search.toLowerCase()) ||
            st.pincode.includes(search))
        )
          return false;

        return true;
      });
  }, [allStations, plugFilter, statusFilter, priceMax, radius, userPos, search]);

  // Initialize map ONCE
  useEffect(() => {
    if (!mapRef.current || googleMap.current) return;

    googleMap.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 12.9, lng: 77.6 },
      zoom: 12,
      disableDefaultUI: false,
    });
  }, []);

  // Draw markers when filtered changes
  useEffect(() => {
    if (!googleMap.current) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    filtered.forEach((st) => {
      const marker = new window.google.maps.Marker({
        position: { lat: st.lat, lng: st.lng },
        map: googleMap.current,
        icon: {
          url: "/icons/red-pin.png",
          scaledSize: new window.google.maps.Size(40, 45),
          anchor: new window.google.maps.Point(20, 45),
        },
      });

      markersRef.current.push(marker);

      // popup content with BOOK button
      const html = `
        <div style="min-width:200px;font-family:sans-serif">
          <b>${st.name}</b><br/>
          Price: ₹${st.price}<br/>
          Status: ${st.status}<br/>
          Plug: ${st.plug}<br/><br/>
          <button id="book-${st.id}" 
            style="padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;">
            Book
          </button>
        </div>
      `;

      const popup = new window.google.maps.InfoWindow({
        content: html,
      });

      marker.addListener("click", () => {
        popup.open(googleMap.current, marker);

        setTimeout(() => {
          const btn = document.getElementById(`book-${st.id}`);
          if (btn) btn.onclick = () => setBookingStation(st);
        }, 150);
      });
    });
  }, [filtered]);

  return (
    <div className="ml-64 p-6">

      {/* Filters */}
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
      <div className="w-full h-[80vh] rounded overflow-hidden shadow">
        <div ref={mapRef} className="w-full h-full" />

        <LiveLocationMarker setUserPos={setUserPos} googleMapRef={googleMap} />
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
