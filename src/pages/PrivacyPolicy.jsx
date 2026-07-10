import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="bg-[#FFF8F0] py-24">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <p className="text-gray-600 leading-8 mb-8">
          At First Track Skills Academy, we respect your privacy. This
          Privacy Policy explains how we collect, use and protect your
          personal information.
        </p>

        <div className="space-y-8">

          <div>
            <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
            <p className="text-gray-600 leading-8">
              We may collect your name, email address, phone number,
              educational details and payment information during
              registration.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">How We Use Information</h2>
            <ul className="list-disc ml-6 text-gray-600 space-y-2">
              <li>Course registration</li>
              <li>Student support</li>
              <li>Course updates</li>
              <li>Placement assistance</li>
              <li>Marketing communications (optional)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Data Security</h2>
            <p className="text-gray-600 leading-8">
              We use industry-standard security measures to safeguard your
              personal information.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PrivacyPolicy;