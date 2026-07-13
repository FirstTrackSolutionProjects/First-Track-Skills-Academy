import React from "react";
import {
  FaUserPlus,
  FaLaptopCode,
  FaTasks,
  FaUserTie,
  FaRocket,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: <FaUserPlus />,
    title: "Enroll",
    desc: "Choose your preferred course and complete your registration in just a few minutes.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Learn",
    desc: "Attend live interactive classes guided by experienced industry mentors.",
  },
  {
    icon: <FaTasks />,
    title: "Practice",
    desc: "Build real-world projects, complete assignments and improve your technical skills.",
  },
  {
    icon: <FaUserTie />,
    title: "Interview Ready",
    desc: "Prepare with resume building, mock interviews and career guidance.",
  },
  {
    icon: <FaRocket />,
    title: "Get Placed",
    desc: "Receive placement assistance and confidently begin your professional journey.",
  },
];

const LearningJourney = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-[#FFF8F0] overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center mb-14 md:mb-20">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            LEARNING JOURNEY
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mt-6 text-gray-900 leading-tight">
            Your Path To
            <span className="text-orange-500"> Success</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-5 text-base md:text-lg text-gray-600 leading-8">
            Follow our step-by-step roadmap from enrollment to placement and
            become industry-ready with confidence.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Image */}

          <div>

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
              alt="Learning Journey"
              className="rounded-[30px] shadow-2xl w-full object-cover"
            />

          </div>

          {/* Timeline */}

          <div className="relative">

            <div className="absolute left-8 top-5 bottom-5 w-1 bg-orange-200 rounded-full"></div>

            {steps.map((step, index) => (

              <div
                key={index}
                className="relative flex gap-5 mb-8 group"
              >

                <div className="relative z-10">

                  <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-all duration-300">

                    {step.icon}

                  </div>

                </div>

                <div className="flex-1 bg-white rounded-3xl border border-orange-100 shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

                  <div className="flex justify-between items-center mb-3">

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>

                    <span className="text-orange-500 font-bold text-lg">
                      {String(index + 1).padStart(2, "0")}
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

        <div className="mt-16 md:mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[30px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">

          <div>

            <span className="uppercase tracking-wider text-orange-100 font-semibold">
              Ready To Begin?
            </span>

            <h2 className="text-2xl md:text-4xl font-bold text-white mt-3">
              Start Your Learning Journey Today
            </h2>

            <p className="mt-4 text-orange-100 leading-8 max-w-2xl">
              Learn from industry experts, work on live projects, earn
              certifications and receive dedicated placement support.
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

export default LearningJourney;