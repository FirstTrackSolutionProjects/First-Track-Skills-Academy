import React from "react";
import {
  FaUserGraduate,
  FaBriefcase,
  FaBuilding,
  FaChalkboardTeacher,
  FaArrowRight,
} from "react-icons/fa";

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
    title: "Placement Rate",
    desc: "Career Success",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <FaBuilding />,
    number: "150+",
    title: "Hiring Partners",
    desc: "Top Companies",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <FaChalkboardTeacher />,
    number: "50+",
    title: "Industry Mentors",
    desc: "Expert Trainers",
    color: "bg-purple-100 text-purple-600",
  },
];

const PlacementStats = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-white to-orange-100">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-20">

          <span className="inline-block px-5 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">
            OUR ACHIEVEMENTS
          </span>

          <h2 className="text-5xl font-bold text-gray-900 mt-6">
            Trusted By
            <span className="text-orange-500">
              {" "}Thousands of Students
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
            Our numbers reflect our commitment to quality education,
            practical learning and successful career outcomes.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (

            <div
              key={index}
              className="group bg-white rounded-[30px] shadow-lg hover:shadow-2xl hover:-translate-y-3 transition duration-500 p-8 text-center"
            >

              <div
                className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-6 ${item.color} group-hover:scale-110 transition`}
              >
                {item.icon}
              </div>

              <h2 className="text-5xl font-extrabold text-gray-900">
                {item.number}
              </h2>

              <h4 className="text-xl font-bold mt-4 text-gray-800">
                {item.title}
              </h4>

              <p className="text-gray-500 mt-2">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

        {/* Bottom CTA */}

        <div className="mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[35px] px-10 py-14 flex flex-col lg:flex-row items-center justify-between gap-8 text-white shadow-2xl">

          <div>

            <span className="uppercase tracking-widest text-orange-100">
              Start Your Journey
            </span>

            <h2 className="text-4xl font-bold mt-3">
              Become Our Next Success Story
            </h2>

            <p className="mt-4 text-orange-100 text-lg max-w-2xl">
              Join live classes, build real-world projects,
              earn industry-recognized certifications and
              get complete placement assistance.
            </p>

          </div>

          <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition">

            Enroll Now

            <FaArrowRight />

          </button>

        </div>

      </div>

    </section>
  );
};

export default PlacementStats;