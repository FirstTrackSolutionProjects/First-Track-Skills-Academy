import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import useStore, { storeActions } from "../store/useStore";

const Navbar = () => {
  const { auth } = useStore();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const role = auth?.user?.role;

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Public menu with Enroll normally included
  const menu = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Enroll", path: "/enroll" },
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
            : "bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none py-4 md:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">

          {/* Left: Burger Button on mobile & Logo Branding */}
          <div className="flex items-center gap-3">
            {/* Mobile Collapsible Burger Button (on the left) */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={open}
              className={`lg:hidden flex items-center justify-center p-1.5 rounded-xl text-3xl transition ${
                scroll ? "text-gray-900" : "text-black"
              }`}
            >
              {open ? <HiX /> : <HiMenuAlt3 />}
            </button>

            {/* Logo Branding */}
            <NavLink
              to="/"
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <img
                src="/images/companylogo.jpg"
                alt="First Track"
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-orange-500 object-cover shadow-md transition group-hover:scale-105"
              />

              {/* Desktop Brand Text */}
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

              {/* Mobile Brand Text */}
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
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex max-w-[820px] items-center gap-1 overflow-x-auto bg-white/10 backdrop-blur-xl rounded-full border border-white/20 px-3 py-2 no-scrollbar">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap px-4 py-2 rounded-full font-medium transition ${
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
          {auth ? (
            <div className="hidden lg:flex items-center gap-3">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Dashboard
              </NavLink>
              <button
                onClick={storeActions.clearAuth}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition hover:scale-105"
              >
                Logout
                <FaArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5">
              <NavLink
                to="/student-onboarding"
                className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs xl:text-sm font-bold text-orange-700 transition hover:bg-orange-100 hover:text-orange-800 whitespace-nowrap shadow-xs"
              >
                Register as Student
              </NavLink>
              <NavLink
                to="/college-onboarding"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 whitespace-nowrap shadow-xs"
              >
                College Account
              </NavLink>
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs xl:text-sm font-semibold rounded-full transition hover:scale-105 whitespace-nowrap shadow-sm"
              >
                Login
                <FaArrowRight size={12} />
              </NavLink>
            </div>
          )}

          {/* Mobile Right CTA button */}
          <div className="lg:hidden flex items-center gap-2">
            {auth ? (
              <NavLink
                to="/dashboard"
                className="rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition"
              >
                Dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/student-onboarding"
                className="rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition"
              >
                Register
              </NavLink>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Collapsible Burger Menu Drawer (from the LEFT) */}
      <div
        className={`fixed inset-0 z-[999] transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Collapsible Panel on the LEFT */}
        <div
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Top Header */}
          <div className="flex shrink-0 justify-between items-center p-6 border-b">
            <div className="flex items-center gap-3">
              <img
                src="/images/companylogo.jpg"
                alt="First Track"
                className="w-12 h-12 rounded-full border border-orange-300 object-cover"
              />
              <div>
                <h2 className="font-bold text-lg leading-tight">First Track</h2>
                <p className="text-orange-500 text-sm font-semibold">Skills Academy</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-3xl text-gray-700 hover:text-orange-600 transition"
              aria-label="Close menu"
            >
              <HiX />
            </button>
          </div>

          {/* Links */}
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-6">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-5 py-3.5 rounded-2xl font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white font-bold"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="shrink-0 border-t border-orange-100 bg-white p-6">
            {auth ? (
              <div className="grid gap-3">
                <NavLink
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-orange-50 border border-orange-300 text-orange-600 py-3.5 rounded-2xl font-bold transition hover:bg-orange-100"
                >
                  Go to Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    storeActions.clearAuth();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-semibold transition"
                >
                  Logout
                  <FaArrowRight />
                </button>
              </div>
            ) : (
              <div className="grid gap-2.5">
                <NavLink
                  to="/student-onboarding"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl text-base font-bold shadow-md shadow-orange-200 transition hover:scale-105"
                >
                  Register as Student
                  <FaArrowRight />
                </NavLink>
                <div className="grid grid-cols-2 gap-2">
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-2xl border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                    to="/college-onboarding"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-2xl border border-orange-200 bg-white py-2.5 text-xs font-bold text-orange-600 shadow-sm transition hover:bg-orange-50"
                  >
                    <span>College Account</span>
                  </NavLink>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
