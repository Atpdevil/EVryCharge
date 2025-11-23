import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SignupBubbleMenu from "@/components/BubbleMenu/SignupBubbleMenu";
import GradientText from "@/components/GradientText";

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
          color: 0x0,
          backgroundColor: 0x440025,
          maxDistance: 26.0,
          points: 15.00,
          spacing: 18.0,
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
      <GradientText
        colors={["#00ff99", "#007bff", "#00ff99"]}
        animationSpeed={4}
        className="text-4xl font-extrabold"
      >
        EVryCharge
      </GradientText>

        <p className="text-black-200">Charge Anywhere. Anytime.</p>

        <SignupBubbleMenu />

        <div className="text-xs text-black-300 mt-8">
          By continuing you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
