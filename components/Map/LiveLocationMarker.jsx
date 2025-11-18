"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function LiveLocationMarker({ setUserPos }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !navigator.geolocation) return;

    let marker = null;

    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setUserPos([lat, lng]);

      if (!marker) {
        marker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
        map.setView([lat, lng], 14);
      } else {
        marker.setLatLng([lat, lng]);
      }
    };

    const err = (e) => console.warn("Location error", e);

    const watcher = navigator.geolocation.watchPosition(success, err, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 1000,
    });

    return () => {
      navigator.geolocation.clearWatch(watcher);
      if (marker) map.removeLayer(marker);
    };
  }, [map, setUserPos]);

  return null;
}
