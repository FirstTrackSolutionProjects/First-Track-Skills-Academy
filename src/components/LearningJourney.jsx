import React from "react";
import {
  FaUserPlus,
  FaLaptopCode,
  FaTasks,
  FaUserTie,
  FaRocket,
  FaArrowRight,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus />,
    title: "Enroll",
    desc: "Choose your desired course and complete your registration in just a few minutes.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Learn",
    desc: "Attend live interactive classes guided by experienced industry mentors.",
  },
  {
    icon: <FaTasks />,
    title: "Practice",
    desc: "Build real-world projects, solve assignments and improve your coding skills.",
  },
  {
    icon: <FaUserTie />,
    title: "Interview Ready",
    desc: "Resume building, aptitude training and mock interviews with experts.",
  },
  {
    icon: <FaRocket />,
    title: "Get Placed",
    desc: "Receive placement assistance and launch your dream career confidently.",
  },
];

const LearningJourney = () => {
  return (
    <section className="py-24 bg-[#FFF8F0] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-20">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            LEARNING JOURNEY
          </span>

          <h2 className="text-5xl font-bold mt-6 text-gray-900">
            Your Path To
            <span className="text-orange-500"> Success</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
            Follow our structured roadmap from enrollment to placement.
            Every step is carefully designed to help you become
            industry-ready.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}

          <div>

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
              alt=""
              className="rounded-[35px] shadow-2xl"
            />

            <div className="grid grid-cols-2 gap-6 mt-8">

              <div className="bg-white rounded-3xl shadow-lg p-6 text-center">

                <h3 className="text-5xl font-bold text-orange-500">
                  10K+
                </h3>

                <p className="text-gray-500 mt-2">
                  Students
                </p>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 text-center">

                <h3 className="text-5xl font-bold text-orange-500">
                  95%
                </h3>

                <p className="text-gray-500 mt-2">
                  Placement
                </p>

              </div>

            </div>

          </div>

          {/* Right Side Timeline */}

          <div className="relative">

            <div className="absolute left-8 top-5 bottom-5 w-1 bg-orange-200"></div>

            {steps.map((step, index) => (

              <div
                key={index}
                className="relative flex gap-6 mb-10 group"
              >

                <div className="relative z-10">

                  <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition">

                    {step.icon}

                  </div>

                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 flex-1 hover:-translate-y-2 hover:shadow-2xl transition">

                  <div className="flex justify-between items-center mb-3">

                    <h3 className="text-2xl font-bold text-gray-900">

                      {step.title}

                    </h3>

                    <span className="text-orange-500 font-bold text-xl">

                      0{index + 1}

                    </span>

                  </div>

                  <p className="text-gray-600 leading-7">

                    {step.desc}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* CTA */}

        <div className="mt-24 rounded-[35px] bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-14 flex flex-col lg:flex-row items-center justify-between gap-10">

          <div>

            <span className="uppercase tracking-widest text-orange-100">
              Ready To Begin?
            </span>

            <h2 className="text-4xl font-bold mt-4">
              Start Your Learning Journey Today
            </h2>

            <p className="text-orange-100 mt-4 text-lg max-w-2xl">
              Learn from industry experts, work on live projects,
              earn certifications and get complete placement support.
            </p>

          </div>

          <button className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition">

            Enroll Now

            <FaArrowRight />

          </button>

        </div>

      </div>

    </section>
  );
};

export default LearningJourney;