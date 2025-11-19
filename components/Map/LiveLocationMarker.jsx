"use client";

import { useEffect, useRef } from "react";

export default function LiveLocationMarker({ setUserPos, googleMapRef }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserPos([lat, lng]);

        if (!googleMapRef.current) return;

        // create marker ONCE
        if (!markerRef.current) {
          markerRef.current = new window.google.maps.Marker({
            position: { lat, lng },
            map: googleMapRef.current,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
              scale: 7,
            },
          });

          googleMapRef.current.setCenter({ lat, lng });
        } else {
          // update live location marker
          markerRef.current.setPosition({ lat, lng });
        }
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return null;
}
