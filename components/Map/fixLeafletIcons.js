"use client";

import L from "leaflet";

export function fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconUrl: "/icons/red-pin.png",
    iconRetinaUrl: "/icons/red-pin.png",
    shadowUrl: null
  });
}
