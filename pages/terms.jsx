export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black-300">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to EVryCharge. By using our app, services, or creating an account,
        you agree to the following terms. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Use of Service</h2>
      <p className="mb-4">
        EVryCharge provides EV charging station information, booking options, and
        host management tools. You agree to use the platform legally, ethically,
        and without abusing or disrupting the service.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. User Accounts</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account
        and for any activity that occurs under it. Please keep your information
        accurate and up-to-date.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Payments & Charges</h2>
      <p className="mb-4">
        EVryCharge may facilitate payments between users and hosts. Actual
        transaction terms, prices, and availability are determined by the host.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Host Responsibilities</h2>
      <p className="mb-4">
        Hosts must provide accurate station information, pricing, and availability.
        Misrepresentation or illegal operations may result in account suspension.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Limitations</h2>
      <p className="mb-4">
        We do not guarantee uninterrupted access or availability of any charging
        station. EVryCharge is not responsible for third-party equipment failures,
        incorrect host information, or damages resulting from misuse.
      </p>
    </div>
  );
}
