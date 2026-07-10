import React from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaReact,
  FaGitAlt,
  FaFigma,
  FaCheckCircle,
  FaArrowRight,
  FaLaptopCode,
  FaProjectDiagram,
  FaBriefcase,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiVite,
} from "react-icons/si";

const technologies = [
  { icon: <FaHtml5 />, title: "HTML5", color: "text-orange-600" },
  { icon: <FaCss3Alt />, title: "CSS3", color: "text-blue-600" },
  { icon: <FaJsSquare />, title: "JavaScript", color: "text-yellow-500" },
  { icon: <FaReact />, title: "React JS", color: "text-cyan-500" },
  { icon: <SiTailwindcss />, title: "Tailwind CSS", color: "text-sky-500" },
  { icon: <SiVite />, title: "Vite", color: "text-purple-500" },
  { icon: <FaGitAlt />, title: "Git & GitHub", color: "text-red-500" },
  { icon: <FaFigma />, title: "Figma", color: "text-pink-500" },
];

const roadmap = [
  "HTML & CSS",
  "JavaScript ES6+",
  "Responsive Design",
  "React.js",
  "Tailwind CSS",
  "React Router",
  "API Integration",
  "Deployment",
];

const FrontendCourse = () => {
  return (
    <section className="pt-32 pb-20 bg-[#FFF8F0]">

      <div className="max-w-7xl mx-auto px-6">

        {/* Hero */}

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
              PROGRAM 01
            </span>

            <h1 className="text-5xl font-bold mt-6">
              Frontend
              <span className="text-orange-500"> Development</span>
            </h1>

            <p className="text-lg text-gray-600 mt-6 leading-8">
              Become a professional Frontend Developer by learning
              HTML, CSS, JavaScript, React, Tailwind CSS and build
              modern responsive websites with live projects.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">

              <div className="bg-white rounded-2xl p-6 shadow">

                <h2 className="text-3xl font-bold text-orange-500">
                  60 Days
                </h2>

                <p className="text-gray-500 mt-2">
                  Course Duration
                </p>

              </div>

              <div className="bg-white rounded-2xl p-6 shadow">

                <h2 className="text-3xl font-bold text-orange-500">
                  8+
                </h2>

                <p className="text-gray-500 mt-2">
                  Live Projects
                </p>

              </div>

            </div>

            <button className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-semibold">

              Apply Now

              <FaArrowRight />

            </button>

          </div>

          <div>

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
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

          <p className="text-center text-gray-600 mt-4">
            Master the latest frontend technologies used by top companies.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

            {technologies.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow text-center hover:-translate-y-2 hover:shadow-xl transition"
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

              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Beginner Level
              </h3>

              {[
                "HTML5 & Semantic Tags",
                "CSS3 & Flexbox",
                "CSS Grid",
                "Responsive Web Design",
                "JavaScript Basics",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 mb-4">
                  <FaCheckCircle className="text-green-500" />
                  <span>{item}</span>
                </div>
              ))}

            </div>

            <div className="bg-white rounded-3xl p-8 shadow">

              <h3 className="text-2xl font-bold text-orange-500 mb-6">
                Advanced Level
              </h3>

              {[
                "React.js",
                "Tailwind CSS",
                "React Router",
                "REST API Integration",
                "Deployment on Netlify & Vercel",
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
            Live Projects You'll Build
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            {[
              "Portfolio Website",
              "E-Commerce Website",
              "Learning Management Dashboard",
            ].map((project, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow hover:-translate-y-2 hover:shadow-xl transition"
              >

                <FaProjectDiagram className="text-5xl text-orange-500 mb-6" />

                <h3 className="text-xl font-bold">
                  {project}
                </h3>

                <p className="text-gray-600 mt-4 leading-7">
                  Develop real-world frontend applications using modern UI,
                  APIs and responsive layouts.
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-2 gap-10 mt-24">

          <div className="bg-white rounded-3xl p-10 shadow">

            <h3 className="text-3xl font-bold mb-8">
              Career Opportunities
            </h3>

            {[
              "Frontend Developer",
              "React Developer",
              "UI Developer",
              "Web Designer",
              "Software Engineer",
              "Freelance Web Developer",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-5"
              >
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
                <strong>60 Days</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Projects</span>
                <strong>8+</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Certificate</span>
                <strong>Included</strong>
              </div>

              <div className="flex justify-between border-b border-white/20 pb-3">
                <span>Placement Assistance</span>
                <strong>100%</strong>
              </div>

              <div className="flex justify-between text-2xl font-bold pt-4">
                <span>Course Fee</span>
                <span>₹29,999</span>
              </div>

            </div>

            <button className="w-full mt-10 bg-white text-orange-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition">

              Apply Now

              <FaArrowRight />

            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default FrontendCourse;