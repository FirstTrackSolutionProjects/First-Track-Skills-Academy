import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaServer,
  FaCode,
  FaProjectDiagram,
  FaCertificate,
  FaBriefcase,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTailwindcss,
  SiExpress,
  SiMysql,
  SiMongodb,
  SiGithub,
} from "react-icons/si";

const FullStackCourse = () => {
  const technologies = [
    {
      icon: <FaReact />,
      title: "React.js",
      color: "text-sky-500",
    },
    {
      icon: <SiJavascript />,
      title: "JavaScript",
      color: "text-yellow-500",
    },
    {
      icon: <SiTailwindcss />,
      title: "Tailwind CSS",
      color: "text-cyan-500",
    },
    {
      icon: <FaNodeJs />,
      title: "Node.js",
      color: "text-green-600",
    },
    {
      icon: <SiExpress />,
      title: "Express.js",
      color: "text-gray-700",
    },
    {
      icon: <SiMysql />,
      title: "MySQL",
      color: "text-blue-600",
    },
    {
      icon: <SiMongodb />,
      title: "MongoDB",
      color: "text-green-700",
    },
    {
      icon: <SiGithub />,
      title: "GitHub",
      color: "text-gray-800",
    },
  ];

  const highlights = [
    "Frontend + Backend Complete Training",
    "12+ Real Industry Projects",
    "Admin Panel Development",
    "Authentication & APIs",
    "Database Design",
    "Resume & LinkedIn Building",
    "Mock Interviews",
    "Placement Assistance",
  ];

  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            PROGRAM 03
          </span>

          <h2 className="text-5xl font-bold mt-5 text-gray-900">
            Full Stack Development
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-8">
            Become a professional Full Stack Developer by mastering both
            frontend and backend technologies with real-world projects,
            APIs, databases, deployment and interview preparation.
          </p>

        </div>

        {/* Hero */}

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000"
              alt=""
              className="rounded-[35px] shadow-2xl"
            />

            <div className="absolute top-6 left-6 bg-white rounded-2xl shadow-xl px-6 py-4">

              <h3 className="text-3xl font-bold text-orange-500">
                6 Months
              </h3>

              <p className="text-gray-500">
                Intensive Program
              </p>

            </div>

            <div className="absolute bottom-6 right-6 bg-orange-500 text-white rounded-2xl px-6 py-4 shadow-xl">

              <h3 className="text-3xl font-bold">
                100%
              </h3>

              <p>Placement Support</p>

            </div>

          </div>

          {/* Right */}

          <div>

            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Technologies You'll Master
            </h3>

            <div className="grid grid-cols-2 gap-5">

              {technologies.map((item, index) => (

                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow hover:-translate-y-2 hover:shadow-xl transition"
                >

                  <div
                    className={`text-3xl ${item.color} mb-4`}
                  >
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

        {/* Bottom */}

        <div className="grid lg:grid-cols-2 gap-10 mt-20">

          {/* Highlights */}

          <div className="bg-white rounded-3xl shadow-lg p-10">

            <h3 className="text-2xl font-bold mb-8">
              Program Highlights
            </h3>

            <div className="space-y-5">

              {highlights.map((item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4"
                >

                  <FaCheckCircle className="text-orange-500" />

                  <span className="text-gray-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Course Details */}

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 text-white shadow-xl">

            <h3 className="text-3xl font-bold mb-8">
              Course Details
            </h3>

            <div className="space-y-6">

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Duration</span>
                <strong>6 Months</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Mode</span>
                <strong>Online / Offline</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Projects</span>
                <strong>12+ Live Projects</strong>
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
                <span>₹75,750</span>
              </div>

            </div>

            <button
              onClick={() => navigate("/enroll")}
              className="mt-10 w-full bg-white text-orange-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition">

              Enroll Now

              <FaArrowRight />

            </button>

          </div>

        </div>

        {/* Extra Features */}

        <div className="grid md:grid-cols-4 gap-6 mt-20">

          <div className="bg-white rounded-3xl shadow p-8 text-center hover:-translate-y-2 transition">
            <FaCode className="text-5xl text-orange-500 mx-auto mb-4" />
            <h4 className="font-bold text-lg">Coding Practice</h4>
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

export default FullStackCourse;