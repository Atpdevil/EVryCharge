import Aurora from "@/components/Aurora/Aurora";
import GradientText from "@/components/GradientText/GradientText";
import SignupBubbleMenu from "@/components/BubbleMenu/SignupBubbleMenu";
import Link from "next/link";

export default function LoginMain() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center px-4">

      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Aurora
          colorStops={["#00ff88", "#007bff", "#8b00ff"]}
          amplitude={1.2}
          blend={0.5}
          speed={0.8}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-md w-full py-12">

        <GradientText
          colors={["#00ff99", "#007bff", "#00ff99"]}
          animationSpeed={4}
          className="text-3xl sm:text-5xl font-extrabold leading-tight"
        >
          EVryCharge
        </GradientText>

        <p className="text-gray-300 text-base sm:text-lg">
          Charge Anywhere. Anytime.
        </p>

        {/* Bubble Menu */}
        <div className="w-full flex justify-center">
          <SignupBubbleMenu />
        </div>

        {/* Terms & Policy */}
        <p className="text-xs text-gray-400 mt-4 leading-relaxed px-4">
          By continuing you agree to our{" "}
          <Link
            href="/terms"
            className="text-blue-400 hover:text-blue-500 underline transition"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-blue-400 hover:text-blue-500 underline transition"
          >
            Privacy Policy
          </Link>.
        </p>
      </div>

    </div>
  );
}
