import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaServer,
  FaDatabase,
  FaCloudUploadAlt,
  FaNodeJs,
  FaPython,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaLaptopCode,
  FaProjectDiagram,
  FaBriefcase,
} from "react-icons/fa";
import {
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostman,
  SiGithub,
} from "react-icons/si";

const technologies = [
  { icon: <FaNodeJs />, title: "Node.js", color: "text-green-600" },
  { icon: <SiExpress />, title: "Express.js", color: "text-gray-700" },
  { icon: <SiMongodb />, title: "MongoDB", color: "text-green-700" },
  { icon: <SiMysql />, title: "MySQL", color: "text-blue-600" },
  { icon: <FaPython />, title: "Python", color: "text-yellow-500" },
  { icon: <SiPostman />, title: "Postman", color: "text-orange-500" },
  { icon: <SiGithub />, title: "Git & GitHub", color: "text-black" },
  { icon: <FaCloudUploadAlt />, title: "Deployment", color: "text-purple-600" },
];

const roadmap = [
  "Programming Fundamentals",
  "Node.js Basics",
  "Express.js Framework",
  "REST API Development",
  "Authentication & JWT",
  "MongoDB & MySQL",
  "MVC Architecture",
  "Deployment & Live Projects",
];

const BackendCourse = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 bg-[#FFF8F0]">

      <div className="max-w-7xl mx-auto px-6">

        {/* Hero */}

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
              PROGRAM 02
            </span>

            <h1 className="text-5xl font-bold mt-6 leading-tight">
              Backend
              <span className="text-orange-500"> Development</span>
            </h1>

            <p className="text-gray-600 mt-6 leading-8 text-lg">
              Become a professional Backend Developer by learning
              Node.js, Express.js, MongoDB, MySQL, Authentication,
              REST APIs and Deployment through live projects.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">

              <div className="bg-white rounded-2xl p-6 shadow">

                <h2 className="text-3xl font-bold text-orange-500">
                  120 Days
                </h2>

                <p className="text-gray-500 mt-2">
                  Course Duration
                </p>

              </div>

              <div className="bg-white rounded-2xl p-6 shadow">

                <h2 className="text-3xl font-bold text-orange-500">
                  2
                </h2>

                <p className="text-gray-500 mt-2">
                  Live Projects
                </p>

              </div>

            </div>

            <button
              onClick={() => navigate("/enroll")}
              className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-semibold transition">

              Apply Now

              <FaArrowRight />

            </button>

          </div>

          <div>

            <img
              src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900"
              alt=""
              className="rounded-3xl shadow-2xl"
            />

          </div>

        </div>

        {/* Technologies */}

        <div className="mt-24">

          <h2 className="text-4xl font-bold text-center">
            Technologies You'll Learn
          </h2>

          <p className="text-center text-gray-600 mt-4 max-w-3xl mx-auto">
            Master the most popular backend technologies used in
            modern software companies.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

            {technologies.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl p-8 text-center shadow hover:-translate-y-2 hover:shadow-xl transition"
              >

                <div className={`text-5xl ${item.color}`}>
                  {item.icon}
                </div>

                <h3 className="font-bold text-xl mt-5">
                  {item.title}
                </h3>

              </div>

            ))}

          </div>

        </div>

        {/* Learning Roadmap */}

        <div className="mt-24">

          <h2 className="text-4xl font-bold text-center">
            Learning Roadmap
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

            {roadmap.map((step, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl p-7 shadow relative"
              >

                <div className="absolute -top-4 left-6 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">

                  {index + 1}

                </div>

                <div className="mt-8">

                  <FaLaptopCode className="text-3xl text-orange-500 mb-4" />

                  <h3 className="font-bold text-lg">
                    {step}
                  </h3>

                </div>

              </div>

            ))}

          </div>

        </div>

                {/* Course Curriculum */}

        <div className="mt-24">

          <h2 className="text-4xl font-bold text-center">
            Course Curriculum
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mt-12">

            <div className="bg-white rounded-3xl p-8 shadow">
              <h3 className="text-2xl font-bold mb-6 text-orange-500">
                Beginner
              </h3>

              {[
                "Programming Fundamentals",
                "JavaScript for Backend",
                "Node.js Basics",
                "NPM & Packages",
                "Express.js Introduction",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 mb-4">
                  <FaCheckCircle className="text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow">
              <h3 className="text-2xl font-bold mb-6 text-orange-500">
                Advanced
              </h3>

              {[
                "MongoDB & MySQL",
                "JWT Authentication",
                "REST APIs",
                "Role Based Authentication",
                "Deployment",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 mb-4">
                  <FaCheckCircle className="text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Live Projects */}

        <div className="mt-24">

          <h2 className="text-4xl font-bold text-center">
            Live Projects
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            {[
              "E-Commerce API",
              "Student Management System",
              "Authentication System",
            ].map((project, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow hover:-translate-y-2 hover:shadow-xl transition"
              >

                <FaProjectDiagram className="text-5xl text-orange-500 mb-6" />

                <h3 className="text-xl font-bold">
                  {project}
                </h3>

                <p className="text-gray-600 mt-4">
                  Build an industry-level project using backend technologies.
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Bottom Section */}

        <div className="grid lg:grid-cols-2 gap-10 mt-24">

          <div className="bg-white rounded-3xl p-10 shadow">

            <h3 className="text-3xl font-bold mb-8">
              Career Opportunities
            </h3>

            {[
              "Backend Developer",
              "Node.js Developer",
              "API Developer",
              "Database Developer",
              "Software Engineer",
              "Full Stack Developer",
            ].map((item, index) => (
              <div key={index} className="flex gap-4 items-center mb-5">
                <FaBriefcase className="text-orange-500 text-xl" />
                <span>{item}</span>
              </div>
            ))}

          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 text-white">

            <h3 className="text-3xl font-bold mb-8">
              Course Information
            </h3>

            <div className="space-y-5">

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Duration</span>
                <strong>120 Days</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Projects</span>
                <strong>2</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Certificate</span>
                <strong>Included</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Placement Support</span>
                <strong>100%</strong>
              </div>

              <div className="flex justify-between text-2xl font-bold mt-8">
                <span>Fees</span>
                <span>₹55,750</span>
              </div>

            </div>
            

            <button 
               onClick={() => navigate("/enroll")}
               className="mt-10 w-full bg-white text-orange-600 py-4 rounded-xl font-bold flex justify-center items-center gap-3 hover:scale-105 transition">

              Apply Now

              <FaArrowRight />

            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default BackendCourse;