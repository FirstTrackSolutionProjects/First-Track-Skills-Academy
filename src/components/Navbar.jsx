import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaArrowRight, FaGraduationCap, FaSignOutAlt, FaUserCheck } from "react-icons/fa";
import useStore, { storeActions } from "../store/useStore";

const Navbar = () => {
  const { auth } = useStore();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  // Support collapsible burger menu sliding from either right or left
  const [drawerSide, setDrawerSide] = useState("right");
  const role = auth?.user?.role;

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Manage body scroll and Escape key dismissal when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Public & role menu with "Enroll" explicitly unhidden
  const menu = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Enroll", path: "/enroll", isEnroll: true },
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
            ? "bg-white/95 backdrop-blur-xl shadow-md py-2.5 sm:py-3 border-b border-orange-100"
            : "bg-white/90 sm:bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none py-3 sm:py-5 border-b border-orange-100/60 md:border-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo Branding */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group"
            title="First Track Skills Academy"
          >
            <img
              src="/images/companylogo.jpg"
              alt="First Track"
              className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-orange-500 object-cover shadow-md transition group-hover:scale-105"
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
                className={`text-xs font-semibold ${
                  scroll ? "text-gray-600" : "text-gray-700"
                }`}
              >
                Learn • Grow • Succeed
              </p>
            </div>

            {/* Mobile Brand Text */}
            <div className="md:hidden leading-tight">
              <h2
                className={`text-base font-extrabold transition ${
                  scroll ? "text-gray-900" : "text-black"
                }`}
              >
                First Track
              </h2>
              <p className="text-orange-500 text-xs font-bold">
                Skills Academy
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/40 backdrop-blur-xl rounded-full border border-orange-200/60 shadow-sm px-3 py-1.5 no-scrollbar">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm"
                      : item.isEnroll
                      ? "text-orange-600 hover:bg-orange-100/80 font-bold"
                      : scroll
                      ? "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      : "text-gray-800 hover:text-orange-600 hover:bg-white/60"
                  }`
                }
              >
                <span className="flex items-center gap-1.5">
                  {item.name}
                  {item.isEnroll && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  )}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA Area */}
          {auth ? (
            <div className="hidden lg:flex items-center gap-2.5">
              <NavLink
                to="/enroll"
                className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/80 px-4 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
              >
                <FaGraduationCap className="text-orange-500 text-sm" />
                <span>Enroll Course</span>
              </NavLink>
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <span>Dashboard</span>
              </NavLink>
              <button
                onClick={storeActions.clearAuth}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-orange-500/20 transition hover:scale-105"
              >
                <span>Logout</span>
                <FaSignOutAlt size={12} />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2.5">
              <NavLink
                to="/college-onboarding"
                className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-white/90 px-3.5 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 hover:border-orange-300"
              >
                College Account
              </NavLink>
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                Login
              </NavLink>
              {/* Prominent Unhidden Enroll Button */}
              <NavLink
                to="/enroll"
                className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-orange-500/25 transition hover:scale-105"
              >
                <FaGraduationCap className="text-sm" />
                <span>Enroll Now</span>
                <FaArrowRight size={11} />
              </NavLink>
            </div>
          )}

          {/* Mobile Right Controls: Compact Enroll + Collapsible Burger Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Quick Unhidden Mobile Enroll Pill */}
            <NavLink
              to="/enroll"
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:scale-105"
            >
              <FaGraduationCap size={13} />
              <span>Enroll</span>
            </NavLink>

            {/* Collapsible Burger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={open}
              className={`flex items-center justify-center h-10 w-10 rounded-xl border transition-all duration-200 shadow-sm ${
                open
                  ? "bg-orange-500 text-white border-orange-500"
                  : scroll
                  ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                  : "bg-white text-gray-800 border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {open ? <HiX className="text-2xl transition-transform rotate-90" /> : <HiMenuAlt3 className="text-2xl" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Collapsible Burger Drawer Menu (Accessible from Right or Left) */}
      <div
        className={`fixed inset-0 z-[998] transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Backdrop Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />

        {/* Collapsible Drawer Panel */}
        <div
          className={`fixed top-0 bottom-0 z-[999] flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            drawerSide === "left"
              ? `left-0 ${open ? "translate-x-0" : "-translate-x-full"}`
              : `right-0 ${open ? "translate-x-0" : "translate-x-full"}`
          }`}
        >
          {/* Drawer Top Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-orange-100 p-4 sm:p-5 bg-orange-50/40">
            <div className="flex items-center gap-3">
              <img
                src="/images/companylogo.jpg"
                alt="First Track Logo"
                className="w-11 h-11 rounded-full border-2 border-orange-500 object-cover shadow-sm"
              />
              <div>
                <h2 className="font-extrabold text-base text-gray-900 leading-tight">
                  First Track <span className="text-orange-500">Skills</span>
                </h2>
                <p className="text-[11px] font-semibold text-gray-500">
                  Skills Academy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Optional Right/Left Dock Toggle */}
              <button
                type="button"
                onClick={() => setDrawerSide((prev) => (prev === "right" ? "left" : "right"))}
                title={`Dock menu to ${drawerSide === "right" ? "Left" : "Right"}`}
                className="hidden xs:flex items-center justify-center rounded-lg border border-orange-200 bg-white px-2 py-1 text-[10px] font-bold text-orange-600 hover:bg-orange-50 shadow-2xs"
              >
                {drawerSide === "right" ? "⇄ Dock Left" : "⇄ Dock Right"}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition"
                aria-label="Close menu"
              >
                <HiX className="text-xl" />
              </button>
            </div>
          </div>

          {/* Featured Unhidden Enroll Banner */}
          <div className="shrink-0 p-4 border-b border-orange-100/60 bg-gradient-to-br from-orange-50 to-amber-50/50">
            <NavLink
              to="/enroll"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-3.5 text-white font-bold shadow-md shadow-orange-500/20 transition hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
                  <FaGraduationCap size={16} />
                </div>
                <div>
                  <p className="text-sm font-extrabold leading-tight">Enroll in a Course</p>
                  <p className="text-[11px] text-orange-100 font-medium">New Batches Now Open</p>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-white text-orange-600 px-2.5 py-1 text-xs font-extrabold shadow-sm">
                Apply <FaArrowRight size={10} />
              </span>
            </NavLink>
          </div>

          {/* Scrollable Navigation Links */}
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-4 sm:p-5">
            <p className="text-[11px] font-bold tracking-wider uppercase text-gray-400 px-3 mb-1">
              Menu Navigation
            </p>

            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm font-bold"
                      : item.isEnroll
                      ? "bg-orange-50 text-orange-700 font-bold border border-orange-200 hover:bg-orange-100"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
              >
                <span>{item.name}</span>
                {item.isEnroll && (
                  <span className="rounded-full bg-orange-200/80 text-orange-800 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                    Live
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Bottom Authentication & Portal Actions */}
          <div className="shrink-0 border-t border-orange-100 bg-gray-50/80 p-4 sm:p-5">
            {auth ? (
              <div className="grid gap-2.5">
                <NavLink
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-700 py-3 rounded-xl text-sm font-bold shadow-sm transition hover:bg-orange-50"
                >
                  <FaUserCheck />
                  <span>Go to Dashboard</span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    storeActions.clearAuth();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition shadow-md shadow-orange-500/20"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-2.5">
                <NavLink
                  to="/enroll"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl text-sm font-extrabold shadow-md shadow-orange-500/20 transition"
                >
                  <FaGraduationCap size={15} />
                  <span>Enroll Now</span>
                  <FaArrowRight size={11} />
                </NavLink>
                <div className="grid grid-cols-2 gap-2">
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                    to="/college-onboarding"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-white py-2.5 text-xs font-bold text-orange-600 shadow-sm transition hover:bg-orange-50"
                  >
                    <span>College Join</span>
                  </NavLink>
                </div>
              </div>
            )}

            <p className="mt-3 text-center text-[11px] font-semibold text-gray-500">
              First Track Skills Academy • Learn • Grow • Succeed
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
