import React from "react";
import {
  FaArrowRight,
  FaLaptopCode,
  FaCertificate,
  FaUserGraduate,
  FaPlay,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="bg-[#FFF8F0] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Badge */}
       

        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto">

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Learn Skills That
            <span className="text-orange-500">
              {" "}Get You Hired
            </span>
          </h1>

          <p className="mt-8 text-gray-600 text-lg leading-8">
            Learn from industry experts through live classes,
            hands-on projects, certifications, internship guidance,
            and complete placement support.
          </p>

          <div className="flex justify-center flex-wrap gap-5 mt-10">

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-semibold transition">
              Start Learning
              <FaArrowRight />
            </button>

            <button className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-orange-500 hover:text-white transition">
              <FaPlay />
              Watch Demo
            </button>

          </div>

        </div>

        {/* Main Cards */}
        <div className="grid lg:grid-cols-2 gap-10 mt-20">

          {/* Left Image */}
          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000"
              alt=""
              className="rounded-3xl w-full h-[500px] object-cover"
            />

            <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl px-6 py-5">

              <h3 className="text-3xl font-bold text-orange-500">
                10K+
              </h3>

              <p className="text-gray-500">
                Students Trained
              </p>

            </div>

          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-center gap-6">

            <div className="bg-white rounded-3xl shadow-lg p-7 flex gap-5">

              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <FaLaptopCode className="text-3xl text-orange-500" />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-gray-900">
                  Live Interactive Classes
                </h3>

                <p className="text-gray-600 mt-2">
                  Learn directly from experienced mentors with
                  live coding sessions.
                </p>

              </div>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-7 flex gap-5">

              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <FaCertificate className="text-3xl text-orange-500" />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-gray-900">
                  Industry Certifications
                </h3>

                <p className="text-gray-600 mt-2">
                  Earn certificates that strengthen your resume
                  and job opportunities.
                </p>

              </div>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-7 flex gap-5">

              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <FaUserGraduate className="text-3xl text-orange-500" />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-gray-900">
                  Placement Assistance
                </h3>

                <p className="text-gray-600 mt-2">
                  Resume preparation, mock interviews, and
                  hiring support from top companies.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">

          <div className="bg-white rounded-2xl p-6 text-center shadow">
            <h2 className="text-4xl font-bold text-orange-500">10K+</h2>
            <p className="text-gray-600 mt-2">Students</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow">
            <h2 className="text-4xl font-bold text-orange-500">120+</h2>
            <p className="text-gray-600 mt-2">Courses</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow">
            <h2 className="text-4xl font-bold text-orange-500">95%</h2>
            <p className="text-gray-600 mt-2">Placement</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow">
            <h2 className="text-4xl font-bold text-orange-500">15+</h2>
            <p className="text-gray-600 mt-2">Years Experience</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;