import React from "react";
import {
  FaLaptop,
  FaCertificate,
  FaProjectDiagram,
  FaRupeeSign,
  FaChalkboardTeacher,
  FaBriefcase,
} from "react-icons/fa";

const features = [
  {
    icon: <FaLaptop />,
    title: "Live Online Classes",
    description:
      "Interactive live sessions with expert mentors and recorded classes for flexible learning.",
  },
  {
    icon: <FaCertificate />,
    title: "Industry Certification",
    description:
      "Receive a professional certificate to strengthen your resume and career opportunities.",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Hands-on Projects",
    description:
      "Build real-world projects to gain practical experience and create a strong portfolio.",
  },
  {
    icon: <FaRupeeSign />,
    title: "Affordable Programs",
    description:
      "Quality training at student-friendly fees with flexible payment options.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "Expert Trainers",
    description:
      "Learn directly from experienced professionals with real industry knowledge.",
  },
  {
    icon: <FaBriefcase />,
    title: "Placement Support",
    description:
      "Resume building, mock interviews, internships and career guidance.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FFF8F0]">

      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center mb-14 md:mb-16">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            WHY CHOOSE US
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-6 leading-tight">
            Why Choose
            <span className="text-orange-500">
              {" "}First Track Skills Academy?
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-5 text-base md:text-lg text-gray-600 leading-8">
            Industry-focused training, practical learning, live projects,
            certifications and career guidance to help you become job-ready.
          </p>

        </div>

        {/* Cards */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((item, index) => (

            <div
              key={index}
              className="group bg-white rounded-3xl p-8 border border-orange-100 shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 flex flex-col"
            >

              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">

                {item.icon}

              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-7 flex-1">
                {item.description}
              </p>

            </div>

          ))}

        </div>

        {/* Bottom CTA */}

        <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[30px] p-8 md:p-10 text-center text-white shadow-xl">

          <h3 className="text-2xl md:text-3xl font-bold">
            Learn Today. Build Your Career Tomorrow.
          </h3>

          <p className="mt-4 text-orange-100 max-w-3xl mx-auto leading-8">
            Gain practical skills through expert mentorship, live projects,
            internship opportunities and dedicated placement support.
          </p>

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;