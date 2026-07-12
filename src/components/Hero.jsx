import React from "react";
import { useNavigate } from "react-router-dom";
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
    desc: "Learn directly from experienced professionals through practical sessions and real-world guidance.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Hands-on Learning",
    desc: "Practice every concept with coding exercises, assignments and implementation.",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Live Projects",
    desc: "Build industry-level projects that strengthen your portfolio and confidence.",
  },
  {
    icon: <FaClock />,
    title: "Flexible Learning",
    desc: "Attend live classes or watch recordings whenever it's convenient.",
  },
  {
    icon: <FaBookOpen />,
    title: "Updated Curriculum",
    desc: "Stay ahead with courses aligned to current industry requirements.",
  },
  {
    icon: <FaCertificate />,
    title: "Certification",
    desc: "Receive a professional course completion certificate after training.",
  },
];

const stats = [
  { value: "Live", label: "Interactive Classes" },
  { value: "Expert", label: "Mentors" },
  { value: "Career", label: "Guidance" },
  { value: "Projects", label: "Hands-on Learning" },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#FFF8F0] py-16 md:py-24">

      <div className="absolute top-24 left-24 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

          <div>

           

            <h2 className="text-3xl md:text-5xl font-bold mt-6 leading-tight text-gray-900">
              Learn Smarter,
              <br />
              <span className="text-orange-500">
                Grow Faster
              </span>
            </h2>

            <p className="mt-6 text-gray-600 text-base md:text-lg leading-8">
              We prepare students for successful careers through expert
              mentorship, live projects, practical training, internships,
              and placement support.
            </p>

            <button
              onClick={() => navigate("/courses")}
              className="mt-8 inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition hover:scale-105 shadow-lg"
            >
              Explore Courses
              <FaArrowRight />
            </button>

          </div>

            {/* Right Image */}
          <div className="relative hidden lg:flex justify-center">

            {/* Background Decoration */}
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

            <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-orange-100 rounded-full blur-3xl opacity-40"></div>

            <img
              src="https://media.istockphoto.com/id/1486721631/photo/e-learning-graduate-certificate-program-concept-businessman-hand-holding-light-bulb-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=3xMByKV9lOp0nMA18OVSwajf81V8ZJTQKzUyw7i4RvI="
              alt="Students Learning"
              className="relative w-full max-w-lg rounded-3xl shadow-2xl object-cover"
            />

          </div>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((item, index) => (

            <div
              key={index}
              className="group bg-white rounded-3xl p-8 border border-orange-100 shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-300"
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