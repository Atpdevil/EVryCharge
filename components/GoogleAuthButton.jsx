// components/GoogleAuthButton.jsx
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleAuthButton({ onSuccess }) {
  return (
    <GoogleLogin
      onSuccess={(res) => {
        const token = res.credential;
        const payload = JSON.parse(atob(token.split(".")[1]));
        onSuccess(payload);
      }}
      onError={() => console.log("Google Login Failed")}
      theme="outline"
      shape="pill"
      size="large"
    />
  );
}
