import React from "react";

const TermsOfUse = () => {
  return (
    <section className="bg-white py-24">

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-bold mb-8">
          Terms of Use
        </h1>

        <p className="text-gray-600 leading-8 mb-10">
          By accessing First Track Skills Academy, you agree to comply
          with these Terms of Use.
        </p>

        <div className="space-y-8">

          <div>
            <h2 className="text-2xl font-bold mb-3">
              Student Responsibilities
            </h2>

            <ul className="list-disc ml-6 text-gray-600 space-y-2">
              <li>Attend classes regularly.</li>
              <li>Respect trainers and fellow students.</li>
              <li>Do not share paid course materials.</li>
              <li>Use the platform responsibly.</li>
            </ul>
          </div>

          <div>

            <h2 className="text-2xl font-bold mb-3">
              Intellectual Property
            </h2>

            <p className="text-gray-600 leading-8">
              All videos, notes, assignments and course materials belong
              to First Track Skills Academy.
            </p>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-3">
              Termination
            </h2>

            <p className="text-gray-600 leading-8">
              Violation of academy policies may result in suspension or
              termination of access.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default TermsOfUse;