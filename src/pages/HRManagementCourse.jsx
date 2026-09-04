import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaHandshake,
  FaBriefcase,
  FaCertificate,
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaBalanceScale,
  FaProjectDiagram,
} from "react-icons/fa";

const HRManagementCourse = () => {
  const navigate = useNavigate();

  const skills = [
    {
      icon: <FaUserTie />,
      title: "Talent Acquisition",
      color: "text-blue-600",
      desc: "Job posting, sourcing, ATS screening & end-to-end recruitment",
    },
    {
      icon: <FaClipboardList />,
      title: "Payroll & Taxation",
      color: "text-emerald-600",
      desc: "Salary structuring, PF, ESI, TDS, PT & statutory computations",
    },
    {
      icon: <FaChartLine />,
      title: "HR Analytics",
      color: "text-purple-600",
      desc: "Attrition metrics, workforce planning & data-driven HR reports",
    },
    {
      icon: <FaBalanceScale />,
      title: "Labor Laws & POSH",
      color: "text-amber-600",
      desc: "Industrial relations, compliance, contracts & POSH regulations",
    },
    {
      icon: <FaHandshake />,
      title: "Employee Relations",
      color: "text-orange-500",
      desc: "Conflict resolution, retention strategies & corporate culture",
    },
    {
      icon: <FaBriefcase />,
      title: "Performance Mgmt",
      color: "text-red-500",
      desc: "Appraisals, KPI & OKR frameworks, and promotion policies",
    },
    {
      icon: <FaUsers />,
      title: "HRMS Software",
      color: "text-cyan-600",
      desc: "Hands-on experience with modern cloud HR and payroll platforms",
    },
    {
      icon: <FaCertificate />,
      title: "Onboarding & Exit",
      color: "text-indigo-600",
      desc: "Joining documentation, induction programs & full & final settlements",
    },
  ];

  const highlights = [
    "Comprehensive HR Generalist + Specialist Training",
    "Real-world Payroll Processing & Tax Deductions",
    "Live Talent Sourcing on LinkedIn & Job Portals",
    "Statutory Compliance (PF, ESIC, Gratuity, Bonus)",
    "POSH Policy Drafting & Case Studies",
    "HRMS Tools & Advanced Excel for HR",
    "Mock HR Interviews & Executive Resume Building",
    "100% Placement Support with Top Recruiters",
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
            PROGRAM 05
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 sm:mt-5 text-gray-900">
            HR Management
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-4 sm:mt-6 leading-relaxed sm:leading-8">
            Launch a rewarding career in Human Resource Leadership. Master recruitment,
            statutory compliances, payroll automation, HR analytics, and talent operations
            with practical industry projects.
          </p>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={() => navigate("/enroll?course=" + encodeURIComponent("HR Management"))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition hover:scale-105 shadow-lg shadow-orange-500/30 text-base cursor-pointer"
            >
              Enroll Now
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000"
              alt="HR Management"
              className="rounded-[24px] sm:rounded-[35px] shadow-2xl w-full object-cover h-[280px] sm:h-[380px] lg:h-[450px]"
            />

            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-white rounded-2xl shadow-xl px-4 py-2.5 sm:px-6 sm:py-4">
              <h3 className="text-xl sm:text-3xl font-bold text-orange-500">
                45 Days
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Job-Ready Program
              </p>
            </div>

            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-orange-500 text-white rounded-2xl px-4 py-2.5 sm:px-6 sm:py-4 shadow-xl">
              <h3 className="text-xl sm:text-3xl font-bold">
                100%
              </h3>
              <p className="text-xs sm:text-sm">Placement Support</p>
            </div>
          </div>

          {/* Right Skills Grid */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center lg:text-left">
              Key HR Domains You'll Master
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {skills.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-3.5 sm:p-5 shadow hover:-translate-y-1 hover:shadow-xl transition"
                >
                  <div className={`text-2xl sm:text-3xl ${item.color} mb-2 sm:mb-3`}>
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed hidden sm:block">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 mt-12 sm:mt-20">
          {/* Program Highlights */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
              Program Highlights
            </h3>

            <div className="space-y-4 sm:space-y-5">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4">
                  <FaCheckCircle className="text-orange-500 flex-shrink-0 text-base sm:text-lg" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Details Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                Course Details
              </h3>

              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base">
                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Duration</span>
                  <strong>45 Days</strong>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Mode</span>
                  <strong>Online Live Classes</strong>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Projects</span>
                  <strong>4 Live HR Projects</strong>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Certificate</span>
                  <strong>Included</strong>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Internship</span>
                  <strong>Available</strong>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Placement</span>
                  <strong>100% Assistance</strong>
                </div>

                <div className="flex justify-between text-2xl sm:text-3xl font-bold mt-6 sm:mt-8">
                  <span>Fees</span>
                  <span>₹12,750</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/enroll?course=" + encodeURIComponent("HR Management"))}
              className="mt-8 sm:mt-10 w-full bg-white text-orange-600 py-3.5 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition shadow-lg text-base sm:text-lg cursor-pointer"
            >
              Enroll Now
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Extra Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow p-5 sm:p-8 text-center hover:-translate-y-1 transition">
            <FaUsers className="text-3xl sm:text-5xl text-orange-500 mx-auto mb-3 sm:mb-4" />
            <h4 className="font-bold text-sm sm:text-lg text-gray-900">Talent Sourcing</h4>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow p-5 sm:p-8 text-center hover:-translate-y-1 transition">
            <FaClipboardList className="text-3xl sm:text-5xl text-orange-500 mx-auto mb-3 sm:mb-4" />
            <h4 className="font-bold text-sm sm:text-lg text-gray-900">Payroll &amp; Labour Laws</h4>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow p-5 sm:p-8 text-center hover:-translate-y-1 transition">
            <FaCertificate className="text-3xl sm:text-5xl text-orange-500 mx-auto mb-3 sm:mb-4" />
            <h4 className="font-bold text-sm sm:text-lg text-gray-900">Certification</h4>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow p-5 sm:p-8 text-center hover:-translate-y-1 transition">
            <FaBriefcase className="text-3xl sm:text-5xl text-orange-500 mx-auto mb-3 sm:mb-4" />
            <h4 className="font-bold text-sm sm:text-lg text-gray-900">Placement Support</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HRManagementCourse;
