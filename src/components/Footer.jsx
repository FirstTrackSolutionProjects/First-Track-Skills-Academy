import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <footer className="bg-[#1F2937] text-white">

      {/* Top Footer */}

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">

          {/* Company */}

          <div>

            <div className="flex items-center gap-3 mb-5">

              <img
                src="/images/companylogo.jpg"
                alt="logo"
                className="w-14 h-14 rounded-full object-cover"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  First Track
                </h2>

                <p className="text-orange-400 font-medium">
                  Skills Academy
                </p>

              </div>

            </div>

            <p className="text-gray-300 leading-7">
              We help students become industry-ready through practical
              learning, live projects, internships, certifications,
              and placement assistance.
            </p>

            <div className="flex gap-3 mt-6">

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-700 hover:bg-orange-500 flex items-center justify-center transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-700 hover:bg-orange-500 flex items-center justify-center transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-700 hover:bg-orange-500 flex items-center justify-center transition"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-700 hover:bg-orange-500 flex items-center justify-center transition"
              >
                <FaYoutube />
              </a>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-6 border-l-4 border-orange-500 pl-3">
              Quick Links
            </h3>

            <ul className="space-y-4 text-gray-300">

              <li>
                <Link to="/" className="hover:text-orange-400">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/courses" className="hover:text-orange-400">
                  Courses
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-orange-400">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/placements" className="hover:text-orange-400">
                  Placements
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-orange-400">
                  Contact
                </Link>
              </li>

            </ul>

          </div>

          {/* Courses */}

          <div>

            <h3 className="text-xl font-semibold mb-6 border-l-4 border-orange-500 pl-3">
              Popular Courses
            </h3>

            <ul className="space-y-4 text-gray-300">

              <li>
                <Link
                  to="/courses/frontend"
                  className="hover:text-orange-400"
                >
                  Frontend Development
                </Link>
              </li>

              <li>
                <Link
                  to="/courses/backend"
                  className="hover:text-orange-400"
                >
                  Backend Development
                </Link>
              </li>

              <li>
                <Link
                  to="/courses/fullstack"
                  className="hover:text-orange-400"
                >
                  Full Stack Development
                </Link>
              </li>

              <li>
                <Link
                  to="/courses/marketing"
                  className="hover:text-orange-400"
                >
                  Digital Marketing
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold mb-6 border-l-4 border-orange-500 pl-3">
              Contact Us
            </h3>

            <div className="space-y-5 text-gray-300">

              <div className="flex gap-4">

                <FaMapMarkerAlt className="text-orange-500 mt-1 text-lg" />

                <p>
                  First Track Skills Academy
                  <br />
                  Bhubaneswar, Odisha
                </p>

              </div>

              <div className="flex gap-4">

                <FaPhoneAlt className="text-orange-500 mt-1" />

                <p>+91 9876543210</p>

              </div>

              <div className="flex gap-4">

                <FaEnvelope className="text-orange-500 mt-1" />

                <p>info@firsttrackskills.com</p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}

      <div className="border-t border-gray-700">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

            <p className="text-gray-400 text-center">
              © {new Date().getFullYear()} First Track Skills Academy.
              All Rights Reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">

              <Link
                to="/privacy-policy"
                className="hover:text-orange-400 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-of-use"
                className="hover:text-orange-400 transition"
              >
                Terms of Use
              </Link>

              <Link
                to="/refund-cancel"
                className="hover:text-orange-400 transition"
              >
                Refund & Cancellation
              </Link>

              <Link
                to="/faq"
                className="hover:text-orange-400 transition"
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