import React from "react";
import {
  FaBullseye,
  FaLightbulb,
  FaHandshake,
  FaArrowRight,
} from "react-icons/fa";

const About = () => {
  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>

            <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
              About First Track Skills Academy
            </span>

            <h2 className="text-5xl font-bold text-gray-900 mt-6 leading-tight">
              Bridging the
              <span className="text-orange-500">
                {" "}Skills Gap
              </span>
            </h2>

            <p className="text-gray-600 mt-6 leading-8 text-lg">
              As technology continues to transform industries, employers
              are looking for professionals with practical knowledge and
              real-world experience—not just academic qualifications.
            </p>

            <p className="text-gray-600 mt-4 leading-8 text-lg">
              First Track Skills Academy was founded to bridge this gap
              through expert-led training, live projects, and complete
              placement support.
            </p>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-6 mt-10">

              {/* Mission */}
              <div className="bg-white rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl transition">

                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
                  <FaBullseye className="text-orange-500 text-2xl" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Our Mission
                </h3>

                <p className="text-gray-600 mt-3 leading-7">
                  Deliver high-quality practical training guided by
                  experienced industry professionals.
                </p>

              </div>

              {/* Approach */}
              <div className="bg-white rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl transition">

                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
                  <FaLightbulb className="text-orange-500 text-2xl" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Our Approach
                </h3>

                <p className="text-gray-600 mt-3 leading-7">
                  Learn through live projects, real tools, and current
                  industry practices.
                </p>

              </div>

            </div>

            {/* Commitment */}
            <div className="bg-white rounded-3xl shadow-md p-6 mt-6 hover:-translate-y-2 hover:shadow-xl transition">

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FaHandshake className="text-orange-500 text-2xl" />
                </div>

                <div>

                  <h3 className="text-xl font-bold text-gray-900">
                    Our Commitment
                  </h3>

                  <p className="text-gray-600 mt-3 leading-7">
                    Affordable, flexible, and career-focused learning
                    designed for students across India with internship
                    and placement assistance.
                  </p>

                </div>

              </div>

            </div>

            <button className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition">
              Learn More
              <FaArrowRight />
            </button>

          </div>

          {/* Right Image */}
          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000"
              alt="Students Learning"
              className="rounded-[35px] shadow-2xl object-cover w-full h-[650px]"
            />

            {/* Floating Card 1 */}
            <div className="absolute top-8 -left-8 bg-white rounded-3xl shadow-xl px-8 py-6">

              <h2 className="text-4xl font-bold text-orange-500">
                10K+
              </h2>

              <p className="text-gray-600 mt-2">
                Students Trained
              </p>

            </div>

            {/* Floating Card 2 */}
            <div className="absolute bottom-8 -right-8 bg-orange-500 text-white rounded-3xl shadow-xl px-8 py-6">

              <h2 className="text-4xl font-bold">
                95%
              </h2>

              <p className="mt-2">
                Placement Support
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;