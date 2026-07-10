import React from "react";
import {
  FaChalkboardTeacher,
  FaLaptopCode,
  FaProjectDiagram,
  FaClock,
  FaCertificate,
  FaBookOpen,
  FaArrowRight,
} from "react-icons/fa";

const features = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Industry Expert Trainers",
    desc: "Learn directly from experienced professionals working in top IT companies.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Hands-on Learning",
    desc: "Practice every concept with coding sessions and real implementations.",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Live Projects",
    desc: "Build industry-level projects that strengthen your portfolio.",
  },
  {
    icon: <FaClock />,
    title: "Flexible Learning",
    desc: "Attend live classes or watch recordings anytime.",
  },
  {
    icon: <FaBookOpen />,
    title: "Updated Curriculum",
    desc: "Courses are continuously updated with the latest technologies.",
  },
  {
    icon: <FaCertificate />,
    title: "Certification",
    desc: "Earn an industry-recognized certificate after course completion.",
  },
];

const Features = () => {
  return (
    <section className="relative py-24 bg-[#FFF8F0] overflow-hidden">

      {/* Background Decoration */}

      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Top Section */}

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

          <div>

            <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
              WHY CHOOSE US
            </span>

            <h2 className="text-5xl font-bold mt-6 leading-tight text-gray-900">
              Learn Smarter,
              <br />
              <span className="text-orange-500">
                Grow Faster
              </span>
            </h2>

            <p className="text-gray-600 text-lg mt-6 leading-8">
              We don't just teach technology. We prepare you for
              real careers through practical learning, live projects,
              mentorship and placement support.
            </p>

            <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition hover:scale-105">

              Explore Courses

              <FaArrowRight />

            </button>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

              <h3 className="text-5xl font-bold text-orange-500">
                10K+
              </h3>

              <p className="text-gray-600 mt-3">
                Students Trained
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

              <h3 className="text-5xl font-bold text-orange-500">
                95%
              </h3>

              <p className="text-gray-600 mt-3">
                Placement Success
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

              <h3 className="text-5xl font-bold text-orange-500">
                50+
              </h3>

              <p className="text-gray-600 mt-3">
                Industry Experts
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

              <h3 className="text-5xl font-bold text-orange-500">
                100+
              </h3>

              <p className="text-gray-600 mt-3">
                Live Projects
              </p>

            </div>

          </div>

        </div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((item, index) => (

            <div
              key={index}
              className="group bg-white rounded-[30px] p-8 shadow-md hover:shadow-2xl transition duration-500 hover:-translate-y-3 border border-transparent hover:border-orange-200"
            >

              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition">

                {item.icon}

              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Features;