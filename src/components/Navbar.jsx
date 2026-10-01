import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  FaArrowRight,
  FaHome,
  FaBookOpen,
  FaGraduationCap,
  FaInfoCircle,
  FaBriefcase,
  FaFileAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaUserGraduate,
  FaBuilding,
  FaSignInAlt,
  FaChartBar,
} from "react-icons/fa";
import useStore, { storeActions } from "../store/useStore";

const Navbar = () => {
  const { auth } = useStore();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  const role = auth?.user?.role;
  const dashboardPath =
    role === "SUPERADMIN" || role === "ADMIN"
      ? "/admin-dashboard"
      : role === "COLLEGE"
      ? "/college-dashboard"
      : "/dashboard";

  // Track window scroll
  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when drawer is open & handle Escape key
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

  // Automatically close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation Items
  const menu = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Courses", path: "/courses", icon: <FaBookOpen /> },
    { name: "Enroll", path: "/enroll", icon: <FaGraduationCap /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "Career", path: "/career", icon: <FaBriefcase /> },
    { name: "Program Details", path: "/program-details", icon: <FaFileAlt /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scroll
            ? "bg-white/95 backdrop-blur-xl shadow-md py-2.5 sm:py-3 border-b border-orange-100/80"
            : "bg-white/90 lg:bg-white/80 backdrop-blur-md py-3 sm:py-4 border-b border-orange-100/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* ========================================================= */}
          {/* Brand Logo & Name (Always on the Left)                   */}
          {/* ========================================================= */}
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <img
              src="/images/companylogo.jpg"
              alt="First Track"
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-full border-2 border-orange-500 object-cover shadow-sm transition group-hover:scale-105 shrink-0"
            />

            <div className="leading-tight">
              <div className="text-sm sm:text-base lg:text-lg font-black text-gray-900 tracking-tight flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                <span className="leading-none sm:leading-tight">First Track</span>
                <span className="text-orange-500 text-xs sm:text-base lg:text-lg font-extrabold leading-none sm:leading-tight">
                  Skills Academy
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-500 hidden md:block mt-0.5">
                Learn • Grow • Succeed
              </p>
            </div>
          </NavLink>

          {/* ========================================================= */}
          {/* Desktop Navigation Links (Visible on lg: 1024px and up)   */}
          {/* ========================================================= */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-white/70 backdrop-blur-xl rounded-full border border-orange-100/80 px-2.5 xl:px-3 py-1.5 shadow-2xs">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-xs"
                      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* ========================================================= */}
          {/* Desktop Right CTAs (Visible on lg: 1024px and up)         */}
          {/* ========================================================= */}
          {auth ? (
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              <NavLink
                to={dashboardPath}
                className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs xl:text-sm font-bold text-orange-600 transition hover:bg-orange-50 whitespace-nowrap shadow-xs"
              >
                <FaChartBar className="text-xs" />
                <span>Dashboard</span>
              </NavLink>
              <button
                onClick={storeActions.clearAuth}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 xl:px-5 py-2 rounded-full text-xs xl:text-sm font-bold transition hover:scale-102 whitespace-nowrap shadow-xs"
              >
                <span>Logout</span>
                <FaArrowRight size={11} />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <NavLink
                to="/student-onboarding"
                className="hidden xl:inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white px-3.5 py-2 text-xs xl:text-sm font-semibold text-orange-600 transition hover:bg-orange-50 whitespace-nowrap shadow-2xs"
              >
                Student
              </NavLink>
              <NavLink
                to="/college-onboarding"
                className="hidden 2xl:inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white px-3.5 py-2 text-xs xl:text-sm font-semibold text-orange-600 transition hover:bg-orange-50 whitespace-nowrap shadow-2xs"
              >
                College
              </NavLink>
              <NavLink
                to="/enroll"
                className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 text-xs xl:text-sm font-bold text-orange-700 transition whitespace-nowrap shadow-2xs"
              >
                Enroll
              </NavLink>
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 xl:px-5 py-2 font-bold text-xs xl:text-sm rounded-full transition hover:scale-102 whitespace-nowrap shadow-sm"
              >
                <span>Login</span>
                <FaArrowRight size={11} />
              </NavLink>
            </div>
          )}

          {/* ========================================================= */}
          {/* Mobile & Tablet Header Right Actions (< 1024px)           */}
          {/* ========================================================= */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-2.5 shrink-0">
            {auth ? (
              <NavLink
                to={dashboardPath}
                className="inline-flex items-center gap-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 text-xs font-bold shadow-xs transition whitespace-nowrap"
              >
                <FaChartBar className="text-[10px]" />
                <span>Dashboard</span>
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/student-onboarding"
                  className="hidden sm:inline-flex items-center rounded-full border border-orange-200 bg-white hover:bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 shadow-2xs transition whitespace-nowrap"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="inline-flex items-center gap-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-3.5 py-1.5 text-xs font-bold shadow-xs transition whitespace-nowrap"
                >
                  <FaSignInAlt className="text-[10px]" />
                  <span>Login</span>
                </NavLink>
              </>
            )}

            {/* Hamburger Toggle Button (Cleanly Positioned on the Right) */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={open}
              className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-orange-200 bg-orange-50/80 text-orange-700 hover:bg-orange-100 hover:text-orange-800 transition shadow-2xs text-xl sm:text-2xl shrink-0"
            >
              {open ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* Mobile & Tablet Slide-Over Navigation Drawer (from Right) */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-[999] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        />

        {/* Drawer Content Panel (Right-Aligned) */}
        <div
          className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Top Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-orange-100 px-5 py-4 bg-orange-50/40">
            <div className="flex items-center gap-3">
              <img
                src="/images/companylogo.jpg"
                alt="First Track"
                className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
              />
              <div className="leading-tight">
                <h2 className="font-extrabold text-slate-900 text-sm">First Track</h2>
                <p className="text-orange-500 text-xs font-bold">Skills Academy</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-300 transition text-xl shadow-2xs"
              aria-label="Close navigation menu"
            >
              <HiX />
            </button>
          </div>

          {/* Drawer Links List */}
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4 sm:p-5">
            <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </p>
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
              >
                <span className="text-base shrink-0 opacity-80">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Drawer Bottom Actions */}
          <div className="shrink-0 border-t border-orange-100 bg-slate-50/70 p-4 sm:p-5 space-y-3">
            {auth ? (
              <div className="space-y-2.5">
                <NavLink
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-3 text-sm font-bold shadow-sm transition"
                >
                  <FaChartBar />
                  <span>Go to Dashboard</span>
                </NavLink>

                <button
                  onClick={() => {
                    storeActions.clearAuth();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 py-2.5 text-xs font-bold transition shadow-2xs"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <NavLink
                  to="/student-onboarding"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-3 text-sm font-bold shadow-md shadow-orange-100 transition"
                >
                  <FaUserGraduate />
                  <span>Register as Student</span>
                  <FaArrowRight size={11} />
                </NavLink>

                <div className="grid grid-cols-2 gap-2">
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <FaSignInAlt className="text-[11px]" />
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                    to="/college-onboarding"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-white py-2.5 text-xs font-bold text-orange-600 shadow-2xs transition hover:bg-orange-50"
                  >
                    <FaBuilding className="text-[11px]" />
                    <span>College</span>
                  </NavLink>
                </div>
              </div>
            )}

            <div className="pt-2 text-center text-[11px] font-medium text-slate-400">
              First Track Skills Academy • 2026
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
