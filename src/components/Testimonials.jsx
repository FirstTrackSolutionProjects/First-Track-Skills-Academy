import React from "react";
import {
  FaQuoteLeft,
  FaStar,
  FaArrowRight,
  FaUsers,
  FaBriefcase,
  FaAward,
} from "react-icons/fa";

const testimonials = [
  {
    name: "Rahul Sharma",
    course: "Full Stack Development",
    company: "Infosys",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "The trainers were extremely supportive. Live projects and mock interviews helped me crack my first IT job. Highly recommended!",
  },
  {
    name: "Priya Verma",
    course: "Frontend Development",
    company: "TCS",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    review:
      "The practical sessions and placement guidance were outstanding. Every class was interactive and industry focused.",
  },
  {
    name: "Aman Singh",
    course: "Digital Marketing",
    company: "Accenture",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    review:
      "Amazing mentors and real projects. The learning experience completely changed my career path.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-[#FFF8F0]">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            SUCCESS STORIES
          </span>

          <h2 className="text-5xl font-bold mt-6 text-gray-900">
            What Our
            <span className="text-orange-500">
              {" "}Students Say
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
            Thousands of students have transformed their careers through
            our practical training, live projects and placement support.
          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

            <FaUsers className="text-5xl text-orange-500 mx-auto mb-4"/>

            <h3 className="text-5xl font-bold text-gray-900">
              10K+
            </h3>

            <p className="text-gray-500 mt-2">
              Students Trained
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

            <FaBriefcase className="text-5xl text-orange-500 mx-auto mb-4"/>

            <h3 className="text-5xl font-bold text-gray-900">
              95%
            </h3>

            <p className="text-gray-500 mt-2">
              Placement Success
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

            <FaAward className="text-5xl text-orange-500 mx-auto mb-4"/>

            <h3 className="text-5xl font-bold text-gray-900">
              4.9★
            </h3>

            <p className="text-gray-500 mt-2">
              Student Rating
            </p>

          </div>

        </div>

        {/* Testimonials */}

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {testimonials.map((student, index) => (

            <div
              key={index}
              className="relative bg-white rounded-[30px] p-8 shadow-lg hover:-translate-y-3 hover:shadow-2xl transition duration-500"
            >

              <div className="absolute top-6 right-6">

                <FaQuoteLeft className="text-5xl text-orange-100"/>

              </div>

              <div className="flex items-center gap-4 mb-6">

                <img
                  src={student.image}
                  alt={student.name}
                  className="w-16 h-16 rounded-full border-4 border-orange-200"
                />

                <div>

                  <h4 className="font-bold text-lg text-gray-900">
                    {student.name}
                  </h4>

                  <p className="text-gray-500 text-sm">
                    {student.course}
                  </p>

                </div>

              </div>

              <div className="flex gap-1 text-yellow-400 mb-5">

                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />

              </div>

              <p className="text-gray-600 leading-8 italic">
                "{student.review}"
              </p>

              <div className="mt-8 inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                Placed at {student.company}
              </div>

            </div>

          ))}

        </div>

        {/* CTA */}

        <div className="mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[35px] px-12 py-14 flex flex-col lg:flex-row items-center justify-between gap-10 text-white">

          <div>

            <span className="uppercase tracking-widest text-orange-100">
              Join Our Community
            </span>

            <h2 className="text-4xl font-bold mt-4">
              Become Our Next Success Story
            </h2>

            <p className="mt-4 text-orange-100 text-lg max-w-2xl">
              Learn from industry experts, build live projects,
              earn certifications and get placement assistance.
            </p>

          </div>

          <button className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition">

            Enroll Now

            <FaArrowRight/>

          </button>

        </div>

      </div>

    </section>
  );
};

export default Testimonials;