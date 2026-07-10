import React from "react";
import { FaCertificate } from "react-icons/fa";

const fees = [
  {
    program: "Frontend Development",
    duration: "90 Days",
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
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <span className="inline-block bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            PROGRAM FEES
          </span>

          <h2 className="text-5xl font-bold mt-6 text-gray-900">
            Program Fees <span className="text-orange-500">at a Glance</span>
          </h2>

          <p className="text-gray-600 mt-5 max-w-3xl mx-auto leading-8">
            Transparent and affordable pricing with live classes,
            projects, certification and placement assistance.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-orange-500 text-white">

              <tr>

                <th className="py-5 px-6 text-left">
                  Program
                </th>

                <th className="py-5 px-6 text-left">
                  Duration
                </th>

                <th className="py-5 px-6 text-left">
                  Fees
                </th>

              </tr>

            </thead>

            <tbody>

              {fees.map((course, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-orange-50 transition"
                >

                  <td className="py-5 px-6 font-medium">
                    {course.program}
                  </td>

                  <td className="py-5 px-6">
                    {course.duration}
                  </td>

                  <td className="py-5 px-6 font-bold text-orange-500">
                    {course.fees}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl text-white p-8 flex gap-5 items-start shadow-lg">

          <FaCertificate className="text-3xl mt-1" />

          <p className="leading-8">
            Upon successful completion, every student receives an
            <strong> Industry Recognized Certificate </strong>
            from <strong>First Track Skills Academy</strong> validating
            their skills for internships and employment opportunities.
          </p>

        </div>

      </div>
    </section>
  );
};

export default ProgramFees;