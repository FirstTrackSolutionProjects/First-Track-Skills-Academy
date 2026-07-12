import React from "react";
import {
  FaUserGraduate,
  FaBriefcase,
  FaUserTie,
  FaExchangeAlt,
  FaLaptopHouse,
  FaRocket,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const learners = [
  {
    icon: <FaUserGraduate />,
    title: "College Students",
    desc: "Prepare yourself with industry-ready skills before graduation.",
  },
  {
    icon: <FaBriefcase />,
    title: "Working Professionals",
    desc: "Upgrade your skills and accelerate your career growth.",
  },
  {
    icon: <FaUserTie />,
    title: "Freshers",
    desc: "Gain practical experience and become interview-ready.",
  },
  {
    icon: <FaExchangeAlt />,
    title: "Career Switchers",
    desc: "Transition confidently into the IT industry.",
  },
  {
    icon: <FaLaptopHouse />,
    title: "Freelancers",
    desc: "Learn high-demand skills and start earning independently.",
  },
  {
    icon: <FaRocket />,
    title: "Entrepreneurs",
    desc: "Build digital skills to grow your business.",
  },
];

const WhoCanJoin = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-[#FFF8F0] overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center mb-14 md:mb-20">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            WHO CAN JOIN?
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mt-6 text-gray-900 leading-tight">
            Learning Is For
            <span className="text-orange-500"> Everyone</span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-8">
            Whether you're a student, professional, fresher or entrepreneur,
            our programs help you gain practical skills and build a successful career.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image */}

          <div>

            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
              alt="Students Learning"
              className="rounded-[30px] shadow-2xl w-full object-cover"
            />

          </div>

          {/* Cards */}

          <div className="grid sm:grid-cols-2 gap-6">

            {learners.map((item, index) => (

              <div
                key={index}
                className="group bg-white rounded-3xl p-7 shadow-md border border-orange-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 flex flex-col"
              >

                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-5 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">

                  {item.icon}

                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-7 flex-1">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* CTA */}

        <div className="mt-16 md:mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[30px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">

          <div>

            <span className="uppercase tracking-wider text-orange-100 font-semibold">
              Start Today
            </span>

            <h2 className="text-2xl md:text-4xl font-bold text-white mt-3">
              Your Dream Career Starts Here
            </h2>

            <p className="mt-4 text-orange-100 leading-8 max-w-2xl">
              Join First Track Skills Academy and learn through live classes,
              real projects, expert mentorship and placement support.
            </p>

          </div>

          <button
            onClick={() => navigate("/career")}
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

export default WhoCanJoin;