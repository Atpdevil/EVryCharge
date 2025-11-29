import "../styles/globals.css";
import "../styles/leaflet-override.css";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import "@/components/BubbleMenu/BubbleMenu.css";
import "@/components/GradientText/GradientText.css";
import "@/components/TiltedCard/TiltedCard.css";
import "../styles/StarBorder.css";
import "@/components/Aurora/Aurora.css";
import "@/components/GridScan/GridScan.css";
import "@/components/PixelTransition/PixelTransition.css";
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    try {
      import("../components/store").then(mod => {
        const useStore = mod.useStore;
        useStore.getState().loadStationsFromLocal?.();
        useStore.getState().loadBookingsFromLocal?.();
      });
    } catch (e) {
      console.warn("store load error", e);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {/* Google Maps Script */}
      <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
      async
    />
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
