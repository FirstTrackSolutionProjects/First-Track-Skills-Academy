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
    desc: "Gain practical experience and become interview ready.",
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
    desc: "Build digital skills to scale your business.",
  },
];

const WhoCanJoin = () => {
  return (
    <section className="py-24 bg-[#FFF8F0] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-20">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            WHO CAN JOIN?
          </span>

          <h2 className="text-5xl font-bold mt-6 text-gray-900">
            Learning Is For
            <span className="text-orange-500"> Everyone</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-8">
            No matter where you are in your career journey,
            our training programs are designed to help you
            learn, grow and succeed.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
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

          {/* Right */}

          <div className="grid sm:grid-cols-2 gap-6">

            {learners.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-[30px] p-7 shadow-lg hover:-translate-y-3 hover:shadow-2xl transition duration-500 group"
              >

                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-5 group-hover:bg-orange-500 group-hover:text-white transition">

                  {item.icon}

                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">

                  {item.title}

                </h3>

                <p className="text-gray-600 leading-7">

                  {item.desc}

                </p>

              </div>

            ))}

          </div>

        </div>

        {/* CTA */}

        <div className="mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[35px] px-12 py-14 text-white flex flex-col lg:flex-row items-center justify-between gap-10">

          <div>

            <span className="uppercase tracking-widest text-orange-100 font-semibold">
              Start Today
            </span>

            <h2 className="text-4xl font-bold mt-4">
              Your Dream Career Starts Here
            </h2>

            <p className="mt-4 text-orange-100 text-lg max-w-2xl">
              Join thousands of successful students learning
              industry-ready skills with live projects,
              certifications and placement assistance.
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

export default WhoCanJoin;