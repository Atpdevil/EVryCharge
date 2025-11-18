import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
  useEffect(() => {
    useStore.getState().loadStationsFromLocal();
  }, []);
}
