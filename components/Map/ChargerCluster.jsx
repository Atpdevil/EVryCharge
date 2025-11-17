import "leaflet.markercluster";
import L from "leaflet";

export function createClusterLayer(chargers, chargerIcon, onClick) {
  const cluster = L.markerClusterGroup();

  chargers.forEach((c) => {
    const marker = L.marker([c.lat, c.lng], { icon: chargerIcon });
    marker.bindPopup(`
      <b>${c.name}</b><br>
      Plug: ${c.plug}<br>
      Price: ₹${c.price}/kWh<br>
      Status: ${c.status}<br>
      Fast: ${c.fast ? "Yes" : "No"}
    `);
    marker.on("popupopen", () => onClick(c));
    cluster.addLayer(marker);
  });

  return cluster;
}
