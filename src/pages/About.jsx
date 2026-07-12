import React from "react";
import {
  FaBullseye,
  FaLightbulb,
  FaHandshake,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
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
              Empowering Careers with
              <span className="text-orange-500">
                {" "}Industry-Ready Skills
              </span>
            </h2>

            <p className="text-gray-600 mt-6 leading-8 text-lg">
              First Track Skills Academy is the official education and training platform owned and operated by
              <span className="font-semibold text-gray-800">
                {" "}First Track Solution Technologies Pvt. Ltd.
              </span>
               . We are dedicated to bridging the gap between academic learning and industry expectations through practical, career-focused education.
            </p>

            <p className="text-gray-600 mt-4 leading-8 text-lg">
              We provide industry-oriented certification courses, live projects,
              internships, expert mentorship, and placement assistance across multiple
              technology domains, helping students and professionals build the skills
              required for successful careers.
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
                  To empower students and professionals with practical knowledge, technical expertise, and real-world experience through quality training and industry-focused learning.
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
                  Our learning methodology combines expert-led classes, live industry projects, internships, modern tools, and hands-on practice to create job-ready professionals.
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
                    We are committed to providing affordable, flexible, and career-focused education with continuous mentorship, internship opportunities, and dedicated placement support for every learner.
                  </p>

                </div>

              </div>

            </div>

            <button 
              onClick={() => navigate("/courses")}
              className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition">
              Explore Programs
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
                Live
              </h2>

              <p className="text-gray-600 mt-2">
                Project-based Learning
              </p>

            </div>

            {/* Floating Card 2 */}
            <div className="absolute bottom-8 -right-8 bg-orange-500 text-white rounded-3xl shadow-xl px-8 py-6">

              <h2 className="text-4xl font-bold">
                95%
              </h2>

              <p className="mt-2">
                Career-Focused Training
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;