import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white mt-20">

      {/* Top Orange Border */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company */}
          <div>

            <div className="flex items-center gap-4 mb-6">

              <img
                src="/images/companylogo.jpg"
                alt="logo"
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  First Track
                </h2>

                <p className="text-orange-400 font-semibold">
                  Skills Academy
                </p>

              </div>

            </div>

            <p className="text-gray-300 leading-7 text-sm">
              Empowering students with practical skills, internships,
              industry certifications and placement support to build
              successful careers.
            </p>

            <div className="flex gap-4 mt-7">

              {[
                FaFacebookF,
                FaInstagram,
                FaLinkedinIn,
                FaYoutube,
              ].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-orange-500 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                >
                  <Icon />
                </a>
              ))}

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute left-0 -bottom-2 w-12 h-1 bg-orange-500 rounded-full"></span>
            </h3>

            <ul className="space-y-4 mt-8">

              {[
                ["Home", "/"],
                ["Courses", "/courses"],
                ["About Us", "/about"],
                ["Career", "/career"],
                ["Contact", "/contact"],
              ].map(([title, path]) => (

                <li key={title}>

                  <Link
                    to={path}
                    className="group flex items-center gap-3 text-gray-300 hover:text-orange-400 transition"
                  >

                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition" />

                    {title}

                  </Link>

                </li>

              ))}

            </ul>

          </div>

          {/* Courses */}
          <div>

            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Popular Courses
              <span className="absolute left-0 -bottom-2 w-12 h-1 bg-orange-500 rounded-full"></span>
            </h3>

            <ul className="space-y-4 mt-8">

              {[
                "Frontend Development",
                "Backend Development",
                "Full Stack Development",
                "Digital Marketing",
                "HR Management",
              ].map((course) => (

                <li key={course}>

                  <Link
                    to="/courses"
                    className="group flex items-center gap-3 text-gray-300 hover:text-orange-400 transition"
                  >

                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition" />

                    {course}

                  </Link>

                </li>

              ))}

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute left-0 -bottom-2 w-12 h-1 bg-orange-500 rounded-full"></span>
            </h3>

            <div className="space-y-6 mt-8">

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-orange-400" />
                </div>

                <p className="text-gray-300 text-sm leading-6">
                  Saheed Nagar, Bhubaneswar,
                  <br />
                   Odisha, India
                </p>

              </div>

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-orange-400" />
                </div>

                <p className="text-gray-300">
                  +91 9040170727
                </p>

              </div>

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-orange-400" />
                </div>

                <p className="text-gray-300 break-all">
                  contact@firsttrackskillsacademy.in
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Bottom */}

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-5 py-6">

          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">

            {/* Copyright */}

            <p className="text-gray-400 text-sm text-center leading-6">
              © {new Date().getFullYear()} First Track Skills Academy.
              <br className="block md:hidden" />
              All Rights Reserved.
            </p>

            {/* Footer Links */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-sm text-center">

              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-of-use"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                Terms
              </Link>

              <Link
                to="/refund-cancel"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                Refund Policy
              </Link>

              <Link
                to="/faq"
                className="text-gray-400 hover:text-orange-400 transition"
              >
                FAQ
              </Link>

            </div>

          </div>

        </div>
</div>

    </footer>
  );
};

export default Footer;