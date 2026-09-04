import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaChartLine,
  FaInstagram,
  FaBullhorn,
  FaBullseye,
  FaChartBar,
  FaEnvelope,
  FaRocket,
  FaProjectDiagram,
  FaCertificate,
  FaBriefcase,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const MarketingCourse = () => {
  const navigate = useNavigate();

  const technologies = [
    {
      icon: <FaSearch />,
      title: "SEO & SEM",
      color: "text-blue-600",
    },
    {
      icon: <FaChartLine />,
      title: "Google Ads",
      color: "text-red-500",
    },
    {
      icon: <FaInstagram />,
      title: "Social Media",
      color: "text-pink-600",
    },
    {
      icon: <FaBullhorn />,
      title: "Content Marketing",
      color: "text-orange-500",
    },
    {
      icon: <FaBullseye />,
      title: "Meta Ads Manager",
      color: "text-indigo-600",
    },
    {
      icon: <FaChartBar />,
      title: "Web Analytics (GA4)",
      color: "text-amber-500",
    },
    {
      icon: <FaEnvelope />,
      title: "Email Marketing",
      color: "text-cyan-600",
    },
    {
      icon: <FaRocket />,
      title: "Growth & CRO",
      color: "text-purple-600",
    },
  ];

  const highlights = [
    "End-to-End On-Page, Off-Page & Technical SEO",
    "Google Search, Display & Video Ad Campaigns",
    "Meta Ads (Facebook & Instagram Ad Management)",
    "Lead Generation & Conversion Funnel Strategy",
    "Google Analytics 4 (GA4) & Tag Manager",
    "Social Media Growth Strategies & Copywriting",
    "5+ Real-World Budget Ad Campaigns",
    "100% Placement Support & Agency Interview Prep",
  ];

  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            PROGRAM 04
          </span>

          <h2 className="text-5xl font-bold mt-5 text-gray-900">
            Digital Marketing
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-8">
            Launch a high-impact career in Digital Marketing. Master Search Engine
            Optimization (SEO), Google Ads, Social Media Marketing, Performance
            Marketing, and Web Analytics with live campaign execution.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/enroll?course=" + encodeURIComponent("Digital Marketing"))}
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition hover:scale-105 shadow-lg shadow-orange-500/30 text-base cursor-pointer"
            >
              Enroll Now
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000"
              alt="Digital Marketing"
              className="rounded-[35px] shadow-2xl w-full object-cover h-[450px]"
            />

            <div className="absolute top-6 left-6 bg-white rounded-2xl shadow-xl px-6 py-4">
              <h3 className="text-3xl font-bold text-orange-500">
                45 Days
              </h3>
              <p className="text-gray-500">
                Job-Ready Program
              </p>
            </div>

            <div className="absolute bottom-6 right-6 bg-orange-500 text-white rounded-2xl px-6 py-4 shadow-xl">
              <h3 className="text-3xl font-bold">
                100%
              </h3>
              <p>Placement Support</p>
            </div>
          </div>

          {/* Right Skills Grid */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Skills &amp; Tools You'll Master
            </h3>

            <div className="grid grid-cols-2 gap-5">
              {technologies.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow hover:-translate-y-2 hover:shadow-xl transition"
                >
                  <div className={`text-3xl ${item.color} mb-4`}>
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-lg">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-10 mt-20">
          {/* Program Highlights */}
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <h3 className="text-2xl font-bold mb-8">
              Program Highlights
            </h3>

            <div className="space-y-5">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Details Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-8">
                Course Details
              </h3>

              <div className="space-y-6">
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
                  <strong>5+ Live Campaigns</strong>
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

                <div className="flex justify-between text-3xl font-bold mt-8">
                  <span>Fees</span>
                  <span>₹12,750</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/enroll?course=" + encodeURIComponent("Digital Marketing"))}
              className="mt-10 w-full bg-white text-orange-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition shadow-lg text-lg cursor-pointer"
            >
              Enroll Now
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Extra Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          <div className="bg-white rounded-3xl shadow p-8 text-center hover:-translate-y-2 transition">
            <FaBullhorn className="text-5xl text-orange-500 mx-auto mb-4" />
            <h4 className="font-bold text-lg">Campaign Labs</h4>
          </div>

          <div className="bg-white rounded-3xl shadow p-8 text-center hover:-translate-y-2 transition">
            <FaProjectDiagram className="text-5xl text-orange-500 mx-auto mb-4" />
            <h4 className="font-bold text-lg">Live Projects</h4>
          </div>

          <div className="bg-white rounded-3xl shadow p-8 text-center hover:-translate-y-2 transition">
            <FaCertificate className="text-5xl text-orange-500 mx-auto mb-4" />
            <h4 className="font-bold text-lg">Certification</h4>
          </div>

          <div className="bg-white rounded-3xl shadow p-8 text-center hover:-translate-y-2 transition">
            <FaBriefcase className="text-5xl text-orange-500 mx-auto mb-4" />
            <h4 className="font-bold text-lg">Placement Support</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingCourse;