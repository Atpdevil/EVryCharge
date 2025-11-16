import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function LoginMain() {
  const router = useRouter();
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const THREE = await import("three");
      const VANTA = (await import("vanta/dist/vanta.net.min")).default;

      if (mounted && !vantaEffect.current) {
        vantaEffect.current = VANTA({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x25d90b,
          backgroundColor: 0x405119,
          maxDistance: 26.0,
          spacing: 17.0,
        });
      }
    })();

    return () => {
      mounted = false;
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (_) {}
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="min-h-screen flex flex-col items-center justify-center relative"
    >
      <div className="z-10 flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold text-black">EVryCharge</h1>
        <p className="text-black-200">Charge Anywhere. Anytime.</p>

        <div className="w-full max-w-md flex flex-col gap-4 mt-6">
          <button
            className="p-4 bg-white border rounded-lg shadow hover:bg-gray-100"
            onClick={() => router.push("/login/user")}
          >
            Login as User
          </button>

          <button
            className="p-4 bg-white border rounded-lg shadow hover:bg-gray-100"
            onClick={() => router.push("/login/host")}
          >
            Login as Host
          </button>
        </div>

        <div className="text-xs text-black-300 mt-8">
          By continuing you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
