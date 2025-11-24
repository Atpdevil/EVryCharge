"use client";

import dynamic from "next/dynamic";

const GridBackground = dynamic(() => import("../../components/GridBackground"), { ssr: false });
import HologramCard from "../../components/HologramCard";

export default function HostSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <GridBackground />
      <div style={{ width: "100%", maxWidth: 540, padding: 20, zIndex: 10 }}>
        <HologramCard role="host" />
      </div>
      <style jsx>{`
        .min-h-screen {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
