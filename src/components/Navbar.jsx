import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Career", path: "/career" },
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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">

            <img
              src="/images/companylogo.jpg"
              alt="Logo"
              className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover"
            />

            <div
              className={`overflow-hidden transition-all duration-500 ${
                scroll
                  ? "max-w-xs opacity-100 translate-x-0"
                  : "max-w-0 opacity-0 -translate-x-5"
              }`}
            >
              <h2 className="text-2xl font-extrabold whitespace-nowrap text-gray-900">
                First Track <span className="text-orange-500">Skills Academy</span>
              </h2>

              <p className="text-xs text-gray-500">
                Learn • Grow • Succeed
              </p>
            </div>

          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-3 py-2">

            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : scroll
                      ? "text-gray-700 hover:bg-orange-100 hover:text-orange-500"
                      : "text-white hover:bg-white/20"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

          </nav>

          {/* Enroll Button */}
          <NavLink
            to="/contact"
            className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition hover:scale-105"
          >
            Enroll Now
          </NavLink>

          {/* Mobile Icon */}
          <button
            onClick={() => setOpen(true)}
            className={`lg:hidden text-4xl ${
              scroll ? "text-gray-900" : "text-white"
            }`}
          >
            <HiMenuAlt3 />
          </button>

        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 transition ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[250px] bg-white z-50 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >

        <div className="flex justify-between items-center p-6 border-b">

          <div className="flex items-center gap-3">
            <img
              src="/images/companylogo.jpg"
              className="w-12 h-12 rounded-full"
              alt=""
            />

            <div>
              <h2 className="font-bold">First Track</h2>
              <p className="text-orange-500 text-sm">
                Skills Academy
              </p>
            </div>

          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-4xl"
          >
            <HiX />
          </button>

        </div>

        <div className="p-6 flex flex-col gap-3">

          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-5 py-4 rounded-2xl transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "hover:bg-orange-50 text-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

        </div>

        <div className="absolute bottom-8 left-6 right-6">

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl text-center font-semibold"
          >
            Enroll Now
          </NavLink>

        </div>

      </aside>
    </>
  );
};

export default Navbar;