import React from "react";
import { Link } from "react-router-dom";
import {
  FaCertificate,
  FaClock,
  FaMoneyBillWave,
  FaLaptopCode,
} from "react-icons/fa";

const fees = [
  {
    program: "Frontend Development",
    duration: "60 Days",
    fees: "₹25,750",
  },
  {
    program: "Backend Development",
    duration: "120 Days",
    fees: "₹55,750",
  },
  {
    program: "Full Stack Development",
    duration: "6 Months",
    fees: "₹75,750",
  },
  {
    program: "HR Management",
    duration: "45 Days",
    fees: "₹12,750",
  },
  {
    program: "Digital Marketing",
    duration: "45 Days",
    fees: "₹12,750",
  },
];

const ProgramFees = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-[#FFF8F0]">

      {/* Background Decorations */}

      <div className="absolute -top-40 left-0 w-96 h-96 rounded-full bg-orange-200 blur-3xl opacity-30"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-orange-100 blur-3xl opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto mb-16">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            PROGRAM FEES
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-6 text-gray-900">

            Program Fees

            <span className="text-orange-500">
              {" "}
              at a Glance
            </span>

          </h2>

          <p className="mt-6 text-gray-600 leading-8 text-lg">
            Transparent and affordable pricing with live classes,
            hands-on projects, internship support, certification,
            and placement assistance.
          </p>

        </div>

        {/* Desktop Table */}

        <div className="hidden lg:block bg-white rounded-3xl overflow-hidden shadow-2xl">

          <table className="w-full">

            <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">

              <tr>

                <th className="text-left px-8 py-6 text-lg">
                  Program
                </th>

                <th className="text-left px-8 py-6 text-lg">
                  Duration
                </th>

                <th className="text-left px-8 py-6 text-lg">
                  Course Fee
                </th>

              </tr>

            </thead>

            <tbody>

              {fees.map((course, index) => (

                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-orange-50 transition-all duration-300"
                >

                  <td className="px-8 py-6">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">

                        <FaLaptopCode className="text-orange-500 text-xl" />

                      </div>

                      <span className="font-semibold text-gray-800 text-lg">
                        {course.program}
                      </span>

                    </div>

                  </td>

                  <td className="px-8 py-6">

                    <div className="flex items-center gap-3 text-gray-700">

                      <FaClock className="text-orange-500" />

                      {course.duration}

                    </div>

                  </td>

                  <td className="px-8 py-6">

                    <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-bold">

                      <FaMoneyBillWave />

                      {course.fees}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Mobile Cards */}

        <div className="grid gap-6 lg:hidden">

          {fees.map((course, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition"
            >

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                  <FaLaptopCode className="text-2xl text-orange-500" />

                </div>

                <div>

                  <h3 className="font-bold text-xl text-gray-800">
                    {course.program}
                  </h3>

                  <p className="text-gray-500">
                    Professional Training
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">

                <div>

                  <p className="text-gray-500 text-sm">
                    Duration
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <FaClock className="text-orange-500" />

                    <span className="font-semibold">
                      {course.duration}
                    </span>

                  </div>

                </div>

                <div>

                  <p className="text-gray-500 text-sm">
                    Course Fee
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <FaMoneyBillWave className="text-orange-500" />

                    <span className="font-bold text-orange-600 text-lg">
                      {course.fees}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

                {/* Certificate Section */}

        <div className="mt-16 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-3xl overflow-hidden shadow-2xl">

          <div className="grid lg:grid-cols-4 gap-8 items-center p-8 md:p-10">

            {/* Icon */}

            <div className="lg:col-span-1 flex justify-center">

              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">

                <FaCertificate className="text-6xl text-white" />

              </div>

            </div>

            {/* Content */}

            <div className="lg:col-span-3 text-white">

              <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                Industry Recognized
              </span>

              <h3 className="text-3xl md:text-4xl font-bold mt-5">
                Professional Course Certification
              </h3>

              <p className="mt-5 text-orange-100 leading-8 text-lg">

                Every student receives an industry-recognized certificate
                after successfully completing the course. Our certification
                validates your practical skills and enhances your resume,
                making you better prepared for internships and placement
                opportunities.

              </p>

            </div>

          </div>

        </div>

        {/* Bottom CTA */}

        <div className="mt-12 text-center">

          <h3 className="text-3xl font-bold text-gray-900">
            Affordable Programs with
            <span className="text-orange-500">
              {" "}Career Support
            </span>
          </h3>

          <p className="mt-5 max-w-3xl mx-auto text-gray-600 leading-8">

            All programs include expert-led live sessions,
            practical assignments, real-world projects,
            certification, interview preparation and placement
            assistance.

          </p>

          <Link
  to="/enroll"
  className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
>
  Enroll Now
</Link>

        </div>

      </div>

    </section>
  );
};

export default ProgramFees;