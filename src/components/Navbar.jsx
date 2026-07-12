import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 40);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Career", path: "/career" },
    { name: "Program Details", path: "/program-details" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scroll
            ? "bg-white/95 backdrop-blur-xl shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-3 flex-shrink-0"
          >
            <img
              src="/images/companylogo.jpg"
              alt="First Track"
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-orange-500 object-cover shadow-md"
            />

            {/* Desktop */}
            <div className="hidden md:block">
              <h2
                className={`font-extrabold leading-tight transition ${
                  scroll ? "text-gray-900" : "text-black"
                }`}
              >
                First Track
                <span className="text-orange-500"> Skills Academy</span>
              </h2>

              <p
                className={`text-xs ${
                  scroll ? "text-gray-700" : "text-gray-800"
                }`}
              >
                Learn • Grow • Succeed
              </p>
            </div>

            {/* Mobile */}
            <div className="md:hidden leading-tight">
              <h2
                className={`text-base font-extrabold ${
                  scroll ? "text-gray-900" : "text-black"
                }`}
              >
                First Track
              </h2>

              <p className="text-orange-500 text-xs font-semibold">
                Skills Academy
              </p>
            </div>
          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 px-3 py-2">

            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : scroll
                      ? "text-gray-700 hover:text-orange-500 hover:bg-orange-100"
                      : "text-black hover:bg-white/20"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <NavLink
            to="/contact"
            className="hidden lg:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition hover:scale-105"
          >
            Enroll Now
            <FaArrowRight size={14} />
          </NavLink>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(true)}
            className={`lg:hidden text-4xl ${
              scroll ? "text-gray-900" : "text-black"
            }`}
          >
            <HiMenuAlt3 />
          </button>

        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[90%] max-w-sm bg-white transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Top */}
          <div className="flex justify-between items-center p-6 border-b">

            <div className="flex items-center gap-3">

              <img
                src="/images/companylogo.jpg"
                alt=""
                className="w-14 h-14 rounded-full border border-orange-300"
              />

              <div>
                <h2 className="font-bold text-lg">
                  First Track
                </h2>

                <p className="text-orange-500 text-sm">
                  Skills Academy
                </p>
              </div>

            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-4xl text-gray-700"
            >
              <HiX />
            </button>

          </div>

          {/* Links */}
          <div className="p-6 flex flex-col gap-3">

            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-5 py-4 rounded-2xl font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

          </div>

          {/* Bottom */}
          <div className="absolute bottom-8 left-6 right-6">

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-semibold transition"
            >
              Enroll Now
              <FaArrowRight />
            </NavLink>

          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;