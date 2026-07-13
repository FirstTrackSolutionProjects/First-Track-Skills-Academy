import React from "react";
import {
  FaUserGraduate,
  FaBriefcase,
  FaBuilding,
  FaChalkboardTeacher,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    icon: <FaUserGraduate />,
    number: "10K+",
    title: "Students Trained",
    desc: "Across India",
    color: "bg-orange-100 text-orange-500",
  },
  {
    icon: <FaBriefcase />,
    number: "95%",
    title: "Placement Support",
    desc: "Career Guidance",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <FaBuilding />,
    number: "150+",
    title: "Hiring Partners",
    desc: "Leading Companies",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <FaChalkboardTeacher />,
    number: "50+",
    title: "Expert Mentors",
    desc: "Industry Trainers",
    color: "bg-purple-100 text-purple-600",
  },
];

const PlacementStats = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 via-white to-orange-100">

      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center mb-14 md:mb-20">

          <span className="inline-block px-5 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">
            OUR ACHIEVEMENTS
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-6 leading-tight">
            Trusted By
            <span className="text-orange-500"> Thousands of Learners</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-5 text-base md:text-lg text-gray-600 leading-8">
            We help students build practical skills, earn certifications and
            prepare for successful careers.
          </p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">

          {stats.map((item, index) => (

            <div
              key={index}
              className="group bg-white rounded-3xl border border-orange-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 md:p-8 text-center"
            >

              <div
                className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-5 ${item.color} group-hover:scale-110 transition`}
              >
                {item.icon}
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
                {item.number}
              </h2>

              <h4 className="text-lg md:text-xl font-bold mt-3 text-gray-800">
                {item.title}
              </h4>

              <p className="text-sm md:text-base text-gray-500 mt-2">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

        {/* CTA */}

        <div className="mt-16 md:mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[30px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 text-white shadow-xl">

          <div>

            <span className="uppercase tracking-wider text-orange-100 font-semibold">
              Start Your Journey
            </span>

            <h2 className="text-2xl md:text-4xl font-bold mt-3">
              Become Our Next Success Story
            </h2>

            <p className="mt-4 text-orange-100 leading-8 max-w-2xl">
              Learn from industry experts, build real-world projects and receive
              dedicated placement assistance to achieve your career goals.
            </p>

          </div>

          <button
            onClick={() => navigate("/enroll")}
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition hover:scale-105 whitespace-nowrap"
          >
            Enroll Now
            <FaArrowRight />
          </button>

        </div>

      </div>

    </section>
  );
};

export default PlacementStats;