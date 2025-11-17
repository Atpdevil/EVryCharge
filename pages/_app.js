// pages/_app.js
import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
