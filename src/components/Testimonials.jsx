import React from "react";
import {
  FaQuoteLeft,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

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
  {
    name: "Sneha Patel",
    course: "Backend Development",
    company: "Wipro",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    review:
      "Excellent mentors, hands-on assignments and placement support helped me secure my dream job.",
  },
  {
    name: "Rohit Kumar",
    course: "Frontend Development",
    company: "Capgemini",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    review:
      "The live classes and project-based learning gave me confidence to clear technical interviews.",
  },
];

const Testimonials = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}
        <div className="text-center">
          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            SUCCESS STORIES
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mt-6 text-gray-900 leading-tight">
            What Our
            <span className="text-orange-500"> Students Say</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-5 text-base md:text-lg text-gray-600 leading-8">
            Hear from learners who transformed their careers through practical
            training, live projects and dedicated placement support.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="mt-14">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            grabCursor={true}
            spaceBetween={24}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 1.2,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((student, index) => (
              <SwiperSlide key={index}>
                <div className="relative bg-white rounded-3xl border border-orange-100 p-7 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">

                  <div className="absolute top-6 right-6">
                    <FaQuoteLeft className="text-5xl text-orange-100" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-16 h-16 rounded-full border-4 border-orange-200 object-cover"
                    />

                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {student.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {student.course}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 text-yellow-400 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  <p className="text-gray-600 leading-7 italic">
                    "{student.review}"
                  </p>

                  <div className="mt-7 inline-flex bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Placed at {student.company}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[30px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 text-white shadow-xl">

          <div>
            <span className="uppercase tracking-wider text-orange-100 font-semibold">
              Join Our Community
            </span>

            <h2 className="text-2xl md:text-4xl font-bold mt-3">
              Become Our Next Success Story
            </h2>

            <p className="mt-4 text-orange-100 leading-8 max-w-2xl">
              Learn from industry experts, build real-world projects, earn
              certifications and receive complete placement assistance.
            </p>
          </div>

          <button
            onClick={() => navigate("/career")}
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition hover:scale-105"
          >
            Enroll Now
            <FaArrowRight />
          </button>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;