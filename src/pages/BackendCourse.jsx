import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaNodeJs,
  FaServer,
  FaCloudUploadAlt,
  FaProjectDiagram,
  FaCertificate,
  FaBriefcase,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import {
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostman,
  SiGithub,
} from "react-icons/si";

const BackendCourse = () => {
  const navigate = useNavigate();

  const technologies = [
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
      icon: <SiMongodb />,
      title: "MongoDB",
      color: "text-green-700",
    },
    {
      icon: <SiMysql />,
      title: "MySQL",
      color: "text-blue-600",
    },
    {
      icon: <FaServer />,
      title: "REST APIs",
      color: "text-indigo-600",
    },
    {
      icon: <SiPostman />,
      title: "Postman",
      color: "text-orange-500",
    },
    {
      icon: <SiGithub />,
      title: "GitHub",
      color: "text-gray-800",
    },
    {
      icon: <FaCloudUploadAlt />,
      title: "Cloud Deployment",
      color: "text-purple-600",
    },
  ];

  const highlights = [
    "Node.js Architecture & Asynchronous Event Loop",
    "Express.js Server Design & Clean MVC Architecture",
    "Relational (MySQL) & NoSQL (MongoDB) Database Design",
    "Authentication & Security (JWT, bcrypt & OAuth)",
    "RESTful API Architecture & Postman Test Suites",
    "8+ Real-World Backend Services & APIs",
    "System Design, Caching & Cloud Deployments",
    "100% Placement Support & Mock Technical Interviews",
  ];

  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            PROGRAM 02
          </span>

          <h2 className="text-5xl font-bold mt-5 text-gray-900">
            Backend Development
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-8">
            Become a professional Backend Developer by mastering Node.js, Express.js,
            RESTful APIs, databases, authentication, cloud deployment, and system
            architecture with hands-on projects and placement preparation.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/enroll?course=" + encodeURIComponent("Backend Development"))}
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
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000"
              alt="Backend Development"
              className="rounded-[35px] shadow-2xl w-full object-cover h-[450px]"
            />

            <div className="absolute top-6 left-6 bg-white rounded-2xl shadow-xl px-6 py-4">
              <h3 className="text-3xl font-bold text-orange-500">
                120 Days
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

          {/* Right Skills Grid */}
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
                  <strong>120 Days</strong>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Mode</span>
                  <strong>Online Live Classes</strong>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span>Projects</span>
                  <strong>8+ Live Projects</strong>
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
                  <span>₹55,750</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/enroll?course=" + encodeURIComponent("Backend Development"))}
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
            <FaServer className="text-5xl text-orange-500 mx-auto mb-4" />
            <h4 className="font-bold text-lg">Backend Labs</h4>
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

export default BackendCourse;