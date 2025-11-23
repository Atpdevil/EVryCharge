"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const GridScan = dynamic(() => import("./GridScan/GridScan"), { ssr: false });

export default function GridBackground() {
  useEffect(() => {
    document.body.style.background = "black";
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        background: "black",
        pointerEvents: "none",
        transform: "translateZ(0)",
      }}
    >
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#00FF95"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>
    </div>
  );
}
