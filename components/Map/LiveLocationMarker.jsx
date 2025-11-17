import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "/user.png",
  iconSize: [40, 40]
});

export default function LiveLocationMarker({ setUserPos }) {
  const map = useMap();

  useEffect(() => {
    map.locate({ watch: true, enableHighAccuracy: true });

    map.on("locationfound", (e) => {
      setUserPos([e.latitude, e.longitude]);
      L.marker([e.latitude, e.longitude], { icon: userIcon }).addTo(map);
    });

  }, [map]);

  return null;
}
