import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaLaptopCode,
  FaServer,
  FaCode,
  FaRobot,
  FaCloud,
  FaArrowRight,
  FaBullhorn,
  FaUsers,
} from "react-icons/fa";
import { getCourses } from "../service/courseService";

const coursePresentation = {
  FRONTEND: {
    icon: <FaLaptopCode />,
    link: "/frontend-course",
    color: "from-blue-500 to-cyan-500",
  },
  BACKEND: {
    icon: <FaServer />,
    link: "/backend-course",
    color: "from-green-500 to-emerald-600",
  },
  FULLSTACK: {
    icon: <FaCode />,
    link: "/fullstack-course",
    color: "from-orange-500 to-red-500",
  },
  DEVOPS: {
    icon: <FaCloud />,
    link: "/hr-management-course",
    color: "from-amber-500 to-orange-600",
  },
  AI_ML: {
    icon: <FaBullhorn />,
    link: "/marketing-course",
    color: "from-pink-500 to-rose-600",
  },
};

const getPresentation = (course) => {
  if (course.slug === "digital-marketing") {
    return {
      icon: <FaBullhorn />,
      link: "/marketing-course",
      color: "from-pink-500 to-rose-600",
    };
  }
  if (course.slug === "hr-management") {
    return {
      icon: <FaUsers />,
      link: "/hr-management-course",
      color: "from-amber-500 to-orange-600",
    };
  }
  if (course.slug === "frontend-development") {
    return {
      icon: <FaLaptopCode />,
      link: "/frontend-course",
      color: "from-blue-500 to-cyan-500",
    };
  }
  if (course.slug === "backend-development") {
    return {
      icon: <FaServer />,
      link: "/backend-course",
      color: "from-green-500 to-emerald-600",
    };
  }
  if (course.slug === "full-stack-development") {
    return {
      icon: <FaCode />,
      link: "/fullstack-course",
      color: "from-orange-500 to-red-500",
    };
  }
  return coursePresentation[course.category] || coursePresentation.FULLSTACK;
};

const formatDuration = (weeks) => {
  if (!weeks) return "Duration available soon";
  if (weeks >= 24) return `${Math.round(weeks / 4)} Months`;
  return `${weeks} Weeks`;
};

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data || []);
      } catch (error) {
        console.error(error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            OUR COURSES
          </span>

          <h2 className="text-5xl font-bold text-gray-900 mt-6">
            Choose Your
            <span className="text-orange-500"> Career Path</span>
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 leading-8">
            Learn from industry experts through live classes, practical
            projects, certifications and placement support.
          </p>
        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center font-semibold text-gray-600 shadow-lg">
              Loading courses...
            </div>
          ) : courses.length ? courses.map((course) => {
            const presentation = getPresentation(course);

            return (
            <div
              key={course.id}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div
                className={`h-2 bg-gradient-to-r ${presentation.color}`}
              ></div>

              <div className="p-8">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${presentation.color} text-white flex items-center justify-center text-4xl shadow-lg`}
                >
                  {presentation.icon}
                </div>

                <h3 className="text-3xl font-bold mt-6">
                  {course.title}
                </h3>

                <p className="text-orange-500 font-semibold mt-3">
                  Duration : {formatDuration(course.duration_weeks)}
                </p>

                <p className="text-gray-600 mt-5 leading-7">
                  {course.description}
                </p>

                <Link
                  to={presentation.link}
                  className="inline-flex items-center gap-3 mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition group-hover:gap-4"
                >
                  View Details
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          );
        }) : (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center font-semibold text-gray-600 shadow-lg">
              Courses will appear here soon.
            </div>
          )}
        </div>

        {/* Bottom CTA */}

        <div className="mt-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl text-white p-10 flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Not Sure Which Course Is Right For You?
            </h2>

            <p className="mt-3 text-orange-100 max-w-2xl">
              Talk to our career counsellors and choose the perfect
              program based on your interests and career goals.
            </p>
          </div>

          <Link
            to="/contact"
            className="mt-6 lg:mt-0 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
          >
            Talk To Counsellor
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
