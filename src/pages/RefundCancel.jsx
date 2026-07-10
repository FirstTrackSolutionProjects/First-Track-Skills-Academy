import React from "react";

const RefundCancel = () => {
  return (
    <section className="bg-[#FFF8F0] py-24">

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-bold mb-8">
          Refund & Cancellation Policy
        </h1>

        <p className="text-gray-600 leading-8 mb-10">
          We strive to provide the best learning experience. Please read
          our refund and cancellation policy carefully.
        </p>

        <div className="space-y-8">

          <div>

            <h2 className="text-2xl font-bold mb-3">
              Cancellation
            </h2>

            <p className="text-gray-600 leading-8">
              Students can request cancellation before the course begins
              by contacting our support team.
            </p>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-3">
              Refund Policy
            </h2>

            <ul className="list-disc ml-6 text-gray-600 space-y-2">
              <li>Refund requests are reviewed individually.</li>
              <li>Refunds may take 7–10 working days.</li>
              <li>No refund after extensive course access.</li>
            </ul>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-3">
              Contact
            </h2>

            <p className="text-gray-600">
              Email: info@firsttrackskills.com
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default RefundCancel;