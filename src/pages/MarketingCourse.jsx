import React from "react";
import {
  FaBullhorn,
  FaUsers,
  FaSearch,
  FaChartLine,
  FaInstagram,
  FaBriefcase,
  FaUserTie,
  FaClipboardList,
  FaHandshake,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const MarketingCourse = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            PROGRAM 04
          </span>

          <h2 className="text-5xl font-bold text-gray-900 mt-5">
            Digital Marketing & HR Management
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-8">
            Build a successful career in Digital Marketing or Human Resource
            Management through practical learning, live projects and placement
            assistance.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Digital Marketing */}

          <div className="bg-[#FFF8F0] rounded-[35px] p-10 shadow-lg hover:-translate-y-2 transition">

            <div className="w-20 h-20 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-4xl mb-8">
              <FaBullhorn />
            </div>

            <h2 className="text-3xl font-bold mb-5">
              Digital Marketing
            </h2>

            <p className="text-gray-600 leading-8">
              Learn modern digital marketing strategies and tools used by
              leading brands to generate traffic, leads and sales.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10">

              {[
                {
                  icon: <FaSearch />,
                  title: "SEO",
                },
                {
                  icon: <FaChartLine />,
                  title: "Google Ads",
                },
                {
                  icon: <FaInstagram />,
                  title: "Social Media",
                },
                {
                  icon: <FaBullhorn />,
                  title: "Content Marketing",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow"
                >

                  <div className="text-orange-500 text-3xl mb-3">
                    {item.icon}
                  </div>

                  <h4 className="font-semibold">
                    {item.title}
                  </h4>

                </div>

              ))}

            </div>

          </div>

          {/* HR */}

          <div className="bg-orange-500 rounded-[35px] p-10 text-white shadow-lg hover:-translate-y-2 transition">

            <div className="w-20 h-20 rounded-2xl bg-white text-orange-500 flex items-center justify-center text-4xl mb-8">
              <FaUsers />
            </div>

            <h2 className="text-3xl font-bold mb-5">
              HR Management
            </h2>

            <p className="leading-8 text-orange-50">
              Master recruitment, payroll, employee engagement,
              performance management and corporate HR operations.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10">

              {[
                {
                  icon: <FaUserTie />,
                  title: "Recruitment",
                },
                {
                  icon: <FaClipboardList />,
                  title: "Payroll",
                },
                {
                  icon: <FaHandshake />,
                  title: "Employee Relations",
                },
                {
                  icon: <FaBriefcase />,
                  title: "HR Operations",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="bg-white/20 backdrop-blur rounded-2xl p-5"
                >

                  <div className="text-3xl mb-3">
                    {item.icon}
                  </div>

                  <h4 className="font-semibold">
                    {item.title}
                  </h4>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-2 gap-10 mt-20">

          {/* Features */}

          <div className="bg-[#FFF8F0] rounded-3xl p-10">

            <h3 className="text-3xl font-bold mb-8">
              What You'll Get
            </h3>

            <div className="space-y-5">

              {[
                "Live Interactive Classes",
                "Assignments & Case Studies",
                "Industry Experts",
                "Interview Preparation",
                "Resume Building",
                "Certificate",
                "Placement Assistance",
                "Lifetime Learning Support",
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex gap-4 items-center"
                >

                  <FaCheckCircle className="text-orange-500" />

                  <span className="text-gray-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Info */}

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 text-white">

            <h3 className="text-3xl font-bold mb-8">
              Course Details
            </h3>

            <div className="space-y-5">

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Duration</span>
                <strong>90 Days</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Mode</span>
                <strong>Online / Offline</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Projects</span>
                <strong>6+ Live Projects</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Certificate</span>
                <strong>Included</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Placement</span>
                <strong>100% Assistance</strong>
              </div>

              <div className="flex justify-between text-3xl font-bold mt-8">
                <span>Fees</span>
                <span>₹35,750</span>
              </div>

            </div>

            <button className="mt-10 w-full bg-white text-orange-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition">

              Enroll Now

              <FaArrowRight />

            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default MarketingCourse;