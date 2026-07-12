import React, { useState } from "react";
import {
  FaVideo,
  FaClipboardCheck,
  FaRobot,
  FaFileAlt,
  FaBriefcase,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const benefits = [
  {
    number: "01",
    icon: <FaVideo />,
    title: "Live & Recorded Sessions",
    description:
      "Attend interactive live classes and access recorded sessions anytime for revision.",
  },
  {
    number: "02",
    icon: <FaClipboardCheck />,
    title: "Weekly Assignments",
    description:
      "Strengthen your concepts through assignments, quizzes and practical coding exercises.",
  },
  {
    number: "03",
    icon: <FaRobot />,
    title: "AI-Powered Learning",
    description:
      "Use AI tools for coding practice, interview preparation and doubt solving.",
  },
  {
    number: "04",
    icon: <FaFileAlt />,
    title: "Resume & Interview Prep",
    description:
      "Create an ATS-friendly resume and prepare through mock interviews.",
  },
  {
    number: "05",
    icon: <FaBriefcase />,
    title: "Placement Support",
    description:
      "Get internship opportunities, placement assistance and career guidance.",
  },
];

const Benefits = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedBenefits = showAll ? benefits : benefits.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">

      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center mb-14 md:mb-16">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            STUDENT BENEFITS
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-6">
            What <span className="text-orange-500">Students Receive</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-5 text-base md:text-lg text-gray-600 leading-8">
            Every First Track Skills Academy program is designed to make you
            industry-ready through practical learning and complete career support.
          </p>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {displayedBenefits.map((item) => (

            <div
              key={item.number}
              className="group relative bg-[#FFF8F0] rounded-3xl p-8 border border-orange-100 shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 flex flex-col"
            >

              <div className="absolute top-6 right-6 text-5xl font-bold text-orange-100">
                {item.number}
              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">

                {item.icon}

              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-7 flex-1">
                {item.description}
              </p>

            </div>

          ))}

        </div>

        {/* Button */}

        <div className="flex justify-center mt-10">

          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {showAll ? (
              <>
                Show Less
                <FaChevronUp />
              </>
            ) : (
              <>
                Show More
                <FaChevronDown />
              </>
            )}
          </button>

        </div>

      </div>

    </section>
  );
};

export default Benefits;