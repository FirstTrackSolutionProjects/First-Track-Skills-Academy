import React from "react";
import {
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ContactCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Image */}

        <div className="relative order-2 lg:order-1">

          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200"
            alt="Career Guidance"
            className="w-full h-[300px] md:h-[500px] object-cover rounded-3xl shadow-xl"
          />

          {/* Floating Badge */}

          <div className="absolute bottom-5 left-5 bg-white rounded-2xl shadow-lg px-5 py-4">

            <h3 className="text-2xl font-bold text-orange-500">
              10K+
            </h3>

            <p className="text-gray-500 text-sm">
              Students Guided
            </p>

          </div>

        </div>

        {/* Content */}

        <div className="order-1 lg:order-2">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            CONTACT US
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-6 leading-tight">
            Let's Build
            <span className="text-orange-500">
              {" "}Your Career Together
            </span>
          </h2>

          <p className="mt-6 text-gray-600 leading-8">
            Join First Track Skills Academy and gain practical skills through
            live classes, real-world projects, expert mentorship, internships
            and placement support.
          </p>

          {/* Contact Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">

            <div className="bg-[#FFF8F0] rounded-2xl p-5 hover:shadow-lg transition duration-300">

              <FaWhatsapp className="text-3xl text-green-500 mb-4" />

              <h4 className="font-bold text-lg">
                WhatsApp
              </h4>

              <p className="text-gray-600 mt-2">
                +91 9040170727
              </p>

            </div>

            <div className="bg-[#FFF8F0] rounded-2xl p-5 hover:shadow-lg transition duration-300">

              <FaEnvelope className="text-3xl text-orange-500 mb-4" />

              <h4 className="font-bold text-lg">
                Email
              </h4>

              <p className="text-gray-600 mt-2 break-all">
                info@firsttrackskills.com
              </p>

            </div>

            <div className="sm:col-span-2 bg-[#FFF8F0] rounded-2xl p-5 hover:shadow-lg transition duration-300">

              <FaGlobe className="text-3xl text-blue-500 mb-4" />

              <h4 className="font-bold text-lg">
                Website
              </h4>

              <p className="text-gray-600 mt-2">
                www.firsttrackskills.com
              </p>

            </div>

          </div>

          {/* Quote */}

          <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 rounded-r-2xl px-5 py-5">

            <p className="italic text-gray-600 leading-8">
              "Empowering students with practical skills, industry exposure and
              career opportunities to build a successful future."
            </p>

          </div>

          {/* Button */}

          <button
            onClick={() => navigate("/contact")}
            className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Contact Now
            <FaArrowRight />
          </button>

        </div>

      </div>

    </div>
  </section>
  );
};

export default ContactCTA;

