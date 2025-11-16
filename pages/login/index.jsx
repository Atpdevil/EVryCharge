import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function LoginMain() {
  const router = useRouter();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let p5Instance = null;

    (async () => {
      const p5 = (await import("p5")).default;
      p5Instance = p5;

      const TOPOLOGY = (await import("vanta/dist/vanta.topology.min")).default;

      if (!vantaEffect) {
        const effect = TOPOLOGY({
          el: vantaRef.current,
          p5: p5Instance,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x31c718,
          backgroundColor: 0x000000,
        });

        setVantaEffect(effect);
      }
    })();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="min-h-screen flex flex-col items-center justify-center relative"
    >
      <div className="z-10 flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold text-white">EVryCharge</h1>
        <p className="text-gray-200">Charge Anywhere. Anytime.</p>

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

        <div className="text-xs text-gray-300 mt-8">
          By continuing you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
