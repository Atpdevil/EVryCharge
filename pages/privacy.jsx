export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black-300">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This policy describes how EVryCharge
        collects, uses, and protects your information.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect personal details such as your name, phone number, email,
        vehicle type, and usage logs. Location data is used only for showing
        nearby charging stations.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p className="mb-4">
        Your data helps us provide charging station listings, manage bookings,
        improve app performance, and offer customer support.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell your data. However, we may share relevant details with EV
        hosts during booking, or with authorities if legally required.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Data Security</h2>
      <p className="mb-4">
        We use standard security measures to protect your data. No digital
        platform is 100% secure, but we take reasonable steps to safeguard your
        information.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Permissions</h2>
      <p className="mb-4">
        The app may request access to your location for showing stations,
        and access to storage for image or document uploads when hosting
        a charging point.
      </p>
    </div>
  );
}
